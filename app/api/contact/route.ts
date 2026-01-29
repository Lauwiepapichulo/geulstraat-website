import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Gebruik RECIPIENT_EMAIL op Vercel (bijv. info@geulstraatamsterdam.nl); lokaal fallback voor testen
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'laurensvduin@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validatie
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Vul alle verplichte velden in' },
        { status: 400 }
      )
    }

    // E-mail versturen via Resend
    const { data, error } = await resend.emails.send({
      from: 'De Geulstraat Website <onboarding@resend.dev>',
      to: [RECIPIENT_EMAIL],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <h2>Nieuw contactformulier bericht</h2>
        <p><strong>Van:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Telefoon:</strong> ${phone}</p>` : ''}
        <p><strong>Onderwerp:</strong> ${subject}</p>
        <hr />
        <h3>Bericht:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          Dit bericht is verzonden via het contactformulier op geulstraatamsterdam.nl
        </p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Er ging iets mis bij het versturen van het bericht' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}
