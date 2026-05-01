import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockAdmin, mockUser } from '../data/mockUsers';
import { getLocalEvents } from '../services/api/eventsApi';
import { addEventToDeviceCalendar } from '../services/calendar/calendarService';
import { getCurrentLocationStatus } from '../services/location/locationService';
import { appStorage } from '../services/storage/appStorage';
import { getImageKeyForCategory } from '../utils/eventImages';

const AppContext = createContext(null);
const arabicCategories = ['علوم الحاسب', 'الرياضيات', 'اللغة الإنجليزية', 'الفيزياء', 'الطاقة', 'عام'];

function normalizeEventState(event, interestedIds, registeredIds, ratings) {
  return {
    ...event,
    imageKey: event.imageKey || getImageKeyForCategory(event.category),
    interested: interestedIds.includes(event.id),
    registered: registeredIds.includes(event.id),
    rating: ratings.find((item) => item.eventId === event.id) || null,
  };
}

function createSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isArabicCollegeEvent(event) {
  if (!event || !event.title || !event.category || !event.description) return false;
  if (!arabicCategories.includes(event.category)) return false;

  const combined = `${event.title} ${event.description} ${event.category}`.toLowerCase();
  const blockedTokens = [
    'sunt aut facere',
    'qui est esse',
    'computer science',
    'mathematics',
    'physics',
    'energy',
    'english',
    'math',
    'april',
    'may',
  ];

  return !blockedTokens.some((token) => combined.includes(token));
}

