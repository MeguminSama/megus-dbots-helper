const { Plugin } = require('powercord/entities')
const { React, getModule, getAllModules } = require('powercord/webpack')
const { getOwnerInstance, waitFor } = require('powercord/util')
const { inject, uninject } = require('powercord/injector')
const { get } = require('powercord/http')
const { TabBar } = require('powercord/components')
const config = require('./config')
const DBotsTabBody = require('./components/DBotsTabBody')
const DBotsSettings = require('./components/DBotsSettings')
const DBotsConfirmationModal = require('./components/DBotsConfirmationModal')
const { open: openModal } = require('powercord/modal')

module.exports = class DBotsHelper extends Plugin {
  constructor () {
    super()
    this.LinkedDBotsConfirmationModal = this.settings.connectStore(
      DBotsConfirmationModal
    )
  }

  async startPlugin () {
    this.profileClasses = {
      ...(await getModule(['headerInfo', 'nameTag'])),
      ...(await getAllModules(['modal', 'inner'])[1]),
      ...(await getModule(['emptyIcon'])),
      header: (await getModule(['iconBackgroundTierNone', 'container'])).header
    }

    Object.keys(this.profileClasses).forEach(
      key =>
        (this.profileClasses[key] = `.${
          this.profileClasses[key].split(' ')[0]
        }`)
    )

    this.contextMenuClasses = {
      ...(await getModule([
        'layerContainer',
        'menu',
        'scroller',
        'submenuContainer'
      ]))
    }

    Object.keys(this.contextMenuClasses).forEach(
      key =>
        (this.contextMenuClasses[key] = `.${
          this.contextMenuClasses[key].split(' ')[0]
        }`)
    )

    powercord.api.settings.registerSettings('megus-dbots-helper', {
      category: 'megus-dbots-helper',
      label: "Megu's DBots Helper",
      render: DBotsSettings
    })

    // set all default values
    Object.keys(config.settings.defaultValues.chatSettings).map(k => {
      this.settings.set(
        k,
        this.settings.get(k, config.settings.defaultValues.chatSettings[k])
      )
    })

    this.utilityMethods = {
      sendMessage: (await getModule(['sendMessage', 'editMessage']))
        .sendMessage,
      getMember: (await pdk.getModule(['getMember'])).getMember
    }

    this.patchContextMenu()
    this.patchBotProfile()
  }

  async getBotInfo (id) {
    return await get(`https://discord.bots.gg/api/v1/bots/${id}`).then(
      r => r.body
    )
  }

  async patchContextMenu () {
    const MessageContextMenu = await getModule(
      m => m.default && m.default.displayName === 'MessageContextMenu'
    )
    const Default = MessageContextMenu.default
    const { MenuItem } = await getModule(['MenuItem'])
    const { MenuItemColor } = await getModule(['MenuItemColor'])
    const { getMember } = this.utilityMethods
    const _this = this
    if (!MessageContextMenu) return

    inject(
      'dbots-message-context-menu',
      MessageContextMenu,
      'default',
      ([{ channel, message }], res) => {
        if (!res || !res.props || !res.props.children) return res
        let children = res.props.children
        const { author } = message
        if (!author.bot) return res
        const ignoredRoles = _this.settings
          .get('dbots-ignored-roles', '')
          .split('\n')
          .map(i => i.replace(/\s/g, ''))
        const member = getMember(channel.guild_id, author.id)
        if (
          member &&
          member.roles &&
          member.roles.some(i => ignoredRoles.includes(i))
        )
          return res

        const methods = [
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
            color: MenuItemColor.DANGER
          },
          {
            action: 'delete',
            commandKey: 'dbots-delete-cmd',
            color: MenuItemColor.DANGER
          }
        ]

        const menuLogo = 'https://discord.bots.gg/img/logo_transparent.png'
        children.splice(
          5,
          0,
          React.createElement(
            MenuItem,
            {
              name: 'Discord Bots',
              id: 'DiscordBotsSubMenu',
              label: 'Discord Bots',
              imageUrl: menuLogo,
              color: MenuItemColor.BRAND
            },
            methods
              .filter(m => _this.settings.get(m.commandKey, '') !== '%%NOCMD')
              .map(m =>
                React.createElement(MenuItem, {
                  name: m.action,
                  id: `DiscordBotsContext${m.action}`,
                  label: m.action.charAt(0).toUpperCase() + m.action.slice(1),
                  color: m.color || MenuItemColor.DEFAULT,
                  action: () => {
                    openModal(() =>
                      React.createElement(_this.LinkedDBotsConfirmationModal, {
                        action: m.action,
                        author,
                        channel,
                        utilityMethods: _this.utilityMethods,
                        commandKey: m.commandKey
                      })
                    )
                  }
                })
              )
          )
        )
        return res
      }
    )

    Object.assign(MessageContextMenu.default, Default)
  }

  async patchBotProfile () {
    const { profileClasses } = this
    const instance = getOwnerInstance(
      (
        await waitFor(
          [
            profileClasses.modal,
            profileClasses.headerInfo,
            profileClasses.nameTag
          ].join(' ')
        )
      ).parentElement
    )

    const { tabBarItem } = await getModule(['tabBarItem'])

    const UserProfileBody = instance._reactInternalFiber.return.type

    const _this = this

    inject(
      'dbots-profile-tab',
      UserProfileBody.prototype,
      'renderTabBar',
      function (_, res) {
        const { user } = this.props

        if (!res || !user || !user.bot) return res

        const dbTab = React.createElement(
          TabBar.Item,
          {
            key: 'DBOTS_MENU_ITEM',
            className: tabBarItem,
            id: 'DBOTS_MENU_ITEM'
          },
          'Discord Bots'
        )

        res.props.children.props.children.push(dbTab)

        return res
      }
    )

    inject(
      'dbots-profile-async-tab-body',
      UserProfileBody.prototype,
      'componentDidMount',
      async function (_, res) {
        const { user } = this.props
        try {
          const data = await _this.getBotInfo(user.id)
          console.log(data)
          this.setState({ isOnSite: true, moderationCategoryOpen: false, data })
        } catch (e) {
          console.log('[DBOTS AsyncTabBody]', e)
          this.setState({
            isOnSite: false,
            moderationCategoryOpen: false,
            data: null
          })
        }
      }
    )

    inject(
      'dbots-profile-tab-body',
      UserProfileBody.prototype,
      'render',
      function (_, res) {
        const { children } = res.props
        const { section } = this.props

        if (section !== 'DBOTS_MENU_ITEM') return res
        const body = children.props.children[1]
        const { user } = body.props.children.props

        if (!user || !user.bot || !user.id) return res

        body.props.children = []

        body.props.children.push(
          React.createElement(DBotsTabBody, {
            id: user.id,
            data: this.state.data,
            isOnSite: this.state.isOnSite,
            user: user
          })
        )
        return res
      }
    )
  }

  pluginWillUnload () {
    uninject('dbots-profile-tab')
    uninject('dbots-profile-tab-body')
    uninject('dbots-profile-async-tab-body')
    uninject('dbots-message-context-menu')

    powercord.api.settings.unregisterSettings('megus-dbots-helper')
  }
}
