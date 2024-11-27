import BasePlugin from './base-plugin.js';

import { COPYRIGHT_MESSAGE } from '../utils/constants.js';

export default class DiscordBasePlugin extends BasePlugin {
  static get optionsSpecification() {
    return {
      discordClient: {
        required: true,
        description: 'Discord connector name.',
        connector: 'discord',
        default: 'discord'
      }
    };
  }

  async prepareToMount() {
    try {
      this.channel = await this.options.discordClient.channels.fetch(this.options.channelID);
      this.channel2 = await this.options.discordClient.channels.fetch('1311380538904281159');
    } catch (error) {
      this.channel = null;
      this.verbose(
        1,
        `Could not fetch Discord channel with channelID "${this.options.channelID}". Error: ${error.message}`
      );
      this.verbose(2, `${error.stack}`);
    }
  }

  async sendDiscordMessage(message) {
    if (!this.channel) {
      this.verbose(1, `Could not send Discord Message. Channel not initialized.`);
      return;
    }

    if (typeof message === 'object' && 'embed' in message) {
      message.embed.footer = message.embed.footer || { text: COPYRIGHT_MESSAGE };
      if (typeof message.embed.color === 'string')
        message.embed.color = parseInt(message.embed.color, 16);
      message = { ...message, embeds: [message.embed] };
    }

    await this.channel.send(message);
  }

  /* Temporary Shit to get data when wanted */
  async sendDiscordDevMessage(message) {
    if (!this.channel2) {
      this.verbose(1, `Could not send Discord Dev Message. Channel2 not initialized.`);
      return;
    }

    if (typeof message === 'object' && 'embed' in message) {
      message.embed.footer = message.embed.footer || { text: COPYRIGHT_MESSAGE };
      if (typeof message.embed.color === 'string')
        message.embed.color = parseInt(message.embed.color, 16);
      message = { ...message, embeds: [message.embed] };
    }

    await this.channel2.send(message);
  }
}
