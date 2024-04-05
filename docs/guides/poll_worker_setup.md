# Poll Worker Setup

1. Ensure that all environment files have already been added to the project.
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
