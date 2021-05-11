import * as pulumi from '@pulumi/pulumi';
import { billingAccount, pulumiAccessToken } from '../config';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import { invariant } from '../utils';

export interface ProjectOnGithubSpec {
  projectName?: pulumi.Input<string>;
  folderId?: pulumi.Input<string>;
  project?: gcp.organizations.Project;
  repository: pulumi.Input<string>;
  projectAliases?: pulumi.Input<pulumi.URN | pulumi.Alias>[];
}

export class ProjectOnGithub extends pulumi.ComponentResource {
  readonly project: gcp.organizations.Project;

  // Google Provider
  readonly googleProvider: gcp.Provider;

  // Service Account
  readonly serviceAccount: gcp.serviceaccount.Account;
  readonly serviceAccountKey: gcp.serviceaccount.Key;

  // Secrets
  readonly ghPulumiSecret: github.ActionsSecret;
  readonly ghGCPKeySecret: github.ActionsSecret;
  readonly ghGCPProjectSecret: github.ActionsSecret;

  constructor(
    name: string,
    args: ProjectOnGithubSpec,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerk:project', name, args, opts);

    const { project, projectName, folderId, repository, projectAliases } = args;

    if (!project) {
      invariant(projectName, 'expect projectName when no project is attached');
      invariant(folderId, 'expect folderId name when no project is attached');
    }

    this.project = project
      ? project
      : new gcp.organizations.Project(
          name,
          {
            autoCreateNetwork: true,
            billingAccount,
            name: pulumi.output(projectName).apply((p) => p || ''),
            projectId: pulumi.output(projectName).apply((p) => p || ''),
            folderId,
          },
          { protect: true, parent: this, aliases: projectAliases },
        );

    this.googleProvider = new gcp.Provider(
      name,
      {
        project: this.project.projectId,
      },
      { parent: this },
    );

    this.ghPulumiSecret = new github.ActionsSecret(
      `${name}-pulumi`,
      {
        secretName: 'PULUMI_ACCESS_TOKEN',
        plaintextValue: pulumiAccessToken.apply((t) => t || ''),
        repository,
      },
      { parent: this },
    );

    this.serviceAccount = new gcp.serviceaccount.Account(
      name,
      {
        accountId: 'deploy',
      },
      { provider: this.googleProvider, parent: this },
    );

    this.serviceAccountKey = new gcp.serviceaccount.Key(
      name,
      {
        serviceAccountId: this.serviceAccount.accountId,
      },
      { provider: this.googleProvider, parent: this },
    );

    this.ghGCPKeySecret = new github.ActionsSecret(
      `${name}-gcp-key`,
      {
        secretName: 'GOOGLE_PROJECT_SA_KEY',
        plaintextValue: this.serviceAccountKey.privateKey,
        repository,
      },
      { parent: this },
    );

    this.ghGCPProjectSecret = new github.ActionsSecret(
      `${name}-gcp-project`,
      {
        secretName: 'GOOGLE_PROJECT_ID',
        plaintextValue: this.project.projectId,
        repository,
      },
      { parent: this },
    );
  }
}
