import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      email,
      serviceType,
      serviceName,
      preferredDate,
      preferredTime,
    } = body

    // Walidacja wymaganych pól
    if (!email || !firstName || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Brakujące wymagane dane' },
        { status: 400 }
      )
    }

    // HTML template email potwierdzającego dla klienta
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #2C2C2C;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #F0FFF0;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .section {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #4CAF50;
            }
            .highlight {
              background: #E8F5E9;
              padding: 15px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #4CAF50;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .checkmark {
              font-size: 48px;
              color: #4CAF50;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="checkmark">✓</div>
            <h1>Wizyta Potwierdzona!</h1>
          </div>

          <div class="content">
            <p>Witaj ${firstName}!</p>

            <p><strong>Świetne wiadomości!</strong> Twoja wizyta została oficjalnie potwierdzona.</p>

            <div class="highlight">
              <h2 style="margin-top: 0; color: #4CAF50;">📅 Szczegóły Twojej wizyty:</h2>
              <p style="font-size: 18px; margin: 10px 0;">
                <strong>Data:</strong> ${preferredDate}<br>
                <strong>Godzina:</strong> ${preferredTime}<br>
                <strong>Usługa:</strong> ${serviceName || serviceType}
              </p>
            </div>

            <div class="section">
              <h2>📍 Gdzie nas znajdziesz?</h2>
              <p><strong>Royal Lips - Joanna Wielgos</strong><br>
              [Tutaj dodaj dokładny adres gabinetu]</p>
            </div>

            <div class="section">
              <h2>⏰ Ważne informacje przed wizytą:</h2>
              <ul>
                <li><strong>Przyjdź 5-10 minut wcześniej</strong> - dzięki temu będziemy mogli spokojnie rozpocząć zabieg</li>
                <li><strong>Nie pij kawy/alkoholu 24h przed zabiegiem</strong> - minimalizuje to ryzyko krwawienia</li>
                <li><strong>Nie zażywaj leków rozrzedzających krew</strong> (jeśli to możliwe)</li>
                <li><strong>Przychodź bez makijażu</strong> w obszarze zabiegu</li>
              </ul>
            </div>

            <div class="section" style="background: #FFF3CD; border-left-color: #FFC107;">
              <h2>❗ Musisz przełożyć wizytę?</h2>
              <p>Jeśli z jakiegoś powodu nie możesz przyjść, <strong>prosimy o kontakt minimum 24h wcześniej</strong>:</p>
              <p>📱 Telefon: +48 123 456 789<br>
              📧 Email: kontakt@example.com</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 18px; color: #4CAF50;">
                <strong>Czekamy na Ciebie!</strong> 💕
              </p>
              <p>Do zobaczenia,<br>
              Zespół Royal Lips</p>
            </div>
          </div>

          <div class="footer">
            <p>Royal Lips - Joanna Wielgos</p>
            <p>To jest automatyczna wiadomość potwierdzająca wizytę.</p>
            <p>Data wysłania: ${new Date().toLocaleString('pl-PL')}</p>
          </div>
        </body>
      </html>
    `

    // Wyślij email potwierdzający do klienta
    const result = await resend.emails.send({
      from: 'Royal Lips <onboarding@resend.dev>',
      to: email,
      subject: '✅ Twoja wizyta została potwierdzona! - Royal Lips',
      html: confirmationEmailHtml,
    })

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      message: 'Email potwierdzający został wysłany'
    })

  } catch (error) {
    console.error('Błąd wysyłki emaila potwierdzającego:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się wysłać emaila potwierdzającego'
      },
      { status: 500 }
    )
  }
}
