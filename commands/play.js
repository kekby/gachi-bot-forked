const { SlashCommand, CommandOptionType } = require('slash-create');
const { QueryType } = require('discord-player');
const { emojis } = require('../helpers/emojis');
const playdl = require('play-dl');
module.exports = class extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'play',
            description: 'Play a song from youtube',
            options: [
                {
                    name: 'query',
                    type: CommandOptionType.STRING,
                    description: 'The song you want to play',
                    required: true
                }
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ? [ process.env.DISCORD_GUILD_ID ] : undefined
        });
    }

    async run (ctx) {

        const { client } = require('..');

        await ctx.defer();

        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        const query = ctx.options.query;
        const searchResult = await client.player
            .search(query, {
                requestedBy: ctx.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {
                console.log('he');
            });
        if (!searchResult || !searchResult.tracks.length) return void ctx.sendFollowUp({ content: 'No results were found!' });

        const queue = await client.player.createQueue(guild, {
            metadata: channel,
            async onBeforeCreateStream(track, source) {
                if (source === 'youtube') {
                    return (await playdl.stream(track.url)).stream;
                }
            }
        });

        const member = guild.members.cache.get(ctx.user.id) ?? await guild.members.fetch(ctx.user.id);
        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch {
            void client.player.deleteQueue(ctx.guildID);
            return void ctx.sendFollowUp({ content: `${emojis.cry} | Could not join your voice channel!`});
        }
        
        await ctx.sendFollowUp({ content: `${emojis.thinking} | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...` });

        if (searchResult.playlist) {
            queue.addTracks(searchResult.tracks);
            ctx.sendFollowUp({ content: `${emojis.done} | Added ${searchResult.tracks.length} tracks to queue` });
        } else {
            queue.addTrack(searchResult.tracks[0]);
        }
        
        if (!queue.playing) await queue.play();
    }
};
