import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';
import { ProjectSlackLogger } from '../slack-logger';
import { Config } from '@pulumi/pulumi';

const config = new Config('timely-agent');

export const setup = new ProjectOnGithub(
  'timely-agent',
  {
    projectName: 'timely-agent',
    folderId: folder.id,
    repository: 'timely-agent',
  },
  { providers: [bjerkio] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'timely-agent-owner-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);

new ProjectSlackLogger(
  'timely-agent',
  { channel: config.require('slack-channel') },
  { provider: setup.googleProvider },
);
