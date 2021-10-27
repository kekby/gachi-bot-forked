const emojis = {
    thinking: '',
    hype: '',
    sad: '',
    ok: '',
    cry: '',
    done: '',
    trapped: ''
};

const getEmoji = (emojis, emojiName, fallback = '') => {
    const emoji = emojis.find((emj) => emj.name === emojiName);
    if (emoji) {
        return emoji.toString();
    }

    return fallback;
};

const extractEmojis = (emojisCache) => {
    emojis.thinking = getEmoji(emojisCache, 'gachiThinking', '⏱');
    emojis.hype = getEmoji(emojisCache, 'gachiHYPER', '🎶');
    emojis.sad = getEmoji(emojisCache, 'gachiSad', '🛑');
    emojis.ok = getEmoji(emojisCache, 'gachiOkay', '✅');
    emojis.cry = getEmoji(emojisCache, 'gachiHands', '🛑');
    emojis.done = getEmoji(emojisCache, 'gachiRicardo', '✅');
    emojis.trapped = getEmoji(emojisCache, 'gachiTrapped', '🛑');
};

module.exports = {
    emojis,
    extractEmojis
};