# Eventia

Eventia is a React Native mobile application for organizing and discovering campus events.

Current scope:
- College of Science & Humanities - Jubail
- Imam Abdulrahman Bin Faisal University

## Milestone 4 Summary

This version includes the full Milestone 3 UI and navigation, plus Milestone 4 core functionality:

- Local authentication for students and admin
- AsyncStorage persistence for users, session, events, registrations, interests, and ratings
- Simulated email verification after sign up
- Forgot password flow with local verification code
- Arabic local event data for Jubail college only
- Event registration and local rating management
- Saudi public holidays in Calendar using `Nager.Date`
- User location check using `expo-location`
- Reverse geocoding using `OpenStreetMap Nominatim`
- Role-based access for admin and student flows

## Default Login Credentials

Admin:
- Email: `admin@iau.edu.sa`
- Password: `Admin123`

Demo student:
- Email: `hind.alotaibi@iau.edu.sa`
- Password: `Student123`

## Main Features

- Student authentication and session handling
- Admin authentication and event management
- Local Arabic event feed
- Calendar screen with official Saudi holidays
- Location status with approximate distance from the college
- Registration, interests, and rating flows

## Tech Stack

- Expo
- React Native
- React Navigation
- Context API
- AsyncStorage
- Axios
- Expo Calendar
- Expo Location

## Project Structure

```text
src/
  components/
  constants/
  context/
  data/
  navigation/
  screens/
    auth/
    user/
    admin/
  services/
    api/
    calendar/
    location/
    storage/
  utils/
```

## Run The Project

```bash
npm install
npx expo start
```

Open the app in Expo Go or an emulator.
