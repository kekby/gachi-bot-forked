const { SlashCommand, CommandOptionType } = require('slash-create');
const { QueueRepeatMode } = require('discord-player');
const { emojis } = require('../helpers/emojis');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'loop',
            description: 'Set loop mode',
            options: [
                {
                    name: 'mode',
                    type: CommandOptionType.INTEGER,
                    description: 'Loop type',
                    required: true,
                    choices: [
                        {
                            name: 'Off',
                            value: QueueRepeatMode.OFF
                        },
                        {
                            name: 'Track',
                            value: QueueRepeatMode.TRACK
                        },
                        {
                            name: 'Queue',
                            value: QueueRepeatMode.QUEUE
                        },
                        {
                            name: 'Autoplay',
                            value: QueueRepeatMode.AUTOPLAY
                        }
                    ]
                }
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: `${emojis.sad} | No music is being played!` });
        const loopMode = ctx.options.mode;
        const success = queue.setRepeatMode(loopMode);
        const mode = loopMode === QueueRepeatMode.TRACK || loopMode === QueueRepeatMode.QUEUE ? emojis.trapped : emojis.hype;
        return void ctx.sendFollowUp({ content: success ? `${mode} | Updated loop mode!` : `${emojis.sad} | Could not update loop mode!` });
    }
};
