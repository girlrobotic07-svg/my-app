import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/components/emails/WelcomeEmail'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { email, name } = await request.json()

  try {
    await resend.emails.send({
      from: 'MyApp <onboarding@yourdomain.com>',  // use your verified domain
      to: email,
      subject: 'Welcome to MyApp! 🎉',
      react: WelcomeEmail({ name }),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}