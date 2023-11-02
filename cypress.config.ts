import { defineConfig } from 'cypress'
import clearDB from './cypress/tasks/clearDB'

require('dotenv').config()

export default defineConfig({
    e2e: {
        projectId: process.env.CYPRESS_PROJECT_ID,
        baseUrl: process.env.CYPRESS_BASE_URL,
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

    reporter: 'mochawesome',
    reporterOptions: {
        charts: true,
        overwrite: false,
        html: false,
        json: true,
        reportDir: 'cypress/reports/mochawesome-report',
    },
})
