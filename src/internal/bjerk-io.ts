import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { bjerkio } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bjerk-io',
  {
    projectName: 'bjerk-io',
    folderId: folder.id,
    repository: 'infra-bjerk-io',
    projectAliases: [
      'urn:pulumi:prod::bjerk-io-core::gcp:organizations/project:Project::bjerk-io',
    ],
  },
  { providers: [bjerkio] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'bjerk-io-dns-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/dns.admin',
  },
  { provider: setup.googleProvider },
);
