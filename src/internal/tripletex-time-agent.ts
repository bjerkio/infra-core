import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';
import { ProjectSlackLogger } from '../slack-logger';
import { Config } from '@pulumi/pulumi';

const config = new Config('tripletex-time-agent');

export const setup = new ProjectOnGithub(
  'tripletex-time-agent',
  {
    projectName: 'tripletex-time-agent',
    folderId: folder.id,
    repository: 'tripletex-time-agent',
  },
  { providers: [bjerkio] },
);

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
      `tta-${service}`,
      {
        service,
        disableOnDestroy: false,
        project: 'tripletex-time-agent',
      },
      { dependsOn: setup },
    ),
);

export const dnsRole = new gcp.projects.IAMMember(
  'tripletex-time-agent-owner-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);

new ProjectSlackLogger(
  'tripletex-time-agent',
  { channel: config.require('slack-channel') },
  { provider: setup.googleProvider, dependsOn: apiServices },
);
