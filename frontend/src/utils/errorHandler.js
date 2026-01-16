export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred'

    switch (status) {
      case 400:
        return { message: `Bad Request: ${message}`, type: 'error' }
      case 401:
        return { message: 'Unauthorized. Please login again.', type: 'auth' }
      case 403:
        return { message: 'Access denied. You don\'t have permission.', type: 'error' }
      case 404:
        return { message: 'Resource not found.', type: 'error' }
      case 500:
        return { message: 'Server error. Please try again later.', type: 'error' }
      default:
        return { message, type: 'error' }
    }
  } else if (error.request) {
    // Request made but no response
    return { message: 'No response from server. Please check your connection.', type: 'network' }
  } else {
    // Error setting up request
    return { message: error.message || 'An unexpected error occurred', type: 'error' }
  }
}

export const showErrorToast = (error, toast) => {
  const errorInfo = handleApiError(error)
  toast.error(errorInfo.message)
  return errorInfo
}



