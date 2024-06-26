# Local Development Setup

1. Ensure that all environment files have already been added to the project.
2. From the root directory, install dependencies using (Node.js must be installed before doing this):
    ```bash
    npm install
    ```
3. Make sure Docker Desktop is running
4. Spin up the database using:
    ```bash
    docker-compose -f docker-compose.dev.yml up db -d
    ```
5. Verify that the container is running in Docker Desktop. If it fails it may be due to improperly configured or missing `.env` files.
6. Migrate the database using:
    ```bash
    npm run migrate
    ```
7. Run the server using:
    ```bash
    npm run dev
    ```

The project should now be fully set up and running on [port 3000](http://localhost:3000/).
