import * as pulumi from '@pulumi/pulumi';

export const config = new pulumi.Config();
export const billingAccount = config.requireSecret('billingAccount');
export const organizationNumber = 904377566042;
export const pulumiAccessToken = pulumi.secret(process.env.PULUMI_ACCESS_TOKEN);
export const githubToken = pulumi.secret(process.env.GITHUB_TOKEN);
