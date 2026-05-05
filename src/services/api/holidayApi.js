import axios from 'axios';

export const HOLIDAY_API_ENDPOINT = 'https://date.nager.at/api/v3/publicholidays/2026/SA';

const fallbackSaudiHolidays2026 = [
  {
    id: 'holiday-2026-1',
    localName: 'يوم التأسيس',
    name: 'Founding Day',
    date: '2026-02-22',
    fixed: true,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-2',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr Holiday',
    date: '2026-03-20',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-3',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr Holiday',
    date: '2026-03-21',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-4',
    localName: 'عيد الفطر',
    name: 'Eid al-Fitr Holiday',
    date: '2026-03-22',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-5',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha Holiday',
    date: '2026-05-26',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-6',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha Holiday',
    date: '2026-05-27',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-7',
    localName: 'عيد الأضحى',
    name: 'Eid al-Adha Holiday',
    date: '2026-05-28',
    fixed: false,
    global: true,
    fallback: true,
  },
  {
    id: 'holiday-2026-8',
    localName: 'اليوم الوطني السعودي',
    name: 'National Day',
    date: '2026-09-23',
    fixed: true,
    global: true,
    fallback: true,
  },
];

export async function fetchSaudiPublicHolidays(year = 2026) {
  const endpoint = `https://date.nager.at/api/v3/publicholidays/${year}/SA`;

  try {
    const response = await axios.get(endpoint, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!Array.isArray(response.data)) {
      console.warn('Holiday API returned unexpected response shape.');
      return {
        holidays: fallbackSaudiHolidays2026,
        fallbackUsed: true,
        error: 'Unexpected holiday API response shape',
        endpoint,
      };
    }

    return {
      holidays: response.data.map((holiday, index) => ({
        id: `holiday-${year}-${index}`,
        localName: holiday.localName,
        name: holiday.name,
        date: holiday.date,
        fixed: holiday.fixed,
        global: holiday.global,
        fallback: false,
      })),
      fallbackUsed: false,
      error: '',
      endpoint,
    };
  } catch (error) {
    console.warn('Holiday API fallback used.');
    return {
      holidays: fallbackSaudiHolidays2026,
      fallbackUsed: true,
      error: error?.message || 'Unknown holiday API error',
      endpoint,
    };
  }
}
