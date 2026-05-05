export const eventImageSources = {
  'computer-science': require('../../assets/events/computer-science.png'),
  mathematics: require('../../assets/events/mathematics.png'),
  english: require('../../assets/events/english.png'),
  physics: require('../../assets/events/physics.png'),
  energy: require('../../assets/events/energy.png'),
  general: require('../../assets/events/general.png'),
};

const categoryToImageKey = {
  'علوم الحاسب': 'computer-science',
  'الرياضيات': 'mathematics',
  'اللغة الإنجليزية': 'english',
  'الفيزياء': 'physics',
  'الطاقة': 'energy',
  عام: 'general',
};

export function getImageKeyForCategory(category) {
  return categoryToImageKey[category] || 'general';
}

export function getEventImageSource(event) {
  if (event?.imageUri) {
    return { uri: event.imageUri };
  }

  const key = event?.imageKey || getImageKeyForCategory(event?.category);
  return eventImageSources[key] || eventImageSources.general;
}
