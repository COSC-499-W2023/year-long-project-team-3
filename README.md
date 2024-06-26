# Team 3 Capstone Project

## Team Members

- Seth Akins (Hedgemon4)
- Erin Hiebert (SecondFeline)
- K Phan (ketphan02)
- Teresa Saller (te-sa)
- Justin Schoenit (justino599)

## Link to Deployed Project

[Harp - A Secure Platform for Anonymous Video Submission](http://harp-video-staging-balancer-1212142463.ca-central-1.elb.amazonaws.com/)

## Project Setup

### Requirements

Please ensure the following are installed on your system:
- [NodeJS v20.12.1](https://nodejs.org/en)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Step-by-step guide

1. Clone the [project](https://github.com/COSC-499-W2023/year-long-project-team-3) using Git
2. Obtain the two required environment files for local development by contacting one of the project devs: `./.env` and `./workers/poll-worker/.env`
3. Follow the steps in: [AWS Authentication Credentials Setup](docs/guides/aws_authentication.md)
4. Project Setup
   - Follow the steps in: [Poll Worker Setup](docs/guides/poll_worker_setup.md)
   - and: [Local Development Setup](docs/guides/local_development_setup.md)

### Tests

**Running tests locally:**

Run `npm run cypress:open` to use the cypress GUI to run tests. Alternatively, run `npx cypress run` to run all tests
in the commandline. Note: You need to have the website up and running to be able to run E2E tests.

**Running tests in the CI pipeline:**

Tests are automatically run every time you push to an active (non-draft) PR, but you can also [run them manually](docs/guides/run_e2e_github_actions.md)

### Common commands

- [Common commands](docs/guides/commands.md)

## Chosen Project

### Option 3 - Video Streaming Using Cloud Technology

#### Project goal: To create a web application using AWS services for professionals who will receive video submissions from users while protecting their privacy.

#### Target users:

- Senders: An average adult who has created a video of themselves, has access to Internet and phone/computer, and may
  want to have their face blurred throughout the video for privacy reasons.
- Receivers: Professionals (e.g., doctors, teachers, recruiters/interviewers) who need to review the video submissions
  for diagnosis or assessment reasons, and has access to Internet and computer.

#### Things to think about when scoping your project: This list is non-exhaustive. It is only meant to get you thinking about the variety of ways you may choose to scope and design this project.

- How can the app facilitate the recording of the video after the sender logs in?
- How might senders review what has been recorded and decide if they want to re-record it before submitting it?
- How will data security and user privacy be enforced and communicated to the senders?
- Will the application be responsive to work on phones, tablets, and desktops?
- Will the receiver be able to provide feedback to the sender, or request follow up video submissions?
- How will professionals know when a diagnosis/assessment is required?
- Can senders view their videos in the system and delete them?
- Will the senders or receivers be able to decide how long the videos should be retained in the system?

## Repo organization

Our tests can be found in the [cypress folder](cypress), documentation is contained in [docs](docs), and our code is
in [src](src). Our NextJS app uses an App Router, so URLs in our web app match the folder structure in our app
directory.

```
.
├── ...
├── cypress                 # Tests (E2E, component, and unit)
├── docs                    # Documentation files
│   ├── ...
│   ├── guides              # Project set-up guides
│   ├── plan                # Project plan document
│   └── weekly logs         # Personal and team logs
├── prisma                  # Database schema and migrations
├── public                  # Assets
├── src
│   ├── app                 # Source files
│   ├── components          # Reusable React components
│   ├── lib                 # Helper classes
│   ├── ...
│   ├── types               # TypeScript type definitions
│   └── utils               # Utility functions   
├── ...
└── README.md
```
