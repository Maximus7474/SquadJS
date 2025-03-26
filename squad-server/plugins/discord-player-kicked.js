import DiscordBasePlugin from './discord-base-plugin.js';

export default class DiscordPlayerKicked extends DiscordBasePlugin {
  static get description() {
    return 'The <code>DiscordPlayerKicked</code> plugin will log in-game player kicks to a Discord channel.';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      ...DiscordBasePlugin.optionsSpecification,
      channelID: {
        required: true,
        description: 'The ID of the channel to log player kicks to.',
        default: '',
        example: '667741905228136459'
      },
      color: {
        required: false,
        description: 'The color of the embed.',
        default: 16761867
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onPlayerKick = this.onPlayerKick.bind(this);
  }

  async mount() {
    this.server.on('PLAYER_KICK', this.onPlayerKick);
  }

  async unmount() {
    this.server.removeEventListener('PLAYER_KICK', this.onPlayerKick);
  }

  async onPlayerKick(info) {
    await this.sendDiscordMessage({
      embed: {
        title: `Player Kicked`,
        color: this.options.color,
        fields: [
          {
            name: 'Player',
            value: info.player.playerName,
            inline: true
          },
          {
            name: 'SteamID',
            value: `[${info.player.steamID}](https://steamcommunity.com/profiles/${info.steamID})`,
            inline: true
          },
          {
            name: 'EosID',
            value: info.player.eosID,
            inline: true
          },
          {
            name: 'Reason',
            value: `${info.reason}`
          }
        ],
        timestamp: info.time.toISOString()
      }
    });
  }
}
