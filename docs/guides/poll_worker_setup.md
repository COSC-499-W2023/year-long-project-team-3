# Poll Worker Setup

1. Navigate to the poll worker directory and install the required packages

    ```bash
   # Make sure to run this from the project root
    cd workers/poll-worker
    npm install
    ```
2. Add the `.env` file from Google Drive to the `workers/poll-worker` directory
3. Update the poll worker `.env` file with your AWS credentials (see [AWS Authentication](aws_authentication.md))
4. Start the Docker Container

```bash
   docker-compose -f docker-compose.dev.yml up poll-worker -d 
```
