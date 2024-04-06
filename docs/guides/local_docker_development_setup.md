# Local Docker Development Setup

1. Contact one of our devs to receive a link to the environment files and add them to the root directory:
   1. Make sure to replace the text highlighted in yellow inside this file with <u>your</u> AWS access key ID, AWS secret
      access key, and AWS session token (from the [AWS console](https://ubc-cicsso.awsapps.com/start#/))
2. Initialize the database using:
    ```bash
    docker-compose -f docker-compose.dev.yml up db -d
    npx prisma migrate dev
    ```
3. Run docker:
    ```bash
    npm run dev:docker
    ```
4. Go to http://localhost:3000
