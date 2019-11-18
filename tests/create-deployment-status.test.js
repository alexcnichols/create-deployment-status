jest.mock('@actions/core');
jest.mock('@actions/github');

const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const run = require('../src/create-deployment-status.js');

/* eslint-disable no-undef */
describe('Create Deployment Status', () => {
  let createDeploymentStatus;

  beforeEach(() => {
    createDeploymentStatus = jest.fn().mockReturnValueOnce({
      data: {
        id: 'deploymentStatusId'
      }
    });

    context.repo = {
      owner: 'owner',
      repo: 'repo'
    };
    context.sha = 'sha';

    const github = {
      repos: {
        createDeploymentStatus
      }
    };

    GitHub.mockImplementation(() => github);
  });

  test('Create deployment status endpoint is called', async () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('deploymentId')
      .mockReturnValueOnce('state');

    await run();

    expect(createDeploymentStatus).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      deployment_id: 'deploymentId',
      state: 'state',
      target_url: 'https://github.com/owner/repo/commit/sha/checks',
      log_url: 'https://github.com/owner/repo/commit/sha/checks'
    });
  });

  test('Create deployment status with environment url input is called', async () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('deploymentId')
      .mockReturnValueOnce('state')
      .mockReturnValueOnce('environmentUrl');

    await run();

    expect(createDeploymentStatus).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      deployment_id: 'deploymentId',
      state: 'state',
      target_url: 'https://github.com/owner/repo/commit/sha/checks',
      log_url: 'https://github.com/owner/repo/commit/sha/checks',
      environment_url: 'environmentUrl'
    });
  });

  test('Outputs are set', async () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('deploymentId')
      .mockReturnValueOnce('state')
      .mockReturnValueOnce('environmentUrl');

    core.setOutput = jest.fn();

    await run();

    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'id', 'deploymentStatusId');
  });

  test('Action fails elegantly', async () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('deploymentId')
      .mockReturnValueOnce('state')
      .mockReturnValueOnce('environmentUrl');

    createDeploymentStatus.mockRestore();
    createDeploymentStatus.mockImplementation(() => {
      throw new Error('Error creating deployment status');
    });

    core.setOutput = jest.fn();

    core.setFailed = jest.fn();

    await run();

    expect(createDeploymentStatus).toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith('Error creating deployment status');
    expect(core.setOutput).toHaveBeenCalledTimes(0);
  });
});
