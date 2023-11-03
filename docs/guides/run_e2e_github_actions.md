# Running E2E tests on pull requests
## Install the GitHub CLI
Install the GitHub CLI from [here](https://cli.github.com/).

## Log in to GitHub CLI
```bash
gh auth login
```

## Run the workflow manually
### Run with deploying the server
Run this if you changed something in the code (backend, frontend, etc.)
```bash
gh workflow run e2e_tests_preview.yml --ref <your-branch-name> -f run_deploy=true
```

### Run without deploying the server
Run this if you have not changed anything in the code (usually fixing tests, changing docs, etc.)
```bash
gh workflow run e2e_tests_preview.yml --ref <your-branch-name>
```
