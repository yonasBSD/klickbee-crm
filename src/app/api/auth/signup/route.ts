import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { hash } from "bcryptjs"
import { sendEmail } from "@/libs/email"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        status: 'Inactive',
      },
    })
    try {
      await sendEmail({
        to: email,
        subject: "Activate your Klickbee CRM account",
        text: `Hello${name ? ` ${name}` : ''},\n\nYour account has been created and is currently inactive. Please follow the activation instructions sent to you to activate your account.`,
        html: `<p>Hello${name ? ` ${name}` : ''},</p><p>Your account has been created and is currently <b>inactive</b>.</p><p>Please follow the activation instructions to activate your account.</p>`,
      })
    } catch (e) {
      console.error('Failed to send activation email', e)
      // proceed without failing the signup
    }

    return NextResponse.json({ success: true, user })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
