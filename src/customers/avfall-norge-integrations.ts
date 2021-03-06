import * as github from '@pulumi/github';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { ProjectSlackLogger } from '../slack-logger';
import { Config } from '@pulumi/pulumi';

const name = 'intg-avfnor';
const config = new Config(name);

const repositories = [
  'copper-checkin-agent',
  'copper-mailchimp-agent',
  'copper-tripletex-agent',
];

const githubProvider = new github.Provider(name, {
  owner: 'avfall-norge',
});

export const setup = new ProjectOnGithub(
  name,
  {
    projectName: name,
    folderId: folder.id,
    repository: 'infra',
  },
  { providers: [githubProvider] },
);

repositories.map((repository) => [
  new github.ActionsSecret(
    `${name}-${repository}-gcp-key`,
    {
      secretName: 'GOOGLE_PROJECT_SA_KEY',
      plaintextValue: setup.serviceAccountKey.privateKey,
      repository,
    },
    { provider: githubProvider },
  ),
  new github.ActionsSecret(
    `${name}-${repository}-gcp-project`,
    {
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: setup.project.projectId,
      repository,
    },
    { provider: githubProvider },
  ),
]);

export const services = [
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
  'container.googleapis.com',
  'compute.googleapis.com',
  'dns.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'logging.googleapis.com',
  'stackdriver.googleapis.com',
  'monitoring.googleapis.com',
  'cloudtrace.googleapis.com',
  'clouderrorreporting.googleapis.com',
  'clouddebugger.googleapis.com',
  'cloudprofiler.googleapis.com',
  'sqladmin.googleapis.com',
  'cloudkms.googleapis.com',
  'cloudfunctions.googleapis.com',
  'run.googleapis.com',
  'cloudbuild.googleapis.com',
  'iam.googleapis.com',
  'cloudbilling.googleapis.com',
];

export const apiServices = services.map(
  (service) =>
    new gcp.projects.Service(
      `${name}-${service}`,
      {
        service,
        disableOnDestroy: false,
        project: name,
      },
      { dependsOn: [setup] },
    ),
);

new ProjectSlackLogger(
  name,
  { channel: config.require('slack-channel') },
  { provider: setup.googleProvider, dependsOn: apiServices },
);
