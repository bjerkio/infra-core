import * as gcp from '@pulumi/gcp';
import { billingAccount } from './config';

new gcp.organizations.Project('veltno', {
  autoCreateNetwork: true,
  billingAccount,
  name: 'veltno',
  projectId: 'veltno',
});

new gcp.organizations.Project("tomba-domains", {
    autoCreateNetwork: true,
    billingAccount,
    name: "tomba-domains",
    projectId: "tomba-domains",
});

new gcp.organizations.Project("test-github-pulumi", {
    autoCreateNetwork: true,
    billingAccount,
    name: "test-github-polo",
    projectId: "test-github-polo",
});
