import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Webhook received:', body)

    // SheetDB webhook wysyła dane w formacie:
    // { row: { kolumna: wartość, ... } }
    const rowData = body.row || body

    const status = rowData.Status || rowData.status
    const email = rowData.Email || rowData.email
    const firstName = rowData['Imię'] || rowData.firstName
    const lastName = rowData['Nazwisko'] || rowData.lastName
    const serviceName = rowData['Usługa'] || rowData.service
    const preferredDate = rowData['Data wizyty'] || rowData.date
    const preferredTime = rowData['Godzina'] || rowData.time

    // Sprawdź czy status został zmieniony na "Potwierdzona"
    if (status?.toLowerCase() === 'potwierdzona' || status?.toLowerCase() === 'confirmed') {

      if (!email) {
        console.error('Brak adresu email w danych webhook')
        return NextResponse.json(
          { success: false, error: 'Brak adresu email' },
          { status: 400 }
        )
      }

      // Wywołaj endpoint wysyłający email potwierdzający
      try {
        const confirmationResponse = await fetch(
          `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/send-confirmation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              serviceName,
              preferredDate,
              preferredTime,
            }),
          }
        )

        const confirmationResult = await confirmationResponse.json()

        if (confirmationResult.success) {
          console.log('Email potwierdzający wysłany do:', email)
          return NextResponse.json({
            success: true,
            message: 'Email potwierdzający został wysłany',
            emailSent: true,
          })
        } else {
          console.error('Błąd wysyłki emaila:', confirmationResult.error)
          return NextResponse.json({
            success: false,
            error: 'Błąd wysyłki emaila potwierdzającego',
          }, { status: 500 })
        }
      } catch (emailError) {
        console.error('Błąd wywołania API emaila:', emailError)
        return NextResponse.json({
          success: false,
          error: 'Błąd wysyłki emaila',
        }, { status: 500 })
      }
    }

    // Dla innych statusów tylko loguj
    return NextResponse.json({
      success: true,
      message: 'Webhook przetworzony',
      status: status,
      emailSent: false,
    })

  } catch (error) {
    console.error('Błąd przetwarzania webhook:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Błąd przetwarzania webhook',
      },
      { status: 500 }
    )
  }
}

// Endpoint testowy do ręcznego testowania
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook endpoint działa',
    url: '/api/booking-webhook',
    instructions: 'Użyj metody POST z danymi rezerwacji',
  })
}
