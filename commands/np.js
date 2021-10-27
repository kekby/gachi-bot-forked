const { SlashCommand } = require('slash-create');
const { emojis } = require('../helpers/emojis');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'np',
            description: 'See what\'s currently being played',

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: `${emojis.sad} | No music is being played!` });
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return void ctx.sendFollowUp({
            embeds: [
                {
                    title: 'Now Playing',
                    description: `${emojis.hype} | **${queue.current.title}**! (\`${perc.progress == 'Infinity' ? 'Live' : perc.progress + '%'}\`)`,
                    fields: [
                        {
                            name: '\u200b',
                            value: progress.replace(/ 0:00/g, ' ◉ LIVE')
                        }
                    ],
                    color: 0xffffff
                }
            ]
        });
    }
};
