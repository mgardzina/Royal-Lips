import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  // Inicjalizacja Resend
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const body = await request.json()
    
    // Wyciągnij dane z formularza
    const {
      firstName,
      lastName,
      email,
      phone,
      serviceType,
      preferredDate,
      preferredTime,
      hasAllergies,
      allergiesDetails,
      isPregnant,
      hasSkinConditions,
      skinConditionsDetails,
      takingMedication,
      medicationDetails,
      additionalNotes
    } = body

    // Określ nazwę usługi
    const serviceNames: Record<string, string> = {
      brwi: 'Makijaż permanentny brwi',
      usta: 'Makijaż permanentny ust',
      kreski: 'Makijaż permanentny kresek',
      inne: 'Inna usługa'
    }

    const serviceName = serviceNames[serviceType] || serviceType

    // HTML template email dla właścicielki
    const ownerEmailHtml = `
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
              background: linear-gradient(135deg, #D4A5A5 0%, #C9A961 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #FFF8F0;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .section {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #C9A961;
            }
            .label {
              font-weight: bold;
              color: #C9A961;
              margin-right: 10px;
            }
            .alert {
              background: #FFF3CD;
              border-left: 4px solid #FFC107;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ Nowa Rezerwacja!</h1>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>👤 Dane klienta</h2>
              <p><span class="label">Imię i nazwisko:</span>${firstName} ${lastName}</p>
              <p><span class="label">Email:</span><a href="mailto:${email}">${email}</a></p>
              <p><span class="label">Telefon:</span><a href="tel:${phone}">${phone}</a></p>
            </div>

            <div class="section">
              <h2>📅 Szczegóły wizyty</h2>
              <p><span class="label">Usługa:</span>${serviceName}</p>
              <p><span class="label">Preferowany termin:</span>${preferredDate} o ${preferredTime}</p>
            </div>

            ${hasAllergies || isPregnant || hasSkinConditions || takingMedication ? `
              <div class="alert">
                <h2>⚠️ Wywiad zdrowotny - WAŻNE!</h2>
                ${hasAllergies ? `<p><strong>Alergie:</strong> ${allergiesDetails || 'Tak'}</p>` : ''}
                ${isPregnant ? `<p><strong>Ciąża/Karmienie:</strong> Tak</p>` : ''}
                ${hasSkinConditions ? `<p><strong>Choroby skóry:</strong> ${skinConditionsDetails || 'Tak'}</p>` : ''}
                ${takingMedication ? `<p><strong>Leki:</strong> ${medicationDetails || 'Tak'}</p>` : ''}
              </div>
            ` : ''}

            ${additionalNotes ? `
              <div class="section">
                <h2>📝 Dodatkowe uwagi</h2>
                <p>${additionalNotes}</p>
              </div>
            ` : ''}

            <div class="section" style="background: #E8F5E9; border-left-color: #4CAF50;">
              <h2>✅ Kolejne kroki</h2>
              <ol>
                <li>Skontaktuj się z klientem telefonicznie lub mailowo</li>
                <li>Potwierdź termin lub zaproponuj alternatywny</li>
                <li>Przypomnij o przeciwwskazaniach i przygotowaniu do zabiegu</li>
              </ol>
            </div>
          </div>

          <div class="footer">
            <p>To jest automatyczne powiadomienie z systemu rezerwacji Beauty Studio.</p>
            <p>Data wysłania: ${new Date().toLocaleString('pl-PL')}</p>
          </div>
        </body>
      </html>
    `

    // Email dla klienta (potwierdzenie)
    const clientEmailHtml = `
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
              background: linear-gradient(135deg, #D4A5A5 0%, #C9A961 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #FFF8F0;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .section {
              background: white;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ Dziękujemy za rezerwację!</h1>
          </div>
          
          <div class="content">
            <p>Witaj ${firstName}!</p>
            
            <p>Dziękujemy za wypełnienie formularza rezerwacji w naszym studio makijażu permanentnego.</p>

            <div class="section">
              <h2>📋 Podsumowanie Twojej rezerwacji:</h2>
              <p><strong>Usługa:</strong> ${serviceName}</p>
              <p><strong>Preferowany termin:</strong> ${preferredDate} o ${preferredTime}</p>
            </div>

            <div class="section" style="background: #E3F2FD;">
              <h2>📞 Co dalej?</h2>
              <p>Skontaktujemy się z Tobą w ciągu <strong>24 godzin</strong> w celu:</p>
              <ul>
                <li>Potwierdzenia terminu lub zaproponowania alternatywy</li>
                <li>Odpowiedzi na ewentualne pytania</li>
                <li>Przypomnienia o przygotowaniu do zabiegu</li>
              </ul>
            </div>

            <p>W razie pilnych pytań, śmiało skontaktuj się z nami:</p>
            <p>📱 Telefon: +48 123 456 789<br>
            📧 Email: kontakt@example.com</p>

            <p>Do zobaczenia!<br>
            Zespół Royal Lips 💕</p>
          </div>

          <div class="footer">
            <p>Royal Lips - Joanna Wielgos</p>
            <p>To jest automatyczna wiadomość. Prosimy nie odpowiadać.</p>
          </div>
        </body>
      </html>
    `

    // Wyślij email do właścicielki
    const ownerEmail = await resend.emails.send({
      from: 'Royal Lips <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL || 'owner@example.com',
      subject: `🔔 Nowa rezerwacja: ${firstName} ${lastName} - ${serviceName}`,
      html: ownerEmailHtml,
    })

    // Wyślij potwierdzenie do klienta
    const clientEmail = await resend.emails.send({
      from: 'Royal Lips <onboarding@resend.dev>',
      to: email,
      subject: '✨ Potwierdzenie rezerwacji - Royal Lips',
      html: clientEmailHtml,
    })

    return NextResponse.json({
      success: true,
      ownerEmailId: ownerEmail.data?.id,
      clientEmailId: clientEmail.data?.id,
    })

  } catch (error) {
    console.error('Błąd wysyłki email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Nie udało się wysłać emaila' 
      },
      { status: 500 }
    )
  }
}