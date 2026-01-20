"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface CalendarPickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  bookedSlots?: Array<{ date: string; time: string }>;
}

const POLISH_MONTHS = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const POLISH_MONTHS_GENITIVE = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const POLISH_WEEKDAYS_SHORT = ["po", "wt", "śr", "cz", "pt", "so", "ni"];
const POLISH_WEEKDAYS_FULL = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const TIME_SLOTS_WEEKDAY = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const TIME_SLOTS_SATURDAY = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
];

// Godziny do wyświetlenia w lewej kolumnie (day view)
const DAY_VIEW_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function CalendarPicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  bookedSlots = [],
}: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const formatDateString = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${currentYear}-${month}-${dayStr}`;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (date.getDay() === 0) return true;
    return false;
  };

  const isSunday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return formatDateString(day) === selectedDate;
  };

  const canGoPrevMonth = () => {
    if (currentYear > today.getFullYear()) return true;
    if (currentYear === today.getFullYear() && currentMonth > today.getMonth())
      return true;
    return false;
  };

  const goToPrevMonth = () => {
    if (!canGoPrevMonth()) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    if (isDateDisabled(day)) return;
    onDateChange(formatDateString(day));
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedDateObj = selectedDate
    ? new Date(selectedDate + "T00:00:00")
    : null;

  const isSaturday = selectedDateObj ? selectedDateObj.getDay() === 6 : false;
  const availableTimeSlots = isSaturday
    ? TIME_SLOTS_SATURDAY
    : TIME_SLOTS_WEEKDAY;

  const isTimeSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    return bookedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === time
    );
  };

  // Formatowanie daty do wyświetlenia
  const getFormattedSelectedDate = () => {
    if (!selectedDateObj) return null;
    const dayOfWeek = POLISH_WEEKDAYS_FULL[selectedDateObj.getDay()];
    const day = selectedDateObj.getDate();
    const month = POLISH_MONTHS_GENITIVE[selectedDateObj.getMonth()];
    const year = selectedDateObj.getFullYear();
    return { dayOfWeek, day, month, year };
  };

  const formattedDate = getFormattedSelectedDate();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* LEFT SIDE - Day View */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with date */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          {formattedDate ? (
            <div>
              <div className="text-sm font-medium text-primary-taupe uppercase tracking-wide mb-1">
                {formattedDate.dayOfWeek}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-text-dark">
                  {formattedDate.day}
                </div>
                <div className="text-lg text-gray-600">
                  {formattedDate.month} {formattedDate.year}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              Wybierz datę z kalendarza
            </div>
          )}
        </div>

        {/* Day schedule view */}
        <div className="p-4 max-h-[500px] overflow-y-auto bg-gradient-to-b from-white via-gray-50/30 to-gray-50">
          {!selectedDate && (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Wybierz datę, aby zobaczyć dostępne godziny</p>
            </div>
          )}
          {selectedDate && (
            <div className="space-y-1">
              {DAY_VIEW_HOURS.map((hour) => {
                const isAvailable = availableTimeSlots.includes(hour);
                const isBooked = isAvailable && isTimeSlotBooked(hour);
                const isSelectedTime = selectedTime === hour;

                return (
                  <div
                    key={hour}
                    className="flex items-center border-b border-gray-50 last:border-0"
                  >
                    <div className="w-20 py-3 text-sm text-gray-500">
                      {hour}
                    </div>
                    <div className="flex-1">
                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => !isBooked && onTimeChange(hour)}
                          disabled={isBooked}
                          className={`w-full text-left py-2 px-4 rounded-lg transition-all ${
                            isBooked
                              ? "bg-red-50 border-2 border-red-500 cursor-not-allowed"
                              : isSelectedTime
                                ? "bg-primary-taupe text-white shadow-md"
                                : "bg-green-50 hover:bg-green-100 border-2 border-green-400 active:bg-gray-200 active:border-gray-400"
                          }`}
                        >
                          {isBooked ? (
                            <span className="text-red-600 font-medium">
                              Zajęte
                            </span>
                          ) : (
                            <span
                              className={
                                isSelectedTime
                                  ? "text-white font-medium"
                                  : "text-green-700"
                              }
                            >
                              {isSelectedTime ? "Wybrano" : "Dostępne"}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Mini Calendar & Available Times */}
      <div className="lg:w-96 space-y-6">
        {/* Mini Calendar */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevMonth}
                disabled={!canGoPrevMonth()}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  canGoPrevMonth()
                    ? "hover:bg-gray-100 text-gray-600"
                    : "opacity-30 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide">
                {POLISH_MONTHS[currentMonth]} {currentYear}
              </h3>

              <button
                type="button"
                onClick={goToNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {POLISH_WEEKDAYS_SHORT.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-[10px] font-medium text-gray-400 uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day !== null && (
                    <button
                      type="button"
                      onClick={() => handleDayClick(day)}
                      disabled={isDateDisabled(day)}
                      className={`w-full h-full rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        isSunday(day)
                          ? "text-gray-200 cursor-not-allowed"
                          : isDateDisabled(day)
                            ? "text-gray-200 cursor-not-allowed"
                            : isSelected(day)
                              ? "bg-purple-600 text-white"
                              : isToday(day)
                                ? "bg-purple-100 text-purple-600 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                      {isToday(day) && (
                        <span className="absolute w-1 h-1 bg-purple-600 rounded-full mt-6"></span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Section - Booksy style */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 text-center">
            Pracownicy
          </h4>

          <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary-taupe/5 to-accent-warm/5 border border-primary-taupe/10">
            {/* Profile photo - Instagram/Booksy style */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary-taupe/20 shadow-md">
                <img
                  src="/self_photo.jpg"
                  alt="Joanna Wielgos"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Active indicator dot */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
            </div>

            {/* Staff info */}
            <div className="text-center">
              <h5 className="font-bold text-text-dark text-base mb-1">
                Joanna Wielgos
              </h5>
              <p className="text-xs text-gray-600 mb-2">
                Specjalista makijażu permanentnego
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-primary-taupe">
                <span className="font-medium">Dostępna</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Wszystkie wizyty są realizowane osobiście przez właścicielkę
          </p>
        </div>

        {/* Selected info */}
        {selectedDate && selectedTime && (
          <div className="bg-gradient-to-br from-primary-taupe/10 to-accent-warm/10 rounded-2xl p-4 border border-primary-taupe/20">
            <p className="text-xs font-medium text-primary-taupe/70 uppercase tracking-wider mb-2">
              Wybrany termin
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-taupe/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-taupe" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-dark">
                  {formattedDate?.day} {formattedDate?.month}
                </p>
                <p className="text-xs text-gray-600">{selectedTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
