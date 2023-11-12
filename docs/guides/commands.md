# Common commands

## Installing Dependencies

Run the following command to install dependencies

```bash
npm install
```

## Running the Project and the Database

Run the following to start the project and run the dev database

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Apply latest database migrations

```bash
npx prisma db push
```

## Linting the Project

Run the following to lint and format the project

```bash
npm run lint
```

## Testing the Project

Run the following to open Cypress

```bash
npm run cypress:open
```

## Development environment variable

Please view in private channel #dotenv

## Database migration

If you make changes to prisma models, you can migrate the database by

```bash
npx prisma migrate dev --name <migration-name>
```

Note: `migration-name` should be a short description of the changes you made

## Database exploration

You can view your tables, columns, and make changes to your local database by

```bash
npm run prisma:explore
```

## Database UML diagram

Generate a png image of the latest database UML diagram via the database schema by

```bash
prisma-uml ./prisma/schema.prisma -o png -f ./docs/design/databaseUML.png
```

Note: file will be added to ./docs/design directory