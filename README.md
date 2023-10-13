# Team 3 Capstone Project

## Team Members

-   Seth Akins (Hedgemon4)
-   Teresa Saller (te-sa)
-   Erin Hiebert (SecondFeline)
-   K Phan (ketphan02)
-   Justin Schoenit (justino599)

## Project Setup

First, run the development server:

### Requirements

-   [NodeJS 18.18](https://nodejs.org/en)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installing Dependencies

Run the following command to install dependencies

```bash
npm install
```

### Running the Project

Run the following command to start the project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the Database

To run the dev database, run the following command

```bash
docker-compose -f dev-docker-compose.yml up -d
```

### Apply latest database migrations
```bash
npx prisma db push
```

### Linting the Project

Run the following to lint and format the project

```bash
npm run lint
```

### Development environment variable
Please view in private channel #dotenv

### Database migration
If you make changes to prisma models, you can migrate the database by
```bash
npx prisma migrate dev --name <migration-name>
```
Note: `migration-name` should be a short description of the changes you made

### Database exploration
You can explore the database by running
```bash
npx prisma studio
```

## Chosen Project

### Option 3 - Video Streaming Using Cloud Technology

#### Project goal: To create a web application using AWS services for professionals who will receive video submissions from users while protecting their privacy.

#### Target users:

-   Senders: An average adult who has created a video of themself, has access to Internet and phone/computer, and may want to have their face blurred throughout the video for privacy reasons.
-   Receivers: Professionals (e.g., doctors, teachers, recruiters/interviewers) who need to review the video submissions for diagnosis or assessment reasons, and has access to Internet and computer.

#### Things to think about when scoping your project: This list is non-exhaustive. It is only meant to get you thinking about the variety of ways you may choose to scope and design this project.

-   How can the app facilitate the recording of the video after the sender logs in?
-   How might senders review what has been recorded and decide if they want to re-record it before submitting it?
-   How will data security and user privacy be enforced and communicated to the senders?
-   Will the application be responsive to work on phones, tablets, and desktops?
-   Will the receiver be able to provide feedback to the sender, or request follow up video submissions?
-   How will professionals know when a diagnosis/assessment is required?
-   Can senders view their videos in the system and delete them?
-   Will the senders or receivers be able to decide how long the videos should be retained in the system?

```
.
├── docs                    # Documentation files (alternatively `doc`)
│   ├── project plan        # Project plan document
│   ├── design              # Getting started guide
│   ├── final               # Getting started guide
│   ├── logs                # Team Logs
│   └── ...
├── src
│   └── app                 # Source files
├── public                  # Assets
├── tests                   # Automated tests
├── utils                   # Tools and utilities
└── README.md
```
