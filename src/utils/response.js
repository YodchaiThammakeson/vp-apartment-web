export const responseSuccess = ({ message = null, data = null }) => {
  return {
    status: 'success',
    message,
    data,
  }
}

export const responseError = ({ message = null, data = null }) => {
  return {
    status: 'error',
    message,
    data,
  }
}