function sanitizeCustomEvents(events) {
  return (events || []).filter((event) => isArabicCollegeEvent(event));
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [adminAccount, setAdminAccount] = useState(mockAdmin);
  const [pendingSignup, setPendingSignup] = useState(null);
  const [passwordReset, setPasswordReset] = useState(null);
  const [locationStatus, setLocationStatus] = useState('لم يتم طلب الموقع بعد.');
  const [apiEvents, setApiEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [interestedEventIds, setInterestedEventIds] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const events = useMemo(() => {
    const merged = [...apiEvents, ...customEvents];
    return merged.map((event) =>
      normalizeEventState(event, interestedEventIds, registeredEventIds, ratings),
    );
  }, [apiEvents, customEvents, interestedEventIds, registeredEventIds, ratings]);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const [
          storedUsers,
          storedAdmin,
          storedCurrentUser,
          storedPendingSignup,
          storedPasswordReset,
          storedCustomEvents,
          storedRegistrations,
          storedInterested,
          storedRatings,
        ] = await Promise.all([
          appStorage.getUsers(),
          appStorage.getAdminAccount(),
          appStorage.getCurrentUser(),
          appStorage.getPendingSignup(),
          appStorage.getPasswordReset(),
          appStorage.getCustomEvents(),
          appStorage.getRegistrations(),
          appStorage.getInterested(),
          appStorage.getRatings(),
        ]);

        if (!mounted) return;

        const seededUsers = storedUsers.length ? storedUsers : [mockUser];
        const seededAdmin = storedAdmin || mockAdmin;
        const localEvents = getLocalEvents();
        const cleanedCustomEvents = sanitizeCustomEvents(storedCustomEvents);

        setUsers(seededUsers);
        setAdminAccount(seededAdmin);
        setUser(storedCurrentUser);
        setPendingSignup(storedPendingSignup);
        setPasswordReset(storedPasswordReset);
        setApiEvents(localEvents);
        setCustomEvents(cleanedCustomEvents);
        setRegisteredEventIds(storedRegistrations);
        setInterestedEventIds(storedInterested);
        setRatings(storedRatings);

        await Promise.all([
          appStorage.saveUsers(seededUsers),
          appStorage.saveAdminAccount(seededAdmin),
          appStorage.saveApiEvents(localEvents),
          appStorage.saveCustomEvents(cleanedCustomEvents),
        ]);

        setLoadingEvents(false);
        setEventsError('');
      } catch {
        if (!mounted) return;
        setApiEvents(getLocalEvents());
        setCustomEvents([]);
        setEventsError('تعذر تحميل بيانات الفعاليات المحلية.');
        setLoadingEvents(false);
      } finally {
        if (mounted) setIsHydrated(true);
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshEventsFromApi = async () => {
    const nextEvents = getLocalEvents();
    setApiEvents(nextEvents);
    await appStorage.saveApiEvents(nextEvents);
    setEventsError('');
  };

  const beginSignUpVerification = async (form) => {
    const code = createSixDigitCode();
    const payload = {
      code,
      user: {
        id: `student-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        universityId: form.universityId.trim(),
        major: form.major,
        interests: form.interests?.length ? form.interests : [form.major],
        phone: form.phone?.trim() || '',
        bio: form.bio?.trim() || '',
        role: 'student',
      },
    };

    setPendingSignup(payload);
    await appStorage.savePendingSignup(payload);
    return payload;
  };

  const resendSignUpCode = async () => {
    if (!pendingSignup) return null;
    const nextPayload = { ...pendingSignup, code: createSixDigitCode() };
    setPendingSignup(nextPayload);
    await appStorage.savePendingSignup(nextPayload);
    return nextPayload;
  };

  const verifySignUpCode = async (code) => {
    if (!pendingSignup) {
      return { success: false, message: 'لا يوجد طلب تسجيل جديد بانتظار التحقق.' };
    }

    if (pendingSignup.code !== code.trim()) {
      return { success: false, message: 'رمز التحقق غير صحيح.' };
    }

    const newUser = pendingSignup.user;
    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setUser(newUser);
    setPendingSignup(null);
    await Promise.all([
      appStorage.saveUsers(nextUsers),
      appStorage.saveCurrentUser(newUser),
      appStorage.clearPendingSignup(),
    ]);

    return { success: true, user: newUser };
  };

  const loginStudent = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.role === 'student',
    );

    if (!matchedUser || matchedUser.password !== password) {
      return {
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      };
    }

    setUser(matchedUser);
    await appStorage.saveCurrentUser(matchedUser);

    return {
      success: true,
      user: matchedUser,
    };
  };

  const loginAdmin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail !== adminAccount.email.toLowerCase() ||
      password !== adminAccount.password
    ) {
      const studentMatch = users.find((item) => item.email.toLowerCase() === normalizedEmail);
      return {
        success: false,
        message: studentMatch
          ? 'هذا الحساب طالب/ـة ولا يملك صلاحية الدخول الإداري.'
          : 'بيانات الدخول الإدارية غير صحيحة.',
      };
    }

    setUser(adminAccount);
    await appStorage.saveCurrentUser(adminAccount);

    return {
      success: true,
      user: adminAccount,
    };
  };

  const beginPasswordReset = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!matchedUser) {
      return {
        success: false,
        message: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.',
      };
    }

    const payload = {
      email: normalizedEmail,
      code: createSixDigitCode(),
    };

    setPasswordReset(payload);
    await appStorage.savePasswordReset(payload);

    return {
      success: true,
      payload,
    };
  };

  const resendPasswordResetCode = async () => {
    if (!passwordReset) return null;
    const nextPayload = { ...passwordReset, code: createSixDigitCode() };
    setPasswordReset(nextPayload);
    await appStorage.savePasswordReset(nextPayload);
    return nextPayload;
  };

  const completePasswordReset = async ({ code, newPassword }) => {
    if (!passwordReset) {
      return { success: false, message: 'لا يوجد طلب إعادة تعيين نشط.' };
    }

    if (passwordReset.code !== code.trim()) {
      return { success: false, message: 'رمز التحقق غير صحيح.' };
    }

    const nextUsers = users.map((item) =>
      item.email.toLowerCase() === passwordReset.email ? { ...item, password: newPassword } : item,
    );
    const updatedCurrentUser = user?.email?.toLowerCase() === passwordReset.email
      ? { ...user, password: newPassword }
      : user;

    setUsers(nextUsers);
    setUser(updatedCurrentUser);
    setPasswordReset(null);

    await Promise.all([
      appStorage.saveUsers(nextUsers),
      updatedCurrentUser ? appStorage.saveCurrentUser(updatedCurrentUser) : Promise.resolve(),
      appStorage.clearPasswordReset(),
    ]);

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  };

  const logout = async () => {
    setUser(null);
    await appStorage.clearCurrentUser();
  };

  const updateProfile = async (updates) => {
    if (!user) return null;
    const nextUser = {
      ...user,
      ...updates,
      email: updates.email ? updates.email.trim().toLowerCase() : user.email,
    };
    setUser(nextUser);

    if (nextUser.role === 'admin') {
      setAdminAccount(nextUser);
      await Promise.all([
        appStorage.saveAdminAccount(nextUser),
        appStorage.saveCurrentUser(nextUser),
      ]);
      return nextUser;
    }

    const nextUsers = users.map((item) => (item.id === nextUser.id ? nextUser : item));
    setUsers(nextUsers);
    await Promise.all([
      appStorage.saveUsers(nextUsers),
      appStorage.saveCurrentUser(nextUser),
    ]);
    return nextUser;
  };

  const updateInterests = async (interests) => {
    if (!user) return null;
    return updateProfile({
      interests,
      major: interests[0] || user.major,
    });
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!user) {
      return {
        success: false,
        message: 'لا يوجد مستخدم مسجل حاليًا.',
      };
    }

    if (user.password !== currentPassword) {
      return {
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة.',
      };
    }

    await updateProfile({ password: newPassword });
    return {
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    };
  };

  const fetchLocation = async () => {
    const result = await getCurrentLocationStatus();
    setLocationStatus(result.status);
    return result;
  };

  const toggleInterested = async (eventId) => {
    const wasInterested = interestedEventIds.includes(eventId);
    const nextInterested = wasInterested
      ? interestedEventIds.filter((id) => id !== eventId)
      : [...interestedEventIds, eventId];
    setInterestedEventIds(nextInterested);
    await appStorage.saveInterested(nextInterested);
    return {
      success: true,
      message: wasInterested ? 'تمت إزالة الفعالية من الاهتمامات' : 'تمت إضافة الفعالية إلى الاهتمامات',
    };
  };

  const toggleRegistration = async (eventId) => {
    const isRegistered = registeredEventIds.includes(eventId);
    const nextRegistrations = isRegistered
      ? registeredEventIds.filter((id) => id !== eventId)
      : [...registeredEventIds, eventId];
    const nextInterested = interestedEventIds.includes(eventId)
      ? interestedEventIds
      : [...interestedEventIds, eventId];

    setRegisteredEventIds(nextRegistrations);
    setInterestedEventIds(nextInterested);
    await appStorage.saveRegistrations(nextRegistrations);
    await appStorage.saveInterested(nextInterested);

    if (isRegistered) {
      return {
        success: true,
        permissionDenied: false,
        message: 'تم إلغاء التسجيل',
      };
    }

    const selectedEvent = events.find((event) => event.id === eventId);
    if (!selectedEvent) {
      return {
        success: true,
        permissionDenied: false,
        message: 'تم تسجيلك في الفعالية بنجاح',
      };
    }

    const calendarResult = await addEventToDeviceCalendar(selectedEvent);
    return {
      ...calendarResult,
      message: calendarResult.permissionDenied
        ? 'تم تسجيلك في الفعالية بنجاح، لكن لم تتم إضافة الموعد للتقويم.'
        : 'تم تسجيلك في الفعالية بنجاح',
    };
  };

  const submitRating = async ({ eventId, value, comment }) => {
    const nextRating = {
      eventId,
      value,
      comment,
      submittedAt: new Date().toISOString(),
    };
    const nextRatings = ratings.some((item) => item.eventId === eventId)
      ? ratings.map((item) => (item.eventId === eventId ? nextRating : item))
      : [...ratings, nextRating];

    setRatings(nextRatings);
    await appStorage.saveRatings(nextRatings);
  };

  const addEvent = async (eventInput) => {
    const id = `custom-${Date.now()}`;
    const createdEvent = {
      ...eventInput,
      id,
      imageKey: eventInput.imageKey || getImageKeyForCategory(eventInput.category),
    };
    const nextEvents = await appStorage.createEvent(createdEvent);
    const cleanedEvents = sanitizeCustomEvents(nextEvents);
    setCustomEvents(cleanedEvents);
    await appStorage.saveCustomEvents(cleanedEvents);
  };

  const updateEvent = async (eventId, updates) => {
    const normalizedUpdates = {
      ...updates,
      imageKey: updates.imageKey || getImageKeyForCategory(updates.category),
    };
    const isCustomEvent = customEvents.some((event) => event.id === eventId);

    if (isCustomEvent) {
      const nextEvents = await appStorage.updateEvent(eventId, normalizedUpdates);
      const cleanedEvents = sanitizeCustomEvents(nextEvents);
      setCustomEvents(cleanedEvents);
      await appStorage.saveCustomEvents(cleanedEvents);
      return;
    }

    const nextApiEvents = apiEvents.map((event) =>
      event.id === eventId ? { ...event, ...normalizedUpdates } : event,
    );
    setApiEvents(nextApiEvents);
    await appStorage.saveApiEvents(nextApiEvents);
  };

  const deleteEvent = async (eventId) => {
    const isCustomEvent = customEvents.some((event) => event.id === eventId);

    if (isCustomEvent) {
      const nextEvents = await appStorage.deleteEvent(eventId);
      const cleanedEvents = sanitizeCustomEvents(nextEvents);
      setCustomEvents(cleanedEvents);
      await appStorage.saveCustomEvents(cleanedEvents);
    } else {
      const nextApiEvents = apiEvents.filter((event) => event.id !== eventId);
      setApiEvents(nextApiEvents);
      await appStorage.saveApiEvents(nextApiEvents);
    }

    const nextRegistrations = registeredEventIds.filter((id) => id !== eventId);
    const nextInterested = interestedEventIds.filter((id) => id !== eventId);
    const nextRatings = ratings.filter((item) => item.eventId !== eventId);

    setRegisteredEventIds(nextRegistrations);
    setInterestedEventIds(nextInterested);
    setRatings(nextRatings);

    await Promise.all([
      appStorage.saveRegistrations(nextRegistrations),
      appStorage.saveInterested(nextInterested),
      appStorage.saveRatings(nextRatings),
    ]);
  };

  const value = useMemo(
    () => ({
      user,
      users,
      adminAccount,
      pendingSignup,
      passwordReset,
      locationStatus,
      events,
      apiEvents,
      customEvents,
      registeredEventIds,
      interestedEventIds,
      ratings,
      loadingEvents,
      eventsError,
      isHydrated,
      refreshEventsFromApi,
      beginSignUpVerification,
      resendSignUpCode,
      verifySignUpCode,
      loginStudent,
      loginAdmin,
      beginPasswordReset,
      resendPasswordResetCode,
      completePasswordReset,
      logout,
      updateProfile,
      updateInterests,
      changePassword,
      fetchLocation,
      toggleInterested,
      toggleRegistration,
      submitRating,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [
      user,
      users,
      adminAccount,
      pendingSignup,
      passwordReset,
      locationStatus,
      events,
      apiEvents,
      customEvents,
      registeredEventIds,
      interestedEventIds,
      ratings,
      loadingEvents,
      eventsError,
      isHydrated,
    ],
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
