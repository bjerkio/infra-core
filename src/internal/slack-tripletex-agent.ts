import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';
import { ProjectSlackLogger } from '../slack-logger';

export const setup = new ProjectOnGithub(
  'slack-tripletex-agent',
  {
    projectName: 'slack-tripletex-agent',
    folderId: folder.id,
    repository: 'slack-tripletex-agent',
  },
  { providers: [bjerkio] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'slack-tripletex-agent-owner-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);

new ProjectSlackLogger('slack-tripletex-agent', {
  provider: setup.googleProvider,
});
