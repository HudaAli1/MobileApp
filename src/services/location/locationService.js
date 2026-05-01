import axios from 'axios';
import * as Location from 'expo-location';

const COLLEGE_LOCATION = {
  latitude: 27.0174,
  longitude: 49.6583,
  name: 'كلية العلوم والآداب بالجبيل',
};

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(fromLat, fromLon, toLat, toLon) {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

async function reverseGeocode(latitude, longitude) {
  const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      format: 'json',
      lat: latitude,
      lon: longitude,
    },
    timeout: 8000,
    headers: {
      'User-Agent': 'Eventia-App/1.0',
    },
  });

  const address = response.data?.address || {};
  return (
    address.city ||
    address.town ||
    address.village ||
    address.state ||
    response.data?.display_name ||
    'موقع غير محدد'
  );
}

export async function getCurrentLocationStatus() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return {
        granted: false,
        coords: COLLEGE_LOCATION,
        areaName: COLLEGE_LOCATION.name,
        distanceKm: 0,
        status: 'تم رفض إذن الموقع. سيتم استخدام موقع الكلية الافتراضي.',
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const areaName = await reverseGeocode(position.coords.latitude, position.coords.longitude);
    const distanceKm = calculateDistanceKm(
      position.coords.latitude,
      position.coords.longitude,
      COLLEGE_LOCATION.latitude,
      COLLEGE_LOCATION.longitude,
    );

    return {
      granted: true,
      coords: position.coords,
      areaName,
      distanceKm,
      status:
        distanceKm <= 10
          ? `أنت قريب من الكلية. المسافة التقريبية عن الكلية: ${distanceKm.toFixed(1)} كم`
          : `أنت بعيد عن الكلية. المسافة التقريبية عن الكلية: ${distanceKm.toFixed(1)} كم`,
    };
  } catch {
    return {
      granted: false,
      coords: COLLEGE_LOCATION,
      areaName: COLLEGE_LOCATION.name,
      distanceKm: 0,
      status: 'تعذر الحصول على الموقع الحالي. سيتم استخدام موقع الكلية الافتراضي.',
    };
  }
}
