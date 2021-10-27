const { SlashCommand } = require('slash-create');
const { emojis } = require('../helpers/emojis');
module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'skip',
            description: 'Skip to the current song',

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run(ctx) {
        
        const { client } = require('..');
        
        await ctx.defer();
        const queue = client.player.getQueue(ctx.guildID);
        if (!queue || !queue.playing) return void ctx.sendFollowUp({ content: `${emojis.sad} | No music is being played!` });
        const currentTrack = queue.current;
        const success = queue.skip();
        return void ctx.sendFollowUp({
            content: success ? `${emojis.done} | Skipped **${currentTrack}**!` : `${emojis.cry} | Something went wrong!`
        });

    }
};
