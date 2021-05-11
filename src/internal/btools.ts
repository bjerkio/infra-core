import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { ProjectOnGithub } from '../components/projects-on-github';
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
  { providers: [githubProvider] },
);

export const ownerRole = new gcp.projects.IAMMember(
  'btools-owner-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);
