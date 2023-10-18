import { defineConfig } from 'cypress'

require('dotenv').config()
export default defineConfig({
    e2e: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
