import Cookies from 'js-cookie'
import api from '@/api'
import { getSystemTheme } from '@/components/Native/utils'


const app = {
  namespaced: true,
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    systemTheme: getSystemTheme(),
    aboutPanelVisible: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    CHANGE_SYSTEM_THEME (state, theme) {
      state.systemTheme = theme
    },
    CHANGE_ABOUT_PANEL_VISIBLE (state, visible) {
      state.aboutPanelVisible = visible
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },

    updateSystemTheme ({ commit }, theme) {
      commit('CHANGE_SYSTEM_THEME', theme)
    }

  }
}

export default app
