import { defineConfig } from 'cypress'
import clearDB from './cypress/tasks/clearDB'
import createOneVideoAndRetrieveVideoId from './cypress/tasks/createOneVideoAndRetrieveId'
import getUserId from './cypress/tasks/getUserId'
import loadInSubmissionBoxes from './cypress/tasks/loadInSubmissionBoxes'
import loadOutSubmissionBoxes from './cypress/tasks/loadOutSubmissionBoxes'

require('dotenv').config()

export default defineConfig({
    e2e: {
        projectId: process.env.CYPRESS_PROJECT_ID,
        baseUrl: process.env.CYPRESS_BASE_URL,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                clearDB,
                createOneVideoAndRetrieveVideoId,
                getUserId,
                loadInSubmissionBoxes,
                loadOutSubmissionBoxes,
            })
        },
        experimentalModifyObstructiveThirdPartyCode: true,

        reporter: 'mochawesome',
        reporterOptions: {
            charts: true,
            overwrite: false,
            html: false,
            json: true,
            reportDir: 'cypress/reports/e2e',
            reportFilename: 'e2e',
            reportTitle: 'E2E Tests',
        },

        env: {
            CYPRESS_RUN_LOCAL_ONLY: process.env.CYPRESS_RUN_LOCAL_ONLY,
        },
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },

        reporter: 'mochawesome',
        reporterOptions: {
            charts: true,
            overwrite: false,
            html: false,
            json: true,
            reportDir: 'cypress/reports/components',
            reportFilename: 'components',
            reportTitle: 'Component Tests',
        },
    },
    video: true,
    screenshotOnRunFailure: true,
})
