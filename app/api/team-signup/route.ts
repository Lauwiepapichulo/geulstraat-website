import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@sanity/client'

// Resend pas aanmaken bij request (niet bij build), anders faalt build op Vercel zonder RESEND_API_KEY
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

// Sanity client met schrijfrechten om de aanmelding op te slaan
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vs1rb6mu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
})

const TEAM_NAMES: Record<string, string> = {
  'green-team': 'Green Team',
  'clean-team': 'Clean Team',
  'happy-team': 'Happy Team',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, team, teamName } = body

    if (!name || !email || !team) {
      return NextResponse.json(
        { error: 'Vul je naam, e-mailadres en team in' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Vul een geldig e-mailadres in' },
        { status: 400 }
      )
    }

    const displayTeam = teamName || TEAM_NAMES[team] || team

    // 1. Opslaan in Sanity (teamlijst). Voorkom dubbele aanmeldingen per team.
    try {
      const existing = await writeClient.fetch(
        `*[_type == "teamSignup" && email == $email && team == $team][0]._id`,
        { email, team }
      )
      if (!existing) {
        await writeClient.create({
          _type: 'teamSignup',
          name,
          email,
          phone: phone || undefined,
          message: message || undefined,
          team,
          signedUpAt: new Date().toISOString(),
        })
      }
    } catch (sanityError) {
      // Opslaan mag de mail niet blokkeren, maar we loggen het wel
      console.error('Sanity teamSignup opslaan mislukt:', sanityError)
    }

    // 2. E-mail versturen naar de beheerder
    const resend = getResend()
    if (!resend) {
      // Geen mail mogelijk, maar de aanmelding staat wel in Sanity
      return NextResponse.json({ success: true, stored: true, emailed: false })
    }

    const recipient = process.env.RECIPIENT_EMAIL || 'info@geulstraatamsterdam.nl'

    const { data, error } = await resend.emails.send({
      from: 'De Geulstraat <contact@geulstraatamsterdam.nl>',
      to: [recipient],
      replyTo: email,
      subject: `[Teamaanmelding] ${displayTeam} - ${name}`,
      html: `
        <h2>Nieuwe aanmelding voor het ${displayTeam}</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Telefoon:</strong> ${phone}</p>` : ''}
        ${message ? `<hr /><h3>Bericht:</h3><p style="white-space: pre-wrap;">${message}</p>` : ''}
        <hr />
        <p style="color: #666; font-size: 12px;">
          Deze aanmelding is ook opgeslagen in de teamlijst in Sanity.
        </p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      // Mail mislukt maar aanmelding staat in Sanity - toch succes melden
      return NextResponse.json({ success: true, stored: true, emailed: false })
    }

    return NextResponse.json({ success: true, stored: true, emailed: true, id: data?.id })
  } catch (error) {
    console.error('Team signup error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}
