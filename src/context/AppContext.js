import { createContext, useContext, useMemo, useState } from 'react';
import { mockEvents } from '../data/mockEvents';
import { mockUser } from '../data/mockUsers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [events, setEvents] = useState(mockEvents);
  const [user, setUser] = useState(mockUser);

  const toggleInterested = (eventId) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, interested: !event.interested } : event,
      ),
    );
  };

  const toggleRegistration = (eventId) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? { ...event, registered: !event.registered, interested: event.registered ? event.interested : true }
          : event,
      ),
    );
  };

  const updateProfile = (updates) => {
    setUser((current) => ({ ...current, ...updates }));
  };

  const updateInterests = (interests) => {
    setUser((current) => ({ ...current, interests }));
  };

  const addEvent = (eventInput) => {
    const id = String(Date.now());
    setEvents((current) => [...current, { ...eventInput, id }]);
  };

  const updateEvent = (eventId, updates) => {
    setEvents((current) =>
      current.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((current) => current.filter((event) => event.id !== eventId));
  };

  const value = useMemo(
    () => ({
      events,
      user,
      toggleInterested,
      toggleRegistration,
      updateProfile,
      updateInterests,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [events, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
