# Local Development Setup

1. Install dependencies
    ```bash
    npm install
    ```
2. Go in the #dotenv in Capstone Discord server to find the link to `.env` and copy the contents
3. Paste the contents into a new file called `.env` in the root directory of the project
4. Run the database
    ```bash
    docker-compose -f docker-compose.dev.yml up db -d
    ```
5. Migrate the database
    ```bash
    npm run migrate
    ```
6. Run the server
    ```bash
    npm run dev
    ```
