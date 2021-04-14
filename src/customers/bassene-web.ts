import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';
import { basssene } from '../github-orgs';

export const setup = new ProjectOnGithub(
  'bassene-web',
  {
    projectName: 'bassene-web',
    folderId: folder.id,
    repository: 'infra',
  },
  { providers: [basssene] },
);

export const dnsRole = new gcp.projects.IAMMember(
  'bassene-web-dns-iam',
  {
    member: pulumi.interpolate`serviceAccount:${setup.serviceAccount.email}`,
    role: 'roles/owner',
  },
  { provider: setup.googleProvider },
);
