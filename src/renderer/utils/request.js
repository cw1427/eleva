import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers[process.env.API_AUTH_KEY] = store.getters.token
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone
service.interceptors.response.use(
  response => {
  /**
  * code
  */
    const res = response.data
    if (res.code >= 400) {
      Message({
        message: res.message,
        type: 'error',
        duration: 60 * 1000
      })

      // 401 authentication failed;
      if (error.response.status == 401) {
        Message(
          {
            message: 'Require login',
            type: 'error',
          }
        )
            //----do the redirect to login
        router.push({
            name: 'login'
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
