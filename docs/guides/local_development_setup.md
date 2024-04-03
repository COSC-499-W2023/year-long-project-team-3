# Local Development Setup

1. Contact one of our devs to receive a link to the environment file and add it to the root directory:
   1. Make sure to replace the text highlighted in yellow inside this file with <u>your</u> AWS access key ID, AWS secret
      access key, and AWS session token (from the [AWS console](https://ubc-cicsso.awsapps.com/start#/))
2. From the root directory, install dependencies using:
    ```bash
    npm install
    ```
3. Make sure Docker Desktop is still running
4. Spin up the database using:
    ```bash
    docker-compose -f docker-compose.dev.yml up db -d
    ```
5. Verify that the container _year-long-project-team-3-db-1_ is running in Docker Desktop
6. Migrate the database using:
    ```bash
    npm run migrate
    ```
7. Run the server using:
    ```bash
    npm run dev
    ```

The project should now be fully set up and running on [port 3000](http://localhost:3000/).