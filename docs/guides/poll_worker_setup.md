# Poll Worker Setup

1. Ensure that all environment files have already been added to the project.
2. Make sure Docker Desktop is running
3. From the root directory, start the poll worker using:
   ```bash
   docker-compose -f docker-compose.dev.yml up poll-worker -d
   ```
4. Verify that the container _docker-poll-worker_ is running in Docker Desktop
