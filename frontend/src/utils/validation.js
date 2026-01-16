export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6
}

export const validatePhone = (phone) => {
  // Basic phone validation - can be customized for Nepal format
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone) && phone.length >= 10
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateNumber = (value, min = null, max = null) => {
  const num = Number(value)
  if (isNaN(num)) return false
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  return true
}

export const validateDate = (date) => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj)
}

export const validateFutureDate = (date) => {
  const dateObj = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dateObj >= today
}

export const validateMedicineForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.name)) {
    errors.name = 'Medicine name is required'
  }

  if (!validateRequired(formData.category)) {
    errors.category = 'Category is required'
  }

  if (!validateRequired(formData.genericName)) {
    errors.genericName = 'Generic name is required'
  }

  if (!validateRequired(formData.manufacturer)) {
    errors.manufacturer = 'Manufacturer is required'
  }

  if (!validateRequired(formData.batchNumber)) {
    errors.batchNumber = 'Batch number is required'
  }

  if (!validateRequired(formData.expiryDate)) {
    errors.expiryDate = 'Expiry date is required'
  } else if (!validateDate(formData.expiryDate)) {
    errors.expiryDate = 'Invalid date format'
  }

  if (!validateRequired(formData.unitPrice)) {
    errors.unitPrice = 'Unit price is required'
  } else if (!validateNumber(formData.unitPrice, 0)) {
    errors.unitPrice = 'Unit price must be a positive number'
  }

  if (!validateRequired(formData.currentStock)) {
    errors.currentStock = 'Current stock is required'
  } else if (!validateNumber(formData.currentStock, 0)) {
    errors.currentStock = 'Current stock must be a positive number'
  }

  if (!validateRequired(formData.minStockLevel)) {
    errors.minStockLevel = 'Minimum stock level is required'
  } else if (!validateNumber(formData.minStockLevel, 0)) {
    errors.minStockLevel = 'Minimum stock level must be a positive number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateUserForm = (formData) => {
  const errors = {}

  if (!validateRequired(formData.fullName)) {
    errors.fullName = 'Full name is required'
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format'
  }

  if (!validateRequired(formData.phoneNumber)) {
    errors.phoneNumber = 'Phone number is required'
  } else if (!validatePhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format'
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required'
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!validateRequired(formData.organizationName)) {
    errors.organizationName = 'Organization name is required'
  }

  if (!validateRequired(formData.licenseNumber)) {
    errors.licenseNumber = 'License number is required'
  }

  if (!validateRequired(formData.address)) {
    errors.address = 'Address is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}



