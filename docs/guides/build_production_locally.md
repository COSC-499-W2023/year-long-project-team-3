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

## Pushing Build Container to AWS

- If desired, the built container can also be pushed to AWS
- To do so, run the following commands

1. Login: `aws ecr get-login-password --region <region> --profile <my-profile> | docker login --username AWS --password-stdin <uri>`
    - The `<region>` tag is the AWS region where the container registry is located
    - The `<my-profile>` tag is a CLI profile you have configured locally (see
      documentation [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html))
    - The `<uri>` tag has the format `aws_account_id.dkr.ecr.region.amazonaws.com` and is the uri for the Elastic
      Container Repository (ECR)

2. Taging the Image: `docker tag <image> <uri>`
    - The `<image>` tag is the tag of the docker image you build locally. This will be `harp-video` if you used the
      commands above.
    - The `<uri>` tag is the uri for the ECR repository (use the same one you used above)

3. Pushing the image `docker push <uri>`
   - Again, the `<uri>` tag is the same as in the two previous commands.