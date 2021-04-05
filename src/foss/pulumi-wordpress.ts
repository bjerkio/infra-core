import * as gcp from '@pulumi/gcp';
import { billingAccount } from '../config';
import { folder } from './folder';

export const project = new gcp.organizations.Project(
  'test-pulumi-wordpress',
  {
    autoCreateNetwork: true,
    billingAccount,
    name: 'test-pulumi-wordpress',
    projectId: 'test-pulumi-wordpress',
    folderId: folder.id,
  },
  { protect: true },
);
