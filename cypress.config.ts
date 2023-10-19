import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: process.env.CYPRESS_PROJECT_ID,
    e2e: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
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
