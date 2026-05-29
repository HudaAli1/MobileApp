import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

// Function to get the default calendar source on the device
async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

// Function to add an event to the user's device calendar
export async function addEventToDeviceCalendar(event) {

  // Request permission to access the calendar
  const { status } = await Calendar.requestCalendarPermissionsAsync();

  // Check if permission is denied
  if (status !== 'granted') {
    return {
      success: false,
      permissionDenied: true,
      message: 'Calendar permission was denied. Registration is saved without adding to device calendar.',
    };
  }

  // Get all available calendars on the device
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  // Find a calendar that allows modifications
  let targetCalendar = calendars.find((calendar) => calendar.allowsModifications);

  // If no editable calendar exists, create a new one
  if (!targetCalendar) {

    // Set calendar source based on device platform
    const source =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Eventia' };

    // Create a new calendar for the app
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

    // Retrieve the newly created calendar
    targetCalendar = await Calendar.getCalendarAsync(calendarId);
  }

  // Create the event start date and time
  const startDate = new Date(`${event.fullDate}T10:00:00`);

  // Set the event end time to one hour later
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  // Add the event to the selected calendar
  await Calendar.createEventAsync(targetCalendar.id, {
    title: event.title,
    startDate,
    endDate,
    location: event.location,
    notes: event.description,
    timeZone: 'Asia/Riyadh',
  });

  // Return success message after adding the event
  return {
    success: true,
    permissionDenied: false,
    message: 'Registered successfully and added to your device calendar.',
  };
}
