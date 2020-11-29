module.exports = {
  settings: {
    actions: [
      {
        action: 'mute',
        commandKey: 'dbots-mute-cmd'
      },
      {
        action: 'supermute',
        commandKey: 'dbots-supermute-cmd'
      },
      {
        action: 'bully',
        commandKey: 'dbots-bully-cmd'
      },
      {
        action: 'shitpostmute',
        commandKey: 'dbots-shitpostmute-cmd',
        color: 'colorDanger'
      },
      {
        action: 'delete',
        commandKey: 'dbots-delete-cmd',
        color: 'colorDanger'
      }
    ],
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
    reasons: {
      mute: [
        'Spamming chat',
        'Broken bot',
        'Markdown conflict',
        'Conflicts with moderation bot',
        'Autoresponse',
        'Responding to non-listed prefix',
        '! prefix'
      ],
      supermute: [
        'Spamming chat',
        'Broken bot',
        'Markdown conflict',
        'Conflicts with moderation bot',
        'Autoresponse',
        'Responding to non-listed prefix',
        '! prefix'
      ],
      bully: [
        'Broken prefix',
        'Reacts to message',
        'DM on message',
        '!help DM',
        'No permission DM',
        'Unknown command DM'
      ],
      shitpostmute: [
        'Broken bot',
        'Spamming',
        'Responding to bot messages',
        'Sending a message for every user',
        'DM on unknown command in testing channels',
        'Preemptive mute'
      ]
    }
  },
  commandParser: (string, { author, channel, reason }) => {
    let tmp = string
      .replace(/%%BOT_MENTION%%/g, `<@!${author.id}>`)
      .replace(/%%BOT_ID%%/g, `${author.id}`)
      .replace(/%%ACTION_REASON%%/g, `${reason}`)
    return tmp
  }
}
