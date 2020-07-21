import { login, logout, getInfo, genApikey } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import { isEmpty, isNil } from 'lodash'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          // const data = response.data
          if (response.token !=null){
            setToken(response.token)
            commit('SET_TOKEN',response.token)
          }else{
            console.log('no response token')
            // no token try to use cookie session-id as the token.
            let token = Cookies.get(process.env.TOKEN_KEY)
            if (!(isEmpty(token) || isNil(token))) {
              commit('SET_TOKEN', token)
            }
            // reject('no token')

          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GenApiKey({ commit, state }, userInfo){
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        genApikey(username, userInfo.password).then(response =>{
          console.log(response)
          if (response.apiKey !=null){
            setToken(response.apiKey)
            commit('SET_TOKEN',response.apiKey)
          }
          resolve(response)
        })
      }).catch(error => {
        reject(error)
      })

    },
    // get user info
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
          } else {
            commit('SET_ROLES', ['public']) // set empty role to pbulic role
            // reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // backend need logout
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // front-end logout
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        resolve()
      })
    }
  }
}

export default user
