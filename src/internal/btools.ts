import * as gcp from '@pulumi/gcp';
import { billingAccount } from '../config';
import { folder } from './folder';

export const project = new gcp.organizations.Project(
  'btools',
  {
    autoCreateNetwork: true,
    billingAccount,
    name: 'btools',
    projectId: 'btools',
    folderId: folder.id,
  },
  { protect: true },
);
