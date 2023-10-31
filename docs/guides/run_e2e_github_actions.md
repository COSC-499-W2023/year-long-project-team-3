# Running E2E tests on pull requests
## Install the GitHub CLI
Install the GitHub CLI from [here](https://cli.github.com/).

## Log in to GitHub CLI
```bash
gh auth login
```

## Run the workflow manually
```bash
gh workflow run e2e_tests_preview.yml --ref <your-branch-name>
```
