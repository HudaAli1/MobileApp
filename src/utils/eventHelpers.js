export const categories = [
  'علوم الحاسب',
  'الرياضيات',
  'اللغة الإنجليزية',
  'الفيزياء',
  'الطاقة',
  'عام',
];

// دالة التحقق من التاريخ (أهم إضافة لحل مشكلتك)
export function isDateInPast(dateString) {
  if (!dateString) return false;
  
  const selectedDate = new Date(dateString);
  const today = new Date();
  
  // تصفير الوقت للمقارنة بين الأيام فقط
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate < today;
}

export function formatEventDate(event) {
  return `${event.date} - ${event.time}`;
}

export function getEventsForDate(events, date) {
  return events.filter((event) => event.fullDate === date);
}

export function getInterestEvents(events, interests) {
  return events.filter((event) => interests.includes(event.category) && !event.isPast);
}
