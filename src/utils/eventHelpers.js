export const categories = [
  'Computer Science',
  'Mathematics',
  'English',
  'Physics',
  'Energy',
];

export function formatEventDate(event) {
  return `${event.date} • ${event.time}`;
}

export function getEventsForDate(events, date) {
  return events.filter((event) => event.fullDate === date);
}

export function getInterestEvents(events, interests) {
  return events.filter((event) => interests.includes(event.category) && !event.isPast);
}
