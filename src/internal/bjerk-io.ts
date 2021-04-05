import { ProjectOnGithub } from '../components/projects-on-github';
import { folder } from './folder';

export const setup = new ProjectOnGithub('bjerk-io', {
  projectName: 'bjerk-io',
  folderId: folder.id,
  repository: 'bjerk-io-infra',
  projectAliases: [
    'urn:pulumi:prod::bjerk-io-core::gcp:organizations/project:Project::bjerk-io',
  ],
});
