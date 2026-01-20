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
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
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

const POLISH_WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

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
    // Disable past dates
    if (date < today) return true;
    // Disable Sundays (getDay() returns 0 for Sunday)
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

  // Check if selected date is Saturday (getDay() returns 6 for Saturday)
  const isSaturday = selectedDateObj ? selectedDateObj.getDay() === 6 : false;
  const availableTimeSlots = isSaturday
    ? TIME_SLOTS_SATURDAY
    : TIME_SLOTS_WEEKDAY;

  // Function to check if a time slot is booked
  const isTimeSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    return bookedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === time
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-text-dark/5 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={!canGoPrevMonth()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canGoPrevMonth()
                  ? "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  : "opacity-30 cursor-not-allowed text-gray-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-text-dark tracking-wide">
              {POLISH_MONTHS[currentMonth]} {currentYear}
            </h3>

            <button
              type="button"
              onClick={goToNextMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {POLISH_WEEKDAYS.map((day) => (
              <div
                key={day}
                className="h-10 flex items-center justify-center text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square p-0.5">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={isDateDisabled(day)}
                    className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium transition-all relative ${
                      isSunday(day)
                        ? "text-gray-200 cursor-not-allowed line-through"
                        : isDateDisabled(day)
                          ? "text-gray-200 cursor-not-allowed"
                          : isSelected(day)
                            ? "bg-primary-taupe text-white shadow-md"
                            : isToday(day)
                              ? "bg-primary-taupe/10 text-primary-taupe font-semibold ring-2 ring-primary-taupe/30"
                              : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Selection Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-text-dark/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Wybierz godzinę
            </span>
          </div>
        </div>

        <div className="p-4">
          {!selectedDate && (
            <p className="text-sm text-gray-400 text-center py-4">
              Najpierw wybierz datę
            </p>
          )}
          {selectedDate && (
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((time) => {
                const isBooked = isTimeSlotBooked(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => !isBooked && onTimeChange(time)}
                    disabled={isBooked}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      isBooked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed ring-2 ring-red-500"
                        : selectedTime === time
                          ? "bg-primary-taupe text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {time}
                    {isBooked && (
                      <span className="block text-xs mt-0.5 text-red-500">
                        Zajęte
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {selectedDate && isSaturday && (
            <p className="text-xs text-gray-400 text-center mt-3">
              W soboty gabinet czynny do 14:00
            </p>
          )}
        </div>
      </div>

      {/* Selected Summary */}
      {(selectedDate || selectedTime) && (
        <div className="bg-gradient-to-br from-primary-taupe/10 to-accent-warm/10 rounded-2xl p-6 border border-primary-taupe/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary-taupe/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-taupe font-serif text-lg">
                {selectedDateObj ? selectedDateObj.getDate() : "?"}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-primary-taupe/70 uppercase tracking-wider mb-1">
                Wybrany termin
              </p>
              <p className="text-lg font-serif text-text-dark">
                {selectedDateObj && (
                  <>
                    {selectedDateObj.getDate()}{" "}
                    {POLISH_MONTHS_GENITIVE[selectedDateObj.getMonth()]}{" "}
                    {selectedDateObj.getFullYear()}
                  </>
                )}
                {!selectedDateObj && (
                  <span className="text-gray-400">Wybierz datę</span>
                )}
              </p>
              {selectedTime && (
                <p className="text-sm text-gray-600 mt-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Godzina:{" "}
                    <strong className="text-text-dark">{selectedTime}</strong>
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
