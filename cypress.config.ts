import { defineConfig } from 'cypress'
import { dropDB } from './cypress/tasks/dropDB'
import { seedDB } from './cypress/tasks/seedDB'

export default defineConfig({
    e2e: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                dropDB,
                seedDB,
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
