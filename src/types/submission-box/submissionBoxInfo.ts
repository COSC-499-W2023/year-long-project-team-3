import { RequestedSubmission, SubmissionBox, SubmittedVideo } from '@prisma/client'

export type SubmissionBoxInfo = SubmissionBox & { requestedSubmissions: (RequestedSubmission & { videoVersions: SubmittedVideo[] })[] };