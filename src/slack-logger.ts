import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { makePulumiCallback } from 'gcl-slack';

const config = new pulumi.Config('slack');

export interface ProjectSlackLoggerArgs {
  channel: string;
}

export class ProjectSlackLogger extends pulumi.ComponentResource {
  constructor(name: string, args: ProjectSlackLoggerArgs, opts?: pulumi.ComponentResourceOptions) {
    super('bjerk:project-slack-logger', name, args, opts);

    const topic = new gcp.pubsub.Topic(name, {}, { parent: this });

    const serviceAccount = new gcp.serviceaccount.Account(
      name,
      {
        accountId: name,
      },
      { parent: this },
    );

    topic.onMessagePublished(
      name,
      {
        region: 'europe-west1',
        runtime: 'nodejs14',
        serviceAccountEmail: serviceAccount.email,
        environmentVariables: {
          SLACK_TOKEN: config.requireSecret('bot-oauth-token'),
          DEFAULT_SLACK_CHANNEL: args.channel,
        },
        callback: makePulumiCallback('api', {
          apiOptions: { defaultChannel: args.channel },
        }),
      },
      {},
      { parent: this },
    );

    const logSink = new gcp.logging.ProjectSink(
      name,
      {
        name,
        filter:
          'operation.producer="github.com/bjerkio/google-cloud-logger-slack@v1"',
        destination: pulumi.interpolate`pubsub.googleapis.com/${topic.id}`,
      },
      { protect: true, parent: this },
    );

    new gcp.pubsub.TopicIAMMember(
      name,
      {
        topic: topic.name,
        role: 'roles/pubsub.publisher',
        member: logSink.writerIdentity,
      },
      { protect: true, parent: this },
    );
  }
}
