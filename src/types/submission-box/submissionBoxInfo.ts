import { RequestedSubmission, SubmissionBox } from '@prisma/client'

export type SubmissionBoxInfo = SubmissionBox & { requestedSubmissions: (RequestedSubmission & { videoVersions: {submittedAt: Date | null}[] })[] };
