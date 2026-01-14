import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import ChatBot from './components/ChatBot.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(ChatBot)
    })
  }
}
