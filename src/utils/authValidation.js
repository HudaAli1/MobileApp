const iauEmailPattern = /^[^\s@]+@iau\.edu\.sa$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function isValidEmail(email) {
  return emailPattern.test(email.trim());
}

export function isUniversityEmail(email) {
  return iauEmailPattern.test(email.trim());
}

export function validateSignUpForm(form, existingUser) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'الاسم الكامل مطلوب.';
  if (!form.email.trim()) {
    errors.email = 'البريد الإلكتروني مطلوب.';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
  } else if (!isUniversityEmail(form.email)) {
    errors.email = 'يفضل استخدام البريد الجامعي المنتهي بـ @iau.edu.sa.';
  } else if (existingUser) {
    errors.email = 'هذا البريد مسجل مسبقًا.';
  }

  if (!form.password) {
    errors.password = 'كلمة المرور مطلوبة.';
  } else if (form.password.length < 6) {
    errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'تأكيد كلمة المرور مطلوب.';
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'تأكيد كلمة المرور غير مطابق.';
  }

  if (!form.universityId.trim()) errors.universityId = 'الرقم الجامعي مطلوب.';
  if (!form.major.trim()) errors.major = 'التخصص مطلوب.';

  if (form.phone && !/^\d{9,15}$/.test(form.phone.trim())) {
    errors.phone = 'رقم الجوال يجب أن يحتوي على أرقام فقط.';
  }

  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'البريد الإلكتروني مطلوب.';
  if (!password) errors.password = 'كلمة المرور مطلوبة.';
  return errors;
}

export function validatePasswordChange({ currentPassword, newPassword, confirmNewPassword }) {
  const errors = {};

  if (!currentPassword) errors.currentPassword = 'كلمة المرور الحالية مطلوبة.';
  if (!newPassword) {
    errors.newPassword = 'كلمة المرور الجديدة مطلوبة.';
  } else if (newPassword.length < 6) {
    errors.newPassword = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.';
  }

  if (!confirmNewPassword) {
    errors.confirmNewPassword = 'تأكيد كلمة المرور الجديدة مطلوب.';
  } else if (confirmNewPassword !== newPassword) {
    errors.confirmNewPassword = 'تأكيد كلمة المرور الجديدة غير مطابق.';
  }

  return errors;
}
