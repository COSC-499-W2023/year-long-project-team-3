# Poll Worker Setup

1. Contact one of our devs to receive a link to the environment file and add it to the _workers/poll-worker_ directory:
   1. Make sure to replace the text highlighted in yellow inside this file with <u>your</u> AWS access key ID, AWS secret 
   access key, and AWS session token (from the [AWS console](https://ubc-cicsso.awsapps.com/start#/))
2. Navigate to the poll worker directory and install the required dependencies using:
   ```bash
   cd workers/poll-worker
   npm install
   ```
3. Make sure Docker Desktop is running
4. Navigate to the root directory and start the poll worker using:
   ```bash
   cd ../..
   docker-compose -f docker-compose.dev.yml up poll-worker -d
   ```
5. Verify that the container docker-poll-worker is running in Docker Desktop
