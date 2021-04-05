import * as gcp from '@pulumi/gcp';
import { organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('internal-folder', {
  displayName: 'Internal',
  parent: `organizations/${organizationNumber}`,
});
