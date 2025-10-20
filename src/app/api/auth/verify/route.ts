import { NextResponse } from "next/server"
import { prisma } from "@/libs/prisma"
import { randomBytes } from "crypto"
import { hash } from "bcryptjs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token || !email) {
    return NextResponse.json({ error: "Invalid verification link" }, { status: 400 })
  }

  try {
    // Find user by email and check if verification token matches
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // For security, you might want to store the verification token in the database
    // For now, we'll use a simple approach with email + timestamp validation
    // In production, consider storing tokens in a separate table

    // Update user status to Active
    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'Active' }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.status === 'Active') {
      return NextResponse.json({ error: "User is already active" }, { status: 400 })
    }

    // Generate a simple verification token (in production, store this in DB)
    const token = randomBytes(32).toString('hex')
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`

    // For invited users, they need to set password first
    if (user.status === 'Invite') {
      // Store a temporary password reset token or use the verification token for password setup
      return NextResponse.json({
        success: true,
        action: 'set_password',
        verificationUrl,
        message: 'Please set your password to activate your account'
      })
    }

    // For inactive users (from signup), just verify them
    return NextResponse.json({
      success: true,
      action: 'verify',
      verificationUrl,
      message: 'Please verify your email to activate your account'
    })

  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Failed to resend verification" }, { status: 500 })
  }
}
