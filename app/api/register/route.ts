import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Create a client with write access
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vs1rb6mu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Requires a write token
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, buurtActieId } = body

    // Validate required fields
    if (!name || !email || !buurtActieId) {
      return NextResponse.json(
        { error: 'Naam, email en buurt actie zijn verplicht' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig e-mailadres' },
        { status: 400 }
      )
    }

    // Check if already registered
    const existingRegistration = await writeClient.fetch(
      `*[_type == "registration" && email == $email && buurtActie._ref == $buurtActieId][0]`,
      { email, buurtActieId }
    )

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Je bent al ingeschreven voor deze buurt actie' },
        { status: 400 }
      )
    }

    // Create the registration
    const registration = await writeClient.create({
      _type: 'registration',
      name,
      email,
      phone: phone || undefined,
      message: message || undefined,
      buurtActie: {
        _type: 'reference',
        _ref: buurtActieId,
      },
      registeredAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: true, message: 'Inschrijving gelukt!', id: registration._id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}
