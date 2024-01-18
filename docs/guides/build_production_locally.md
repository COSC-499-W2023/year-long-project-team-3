# Guide to Building Production Locally

## Environment File
- Depending on where you want to run the container, you will need to change what is in your `.env` file.
- If you want to run the image locally, just use the `.env` file for local development.
- Note that you may need to change the URL for the database because they are not running in the same docker container.

## Commands

1. Building the Container
   - Run the following command from the root of the repo
   - `docker build -t harp-video -f Dockerfile.prod .`

2. Running the Container
   - Once the container is built, run the following command
   - `docker run -p 3000:3000 -t harp-video`
