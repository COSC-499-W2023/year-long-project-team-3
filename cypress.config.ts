import { defineConfig } from 'cypress'
import clearDB from './cypress/tasks/clearDB'

export default defineConfig({
    e2e: {
        projectId: process.env.cypressProjectId,
        baseUrl: process.env.cypressBaseUrl,
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
