import { organizations } from '@pulumi/gcp';
import { billingAccount } from '../config';
import { folder } from './folder';

export const project = new organizations.Project('bjerk-accounting', {
  projectId: 'bjerk-accounting',
  folderId: folder.id,
  billingAccount,
});
