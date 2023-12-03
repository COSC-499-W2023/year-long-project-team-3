import { defineConfig } from 'cypress'
import clearDB from './cypress/tasks/clearDB'
import createOneVideoAndRetrieveVideoId from './cypress/tasks/createOneVideoAndRetrieveId'
import populateDB from './cypress/tasks/populateDB'
import getLatestVideo from './cypress/tasks/getLatestVideo'
import getUserId from './cypress/tasks/getUserId'
import createUser from './cypress/tasks/createUser'
import getSubmissionBoxes from './cypress/tasks/getSubmissionBoxes'
import getSubmissionBoxManagers from './cypress/tasks/getSubmissionBoxManagers'
import getRequestedSubmissions from './cypress/tasks/getRequestedSubmissions'
import createSubmissionBoxWithEmail from './cypress/tasks/createSubmissionBoxWithEmail'


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
                createUser,
                getSubmissionBoxes,
                getSubmissionBoxManagers,
                getRequestedSubmissions,
                createSubmissionBoxWithEmail,
                populateDB,
                getLatestVideo,
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
