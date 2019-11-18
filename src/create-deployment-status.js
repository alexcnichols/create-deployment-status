const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {
  try {
    // Get authenticated GitHub client
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner, repo, and sha from context of payload that triggered the action
    const { owner, repo } = context.repo;
    const { sha } = context;

    // Get the inputs from the workflow file
    const deploymentId = core.getInput('deployment_id', { required: true });
    const state = core.getInput('state', { required: true });
    const logUrl = `https://github.com/${owner}/${repo}/commit/${sha}/checks`;
    const environmentUrl = core.getInput('environment_url', { required: false });

    // Create a deployment status
    // API Documentation: https://developer.github.com/v3/repos/deployments/#create-a-deployment-status
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-deployment-status
    const createDeploymentStatusResponse = await github.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id: deploymentId,
      state,
      target_url: logUrl,
      log_url: logUrl,
      environment_url: environmentUrl
    });

    // Get the ID for the created Deployment Status from the response
    const {
      data: { id: deploymentStatusId }
    } = createDeploymentStatusResponse;

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput('id', deploymentStatusId);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
