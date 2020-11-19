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
      .replaceAll('%%BOT_MENTION%%', `<@!${author.id}>`)
      .replaceAll('%%BOT_ID%%', `${author.id}`)
      .replaceAll('%%ACTION_REASON%%', `${reason}`)
    return tmp
  }
}
