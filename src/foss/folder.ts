import * as gcp from '@pulumi/gcp';
import { organizationNumber } from '../config';

export const folder = new gcp.organizations.Folder('foss-folder', {
  displayName: 'FOSS',
  parent: `organizations/${organizationNumber}`,
});
