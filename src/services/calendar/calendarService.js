import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

export async function addEventToDeviceCalendar(event) {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    return {
      success: false,
      permissionDenied: true,
      message: 'Calendar permission was denied. Registration is saved without adding to device calendar.',
    };
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  let targetCalendar = calendars.find((calendar) => calendar.allowsModifications);

  if (!targetCalendar) {
    const source =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Eventia' };

    const calendarId = await Calendar.createCalendarAsync({
      title: 'Eventia Events',
      color: '#1F3C88',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: source.id,
      source,
      name: 'Eventia',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    targetCalendar = await Calendar.getCalendarAsync(calendarId);
  }

  const startDate = new Date(`${event.fullDate}T10:00:00`);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  await Calendar.createEventAsync(targetCalendar.id, {
    title: event.title,
    startDate,
    endDate,
    location: event.location,
    notes: event.description,
    timeZone: 'Asia/Riyadh',
  });

  return {
    success: true,
    permissionDenied: false,
    message: 'Registered successfully and added to your device calendar.',
  };
}
