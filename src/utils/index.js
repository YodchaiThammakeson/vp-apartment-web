export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomArray = (items = []) => {
  return items[randomNumberBetween(0, items.length - 1)]
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const randomString = (length = 5) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const randomNumber = (digit = 5) => {
  return Math.random().toFixed(digit).split('.')[1]
}

export const removeByIndex = (items, index) => items.filter((item, i) => i !== index)

export const removeEmpty = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName]
    }
  }
  return obj
}

export const getBase64FromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// eslint-disable-next-line no-new-func
export const evil = (fn) => new Function('return ' + fn)()
