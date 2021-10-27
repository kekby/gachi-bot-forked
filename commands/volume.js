const { SlashCommand, CommandOptionType } = require('slash-create');
const { emojis } = require('../helpers/emojis');

module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'volume',
            description: 'Set music volume',
            options: [
                {
                    name: 'amount',
                    type: CommandOptionType.INTEGER,
                    description: 'The volume amount to set (0-100)',
                    required: false
                }
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        
        const { client } = require('..');
        
        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: `${emojis.sad} | No music is being played!` });
        const vol = parseInt(ctx.options.amount);
        if (!vol) return void ctx.sendFollowUp({ content: `${emojis.done} | Current volume is **${queue.volume}**%!` });
        if (vol < 0 || vol > 100) return void ctx.sendFollowUp({ content: `${emojis.trapped} | Volume range must be 0-100` });
        const success = queue.setVolume(vol);
        return void ctx.sendFollowUp({
            content: success ? `${emojis.done} | Volume set to **${vol}%**!` : `${emojis.cry} | Something went wrong!`
        });

    }
};
