import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storageKeys';

async function readJson(key, fallback) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const appStorage = {
  getUsers: () => readJson(STORAGE_KEYS.USERS, []),
  saveUsers: (users) => writeJson(STORAGE_KEYS.USERS, users),
  async upsertUser(user) {
    const users = await readJson(STORAGE_KEYS.USERS, []);
    const existingIndex = users.findIndex((item) => item.id === user.id || item.email === user.email);
    const next = existingIndex >= 0
      ? users.map((item, index) => (index === existingIndex ? user : item))
      : [...users, user];
    await writeJson(STORAGE_KEYS.USERS, next);
    return next;
  },
  async findUserByEmail(email) {
    const users = await readJson(STORAGE_KEYS.USERS, []);
    return users.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getCurrentUser: () => readJson(STORAGE_KEYS.CURRENT_USER, null),
  saveCurrentUser: (user) => writeJson(STORAGE_KEYS.CURRENT_USER, user),
  clearCurrentUser: () => AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER),

  getAdminAccount: () => readJson(STORAGE_KEYS.ADMIN_ACCOUNT, null),
  saveAdminAccount: (admin) => writeJson(STORAGE_KEYS.ADMIN_ACCOUNT, admin),

  getPendingSignup: () => readJson(STORAGE_KEYS.PENDING_SIGNUP, null),
  savePendingSignup: (payload) => writeJson(STORAGE_KEYS.PENDING_SIGNUP, payload),
  clearPendingSignup: () => AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SIGNUP),

  getPasswordReset: () => readJson(STORAGE_KEYS.PASSWORD_RESET, null),
  savePasswordReset: (payload) => writeJson(STORAGE_KEYS.PASSWORD_RESET, payload),
  clearPasswordReset: () => AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD_RESET),

  getApiEvents: () => readJson(STORAGE_KEYS.API_EVENTS, []),
  saveApiEvents: (events) => writeJson(STORAGE_KEYS.API_EVENTS, events),

  getCustomEvents: () => readJson(STORAGE_KEYS.CUSTOM_EVENTS, []),
  saveCustomEvents: (events) => writeJson(STORAGE_KEYS.CUSTOM_EVENTS, events),
  async createEvent(event) {
    const events = await readJson(STORAGE_KEYS.CUSTOM_EVENTS, []);
    const next = [...events, event];
    await writeJson(STORAGE_KEYS.CUSTOM_EVENTS, next);
    return next;
  },
  async updateEvent(eventId, updates) {
    const events = await readJson(STORAGE_KEYS.CUSTOM_EVENTS, []);
    const next = events.map((event) => (event.id === eventId ? { ...event, ...updates } : event));
    await writeJson(STORAGE_KEYS.CUSTOM_EVENTS, next);
    return next;
  },
  async deleteEvent(eventId) {
    const events = await readJson(STORAGE_KEYS.CUSTOM_EVENTS, []);
    const next = events.filter((event) => event.id !== eventId);
    await writeJson(STORAGE_KEYS.CUSTOM_EVENTS, next);
    return next;
  },

  getRegistrations: () => readJson(STORAGE_KEYS.REGISTRATIONS, []),
  saveRegistrations: (registrations) => writeJson(STORAGE_KEYS.REGISTRATIONS, registrations),

  getInterested: () => readJson(STORAGE_KEYS.INTERESTED, []),
  saveInterested: (interested) => writeJson(STORAGE_KEYS.INTERESTED, interested),

  getRatings: () => readJson(STORAGE_KEYS.RATINGS, []),
  saveRatings: (ratings) => writeJson(STORAGE_KEYS.RATINGS, ratings),
};
