import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

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
