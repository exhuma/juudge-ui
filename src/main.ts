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
  const response = await fetch('/config.json')
  if (!response.ok) {
    throw new Error('Failed to fetch configuration')
  }
  return response.json()
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
