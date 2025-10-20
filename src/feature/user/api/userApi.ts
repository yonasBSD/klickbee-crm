import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { hash } from "bcryptjs"
import { sendEmail } from "@/libs/email"
import { withActivityLogging } from "@/libs/apiUtils"
import { ActivityAction } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/feature/auth/lib/auth"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const userId = url.searchParams.get("userId");

    const where = userId ? { id: userId } : undefined;
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 200),
    });

    return NextResponse.json({ success: true, users })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, name } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const dummyPassword = await hash("temporary-invite-password", 10)

    const createdUser = await withActivityLogging(
      async () => {
        return prisma.user.create({
          data: {
            email,
            name: name ?? null,
            password: dummyPassword,
            status: 'Invite' as any,
          }
        })
      },
      {
        entityType: "User",
        entityId: "",
        action: ActivityAction.Create,
        userId: session.user.id,
        getCurrentData: async (result: any) => result,
        metadata: { reason: "User invited" },
      }
    )

    try {
      await sendEmail({
        to: email,
        subject: "You're invited to Klickbee CRM",
        text: `Hello${name ? ` ${name}` : ""},\n\nYou've been invited to Klickbee CRM. Please check your email for next steps to set your password.`,
        html: `<p>Hello${name ? ` ${name}` : ""},</p><p>You've been invited to <b>Klickbee CRM</b>.</p><p>Please follow the instructions to set your password and activate your account.</p>`,
      })
    } catch (mailErr) {
      console.error("Failed to send invite email", mailErr)
      // Non-blocking: user creation succeeded; report email failure separately
      return NextResponse.json(
        { success: true, user: createdUser, emailSent: false },
        { status: 201 }
      )
    }

    return NextResponse.json({ success: true, user: createdUser, emailSent: true }, { status: 201 })
  } catch (err) {
    console.error("POST /users invite error", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
