# Local Docker Development Setup

1. Go in the #dotenv in Capstone Discord server to find the link to `.env` and copy the contents
2. Paste the contents into a new file called `.env` in the root directory of the project
3. Repeat steps 1 and 2 for `.env.docker.local`
4. Initialize database
    ```bash
    docker-compose -f docker-compose.dev.yml up db -d
    npx prisma migrate dev
    ```
5. Run docker
    ```bash
    npm run dev:docker
    ```
6. Go to http://localhost:3000
