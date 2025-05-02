import validator from 'validator';

export const validateRegisterInput = ({ name, email, phone, dob, password, face_data, fingerprint_data }) => {
  const errors = [];

  // Check for missing required fields
  if (!name || !email || !phone || !dob || !password || !face_data || !fingerprint_data) {
    if (!name) errors.push('name');
    if (!email) errors.push('email');
    if (!phone) errors.push('phone');
    if (!dob) errors.push('dob');
    if (!password) errors.push('password');
    if (!face_data) errors.push('face_data');
    if (!fingerprint_data) errors.push('fingerprint_data');
    return { isValid: false, message: `Missing required fields: ${errors.join(', ')}` };
  }

  // Validate name (must start with a capital letter and have at least 3 characters)
  const nameRegex = /^[A-Z][a-zA-Z]{2,}$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name must start with a capital letter and have at least 3 characters' };
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Validate phone number (must be exactly 10 digits)
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Phone number must be 10 digits' };
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}|\[\]\\:";'<>,.?/~]).{6,}$/;
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters, contain one letter, one number, and one special character',
    };
  }

  return { isValid: true };
};

export const validateLoginInput = ({ email, password, face_data, fingerprint_data }) => {
  if (!email || !password) {
    return { isValid: false, message: 'Email and password are required' };
  }

  // Validate that biometric data is provided for login
  if (!face_data) {
    return { isValid: false, message: 'Face biometric data is required for login' };
  }

  if (!fingerprint_data) {
    return { isValid: false, message: 'Fingerprint biometric data is required for login' };
  }

  return { isValid: true };
};
