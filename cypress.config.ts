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
import loadManagedSubmissionBox from './cypress/tasks/loadManagedSubmissionBox'
import loadInvitedSubmissionBox from './cypress/tasks/loadInvitedSubmissionBox'
import submitVideoToSubmissionBox from './cypress/tasks/submitVideoToSubmissionBox'
import createRequestSubmissionForUser from './cypress/tasks/createRequestSubmissionForUser'
import getVerificationToken from 'cypress/tasks/getVerificationToken'
import verifyEmail from './cypress/tasks/verifyEmail'
import {deleteVerificationToken} from './cypress/tasks/deleteVerificationToken'
import {editOrCreateVerificationToken} from './cypress/tasks/editOrCreateVerificationToken'
import createRequestedBoxForSubmissionBox from './cypress/tasks/createRequestedBoxForSubmissionBox'
import createSubmissionBoxForSubmissions from './cypress/tasks/createSubmissionBoxForSubmissions'
import getResetPasswordToken from './cypress/tasks/getResetPasswordToken'
import createResetPasswordToken from './cypress/tasks/createResetPasswordToken'
import editPasswordResetTokenDate from './cypress/tasks/editPasswordResetTokenDate'

require('dotenv').config()

// noinspection JSUnusedLocalSymbols
export default defineConfig({
    e2e: {
        projectId: process.env.NEXT_PUBLIC_CYPRESS_PROJECT_ID,
        baseUrl: process.env.NEXT_PUBLIC_CYPRESS_BASE_URL ?? 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                clearDB,
                createOneVideoAndRetrieveVideoId,
                getUserId,
                getVerificationToken,
                createUser,
                getSubmissionBoxes,
                getSubmissionBoxManagers,
                getRequestedSubmissions,
                createSubmissionBoxWithEmail,
                populateDB,
                getLatestVideo,
                loadManagedSubmissionBox,
                loadInvitedSubmissionBox,
                submitVideoToSubmissionBox,
                createRequestSubmissionForUser,
                verifyEmail,
                deleteVerificationToken,
                editOrCreateVerificationToken,
                createRequestedBoxForSubmissionBox,
                createSubmissionBoxForSubmissions,
                getResetPasswordToken,
                createResetPasswordToken,
                editPasswordResetTokenDate,
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
        defaultCommandTimeout: 20000,
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
