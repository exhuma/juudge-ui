/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Function to fetch configuration
async function fetchConfig() {
    const controller = new AbortController()
    const signal = controller.signal

    try {
        const response = await fetch('/config.json', { signal })
        if (!response.ok) {
            return {}
        }
        try {
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error parsing config:', error)
            return {}
        }
    } catch (error) {
        console.error('Error fetching config:', error)
        return {}
    }
}

// Main function to bootstrap the app
async function bootstrap() {
  try {
    const config = await fetchConfig()
    const app = createApp(App)

    // Make the config available globally
    app.config.globalProperties.$config = config

    registerPlugins(app)
    app.mount('#app')
  } catch (error) {
    console.error('Failed to bootstrap the app:', error)
  }
}

// Bootstrap the app
bootstrap()
