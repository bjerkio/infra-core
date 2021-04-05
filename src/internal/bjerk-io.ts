import * as gcp from '@pulumi/gcp';
import { billingAccount } from '../config';
import { folder } from './folder';

export const project = new gcp.organizations.Project(
  'bjerk-io',
  {
    autoCreateNetwork: true,
    billingAccount,
    name: 'bjerk-io',
    projectId: 'bjerk-io',
    folderId: folder.id,
  },
  { protect: true },
);
