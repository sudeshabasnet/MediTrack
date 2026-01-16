export const formatCurrency = (amount, currency = 'Rs.') => {
  if (amount === null || amount === undefined) return `${currency} 0.00`
  return `${currency} ${parseFloat(amount).toFixed(2)}`
}

export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const dateObj = new Date(dateTime)
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatPhone = (phone) => {
  if (!phone) return ''
  // Format Nepal phone numbers
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const capitalizeFirst = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const formatStatus = (status) => {
  return status.split('_').map(capitalizeFirst).join(' ')
}

export const formatRole = (role) => {
  return capitalizeFirst(role)
}



