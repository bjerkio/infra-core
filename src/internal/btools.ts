import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import { billingAccount } from '../config';
import { folder } from './folder';

export const githubProvider = new github.Provider(`btools-provider`, {
  owner: 'btoolsorg',
});

export const setup = new ProjectOnGithub(
  'btools-project',
  {
    projectName: 'btools',
    folderId: folder.id,
    repository: 'infra',
    projectAliases: [
      'urn:pulumi:prod::bjerk-io-core::gcp:organizations/project:Project::btools',
    ],
  },
  { providers: [bjerkio, githubProvider] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'btools-owner-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);
