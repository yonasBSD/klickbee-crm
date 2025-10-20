import nodemailer from "nodemailer"

type SendEmailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string }> {
  const smtpHost = "smtp.gmail.com"
  const smtpPort = 587
  const smtpUser = process.env.SMTP_USER || ""
  const smtpPass = process.env.SMTP_PASS || ""

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  })

  const info = await transporter.sendMail({
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })

  return { success: true, messageId: info.messageId }
}


