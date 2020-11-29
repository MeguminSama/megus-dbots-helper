module.exports = {
  settings: {
    defaultValues: {
      chatSettings: {
        mute: 'pls mute %%BOT_MENTION%% %%ACTION_REASON%%',
        supermute: 'pls supermute %%BOT_MENTION%% %%ACTION_REASON%%',
        bully: 'pls bully %%BOT_MENTION%% %%ACTION_REASON%%',
        shitpostmute: 'pls shitpostmute %%BOT_MENTION%% %%ACTION_REASON%%',
        delete: 'pls delete %%BOT_MENTION%% %%ACTION_REASON%%'
      },
      'ignored-roles': '479762844720824320'
    },
    reasons: [
      'Spamming chat',
      'Broken bot',
      'Markdown conflict',
      'Conflicts with moderation bot',
      'Autoresponse',
      'Responding to non-listed prefix'
    ]
  },
  commandParser: (string, { author, channel, reason }) => {
    let tmp = string
      .replace(/%%BOT_MENTION%%/g, `<@!${author.id}>`)
      .replace(/%%BOT_ID%%/g, `${author.id}`)
      .replace(/%%ACTION_REASON%%/g, `${reason}`)
    return tmp
  }
}
