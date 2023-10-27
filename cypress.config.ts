import { defineConfig } from 'cypress'
import clearDB from './cypress/tasks/clearDB'

export default defineConfig({
    projectId: process.env.cypressProjectId,
    e2e: {
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
