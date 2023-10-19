import { defineConfig } from 'cypress'
import { clearDB } from './cypress/tasks/clearDB'

require('dotenv').config()

export default defineConfig({
    projectId: process.env.CYPRESS_PROJECT_ID,
    e2e: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                clearDB,
            })
        },
        experimentalModifyObstructiveThirdPartyCode: true,
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
    },
})
