import * as gcp from '@pulumi/gcp';
import { organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('customer-folder', {
  displayName: 'Customers',
  parent: `organizations/${organizationNumber}`,
});
