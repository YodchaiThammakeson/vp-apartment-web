import axios from 'axios'

const authToken = localStorage.getItem('token') == null ? {} : { Authorization: `Bearer ${localStorage.getItem('token')}` }

const defaultInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_URL,
  headers: {
    ...authToken
  },
})

export { defaultInstance }