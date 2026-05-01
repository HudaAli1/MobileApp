import { mockEvents } from '../../data/mockEvents';

export function getLocalEvents() {
  return mockEvents.map(({ interested, registered, ...event }) => event);
}
