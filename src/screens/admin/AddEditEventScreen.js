import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../../components/AppHeader';
import BrandLogo from '../../components/BrandLogo';
import FormField from '../../components/FormField';
import InterestChip from '../../components/InterestChip';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../constants/colors';
import { radii, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
// التعديل هنا: استدعاء isDateInPast
import { categories, isDateInPast } from '../../utils/eventHelpers'; 
import { getImageKeyForCategory } from '../../utils/eventImages';

// ... (الدوال المساعدة formatDisplayDate, formatDisplayTime, toIsoDate تبقى كما هي)

export default function AddEditEventScreen({ navigation, route }) {
  // ... (الـ States والـ Handlers تبقى كما هي)

  const saveEvent = async () => {
    // 1. تحققات الحقول الفارغة
    if (!form.title.trim()) {
      Alert.alert('الفعالية', 'يرجى إدخال عنوان الفعالية.');
      return;
    }
    if (!form.description.trim()) {
      Alert.alert('الفعالية', 'يرجى إدخال وصف الفعالية.');
      return;
    }

    // 2. التحقق من التاريخ القديم (هذا ما كان ينقصك)
    if (form.fullDate && isDateInPast(form.fullDate)) {
      Alert.alert('تنبيه', 'لا يمكن إضافة مناسبة في تاريخ قديم.');
      return; 
    }

    if (!form.category) {
      Alert.alert('الفعالية', 'يرجى اختيار تصنيف الفعالية.');
      return;
    }

    if (!form.fullDate || !eventDate) {
      Alert.alert('الفعالية', 'يرجى اختيار التاريخ.');
      return;
    }

    const payload = {
      ...form,
      imageKey: getImageKeyForCategory(form.category),
      imageUri: '',
      date: form.date,
      time: form.time,
      fullDate: form.fullDate,
    };

    if (mode === 'edit' && eventId) {
      await updateEvent(eventId, payload);
      Alert.alert('الفعاليات', 'تم تعديل الفعالية بنجاح');
    } else {
      await addEvent(payload);
      Alert.alert('الفعاليات', 'تمت إضافة الفعالية بنجاح');
    }

    navigation.goBack();
  };

  return (
    // ... باقي كود الـ UI يبقى كما هو بدون تغيير
  );
}
