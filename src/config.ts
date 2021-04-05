import * as pulumi from '@pulumi/pulumi';

export const config = new pulumi.Config();
export const billingAccount = config.getSecret('billingAccount');
export const organizationNumber = 904377566042;
