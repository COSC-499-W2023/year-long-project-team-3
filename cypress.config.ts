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
import loadInSubmissionBoxes from './cypress/tasks/loadInSubmissionBoxes'
import loadOutSubmissionBoxes from './cypress/tasks/loadOutSubmissionBoxes'
import submitVideoToSubmissionBox from './cypress/tasks/submitVideoToSubmissionBox'
import createRequestSubmissionForUser from './cypress/tasks/createRequestSubmissionForUser'

require('dotenv').config()

export default defineConfig({
    e2e: {
        projectId: process.env.CYPRESS_PROJECT_ID,
        baseUrl: process.env.CYPRESS_BASE_URL ?? 'http://localhost:3000',
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
                loadInSubmissionBoxes,
                loadOutSubmissionBoxes,
                submitVideoToSubmissionBox,
                createRequestSubmissionForUser,
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
            CYPRESS_RUN_LOCAL_ONLY: process.env.CYPRESS_RUN_LOCAL_ONLY?.toLowerCase() === 'true',
        },

        viewportWidth: 1920,
        viewportHeight: 1080,
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
