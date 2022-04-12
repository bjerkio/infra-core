import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { makePulumiCallback } from 'gcl-slack';

const config = new pulumi.Config('slack');

export class ProjectSlackLogger extends pulumi.ComponentResource {
  constructor(
    name: string,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('bjerk:project-slack-logger', name, {}, opts);

    const topic = new gcp.pubsub.Topic('slack-logger', {}, { parent: this });

    const serviceAccount = new gcp.serviceaccount.Account(
      'slack-logger',
      {
        accountId: 'slack-logger',
      },
      { parent: this },
    );

    topic.onMessagePublished(
      'every-log-entry',
      {
        region: 'europe-west1',
        runtime: 'nodejs14',
        serviceAccountEmail: serviceAccount.email,
        environmentVariables: {
          SLACK_TOKEN: config.requireSecret('bot-oauth-token'),
          DEFAULT_SLACK_CHANNEL: config.require('default-channel'),
        },
        callback: makePulumiCallback('api', {
          apiOptions: { defaultChannel: config.require('default-channel') },
        }),
      },
      {},
      { parent: this },
    );

    const logSink = new gcp.logging.ProjectSink(
      'every-log-entry',
      {
        name: 'every-log-entry',
        filter:
          'operation.producer="github.com/bjerkio/google-cloud-logger-slack@v1"',
        destination: pulumi.interpolate`pubsub.googleapis.com/${topic.id}`,
      },
      { protect: true, parent: this },
    );

    new gcp.pubsub.TopicIAMMember(
      'every-log-entry-log-sink-pubsub-publisher',
      {
        topic: topic.name,
        role: 'roles/pubsub.publisher',
        member: logSink.writerIdentity,
      },
      { protect: true, parent: this },
    );
  }
}
