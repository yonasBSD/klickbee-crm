import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { hash } from "bcryptjs"
import { sendEmail } from "@/libs/email"
import { withActivityLogging } from "@/libs/apiUtils"
import { ActivityAction } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/feature/auth/lib/auth"
import { randomBytes } from "crypto"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const userId = url.searchParams.get("userId");
    const status = url.searchParams.get("status");

    const where = {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {})
    } as any;
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
      // Generate verification token and URL for password setup
      const token = randomBytes(32).toString('hex')
      const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify?token=${token}&email=${encodeURIComponent(email)}&action=set_password`

      await sendEmail({
        to: email,
        subject: "You're invited to Klickbee CRM",
        text: `Hello${name ? ` ${name}` : ""},\n\nYou've been invited to Klickbee CRM. Please click the link below to set your password and activate your account:\n\n${verificationUrl}\n\nIf you didn't expect this invitation, please ignore this email.`,
        html: `<p>Hello${name ? ` ${name}` : ""},</p><p>You've been invited to <b>Klickbee CRM</b>.</p><p>Please click the button below to set your password and activate your account:</p><p><a href="${verificationUrl}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Set Password & Activate</a></p><p>If the button doesn't work, copy and paste this link into your browser:</p><p>${verificationUrl}</p><p>If you didn't expect this invitation, please ignore this email.</p>`,
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
