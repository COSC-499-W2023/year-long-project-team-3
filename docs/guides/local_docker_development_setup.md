# Local Docker Development Setup

1. Go in the #dotenv in Capstone Discord server to find the link to `.env.docker.local` and copy the contents
2. Paste the contents into a new file called `.env` in the root directory of the project
3. Initialize database
```bash
npx prisma migrate dev
```
3. Run docker
```bash
npm run dev:docker
```
4. Go to http://localhost:3000
