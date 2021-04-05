import * as gcp from '@pulumi/gcp';

new gcp.projects.IAMPolicy('iam', {
  policyData:
    '{"bindings":[{"members":["serviceAccount:deploy@bjerk-core.iam.gserviceaccount.com"],"role":"roles/owner"}]}',
  project: 'bjerk-core',
});
