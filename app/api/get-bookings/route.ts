import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Pobierz wszystkie rezerwacje z Google Sheets przez SheetDB
    const response = await fetch("https://sheetdb.io/api/v1/gmhy5mfhbnppt", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SheetDB Error:", errorText)
      throw new Error(`Błąd odczytu z arkusza: ${errorText}`)
    }

    const bookings = await response.json()

    // Filtruj tylko potwierdzone rezerwacje i przyszłe daty
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const confirmedBookings = bookings
      .filter((booking: any) => {
        // Blokuj wszystkie rezerwacje OPRÓCZ anulowanych
        const status = booking.Status?.toLowerCase() || ''

        // Nie blokuj tylko anulowanych wizyt
        if (status === 'anulowana' || status === 'canceled' || status === 'cancelled') {
          return false
        }

        // Sprawdź czy data wizyty jest w przyszłości lub dzisiaj
        if (booking['Data wizyty']) {
          const bookingDate = new Date(booking['Data wizyty'])
          bookingDate.setHours(0, 0, 0, 0)
          return bookingDate >= today
        }

        return true
      })
      .map((booking: any) => ({
        date: booking['Data wizyty'],
        time: booking.Godzina,
        service: booking.Usługa,
        firstName: booking.Imię,
        lastName: booking.Nazwisko,
        status: booking.Status,
      }))

    return NextResponse.json({
      success: true,
      bookings: confirmedBookings,
    })

  } catch (error) {
    console.error('Błąd pobierania rezerwacji:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się pobrać rezerwacji',
        bookings: []
      },
      { status: 500 }
    )
  }
}
