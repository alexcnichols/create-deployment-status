# GitHub Action - Deployments (Status) API

This GitHub Action (written in JavaScript) wraps the [GitHub Deployment API](https://developer.github.com/v3/repos/deployments/), specifically the [Create a deployment status](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status) endpoint, to allow you to leverage GitHub Actions to create deployment status.

<a href="https://github.com/alexcnichols/create-deployment-status"><img alt="GitHub Actions status" src="https://github.com/alexcnichols/create-deployment-status/workflows/CI/badge.svg"></a>

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repository's `.github/workflows` directory. An [example workflow](#example-workflow---create-a-deployment-status) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status)

- `deployment_id`: The ID of the Deployment.
- `state`: The state of the status. Can be one of `error`, `failure`, `inactive`, `in_progress`, `queued`, `pending`, or `success`.
- `environment_url`: Sets the URL for accessing your environment.

### Outputs

For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status) for an example of what these outputs look like

- `id`: The deployment status ID

### Example workflow - create a deployment status

On every `push` to a tag matching the pattern `v*`, [create a deployment](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status):

```yaml
on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Create Deployment

jobs:
  build:
    name: Create Deployment
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@master
      - name: Create Deployment
        id: create_deployment
        uses: alexcnichols/create-deployment@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          environment: production

        # Run the actual deployment

      - name: Create Deployment Status
        id: create_deployment_status
        uses: alexcnichols/create-deployment-status@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          deployment_id: ${{ steps.create_deployment.outputs.id }}
          state: success
          environment_url: https://alexcnichols.dev
```

This will create a [Deployment Status](https://help.github.com/en/github/administering-a-repository/viewing-deployment-activity-for-your-repository). This uses the `GITHUB_TOKEN` provided by the [virtual environment](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#github_token-secret), so no new token is needed.

## Contributing

We would love you to contribute to `@alexcnichols/create-deployment-status`, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
