import axios from 'axios';

export const HOLIDAY_API_BASE = 'https://tallyfy.com/national-holidays/api';

const fallbackSaudiHolidays2026 = [
  {
    id: 'holiday-2026-1',
    localName: 'يوم التأسيس',
    name: 'Founding Day',
    date: '2026-02-22',
    fallback: true,
  },
  {
    id: 'holiday-2026-2',
    localName: 'إجازة عيد الفطر',
    name: 'Eid al-Fitr Holiday',
    date: '2026-03-19',
    fallback: true,
  },
  {
    id: 'holiday-2026-3',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr',
    date: '2026-03-20',
    fallback: true,
  },
  {
    id: 'holiday-2026-4',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr',
    date: '2026-03-21',
    fallback: true,
  },
  {
    id: 'holiday-2026-5',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr',
    date: '2026-03-22',
    fallback: true,
  },
  {
    id: 'holiday-2026-6',
    localName: 'يوم عرفة',
    name: 'Arafat Day',
    date: '2026-05-26',
    fallback: true,
  },
  {
    id: 'holiday-2026-7',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha',
    date: '2026-05-27',
    fallback: true,
  },
  {
    id: 'holiday-2026-8',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha',
    date: '2026-05-28',
    fallback: true,
  },
  {
    id: 'holiday-2026-9',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha',
    date: '2026-05-29',
    fallback: true,
  },
  {
    id: 'holiday-2026-10',
    localName: 'إجازة عيد الأضحى',
    name: 'Eid al-Adha Holiday',
    date: '2026-05-30',
    fallback: true,
  },
  {
    id: 'holiday-2026-11',
    localName: 'اليوم الوطني السعودي',
    name: 'Saudi National Day',
    date: '2026-09-23',
    fallback: true,
  },
];

function getFallbackHolidays(year) {
  return fallbackSaudiHolidays2026.map((holiday) => ({
    ...holiday,
    id: holiday.id.replace('2026', String(year)),
    date: holiday.date.replace('2026', String(year)),
  }));
}

export async function fetchSaudiPublicHolidays(year = 2026) {
  const endpoint = `${HOLIDAY_API_BASE}/SA/${year}.json`;

  try {
    const response = await axios.get(endpoint, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    });

    const holidayItems = response?.data?.holidays;

    if (!Array.isArray(holidayItems)) {
      return {
        holidays: getFallbackHolidays(year),
        fallbackUsed: true,
        error: 'Unexpected holiday API response shape',
        endpoint,
      };
    }

    return {
      holidays: holidayItems
        .map((holiday, index) => ({
          id: `holiday-${year}-${index}`,
          localName: holiday?.local_name || holiday?.name || 'إجازة رسمية',
          name: holiday?.name || holiday?.local_name || 'Official Holiday',
          date: holiday?.date || holiday?.observed_date,
          fallback: false,
        }))
        .filter((holiday) => Boolean(holiday.date)),
      fallbackUsed: false,
      error: '',
      endpoint,
    };
  } catch (error) {
    return {
      holidays: getFallbackHolidays(year),
      fallbackUsed: true,
      error: error?.message || 'Holiday API unavailable',
      endpoint,
    };
  }
}
