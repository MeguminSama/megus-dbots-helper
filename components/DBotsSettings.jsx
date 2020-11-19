const { React } = require('powercord/webpack')
const { Category, FormItem, TextAreaInput, TextInput } = require('powercord/components/settings')
const { Button, AdvancedScrollerThin, Text } = require('powercord/components')
const config = require('../config')
module.exports = class DBotsSettings extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      botCommandsCategory: false,
      guildSettingsCategory: false,
    }
    this.selectable = {
      marginRight: "20px",
      userSelect: "all"
    }
  }

  render() {
    const defaultValues = config.settings.defaultValues
    const { getSetting, updateSetting } = this.props
    return (
      <AdvancedScrollerThin>
        <Category
          name="Bot Commands"
          description="Customise what commands are run when affecting bots"
          opened={this.state.botCommandsCategory}
          onChange={() => { this.setState({ botCommandsCategory: !this.state.botCommandsCategory }) }}
        >
          <FormItem title="Help" note="You can click the text within the %%symbols%% to select it.">
            <Text>
              <span style={this.selectable}>%%BOT_MENTION%%</span> &#09; Mentions the affected user in the format &lt;@!id&gt; <br />
              <span style={this.selectable}>%%BOT_ID%%</span> &#09; Prints the affected user's account ID <br />
              <span style={this.selectable}>%%ACTION_REASON%%</span> &#09; Prints the action reason (without quotes)
            </Text>
          </FormItem>
          <FormItem note="You can disable a command by setting the contents to: %%NOCMD" />
          <TextInput
            title="Mute command"
            placeholder={defaultValues.chatSettings.mute}
            value={getSetting('dbots-mute-cmd', defaultValues.mute)}
            onChange={(value) => { updateSetting('dbots-mute-cmd', value) }}
          >Mute</TextInput>
          <TextInput
            title="Supermute command"
            placeholder={defaultValues.chatSettings.supermute}
            value={getSetting('dbots-supermute-cmd', defaultValues.supermute)}
            onChange={(value) => { updateSetting('dbots-supermute-cmd', value) }}
          >Supermute</TextInput>
          <TextInput
            title="Bully command"
            placeholder={defaultValues.chatSettings.bully}
            value={getSetting('dbots-bully-cmd', defaultValues.bully)}
            onChange={(value) => { updateSetting('dbots-bully-cmd', value) }}
          >Bully</TextInput>
          <TextInput
            title="Shitpostmute command"
            placeholder={defaultValues.chatSettings.shitpostmute}
            value={getSetting('dbots-shitpostmute-cmd', defaultValues.shitpostmute)}
            onChange={(value) => { updateSetting('dbots-shitpostmute-cmd', value) }}
          >Shitpostmute</TextInput>
          <TextInput
            title="Delete command"
            placeholder={defaultValues.chatSettings.delete}
            value={getSetting('dbots-delete-cmd', defaultValues.delete)}
            onChange={(value) => { updateSetting('dbots-delete-cmd', value) }}
          >Delete</TextInput>
          <Button
            onClick={() => {
              Object.keys(defaultValues.chatSettings).map(dv => {
                updateSetting(`dbots-${dv}-cmd`, defaultValues.chatSettings[dv])
              })
            }}
          >
            Restore Defaults
          </Button>
        </Category>
        <Category
          name="Guild Settings"
          description="Modify guild-specific settings"
          opened={this.state.guildSettingsCategory}
          onChange={() => { this.setState({ guildSettingsCategory: !this.state.guildSettingsCategory }) }}
        >
          <TextAreaInput
            title="Ignored role IDs"
            placeholder={defaultValues["ignored-roles"]}
            value={getSetting('dbots-ignored-roles', defaultValues["ignored-roles"])}
            onChange={(value) => { updateSetting('dbots-ignored-roles', value) }}
          >Newline separated role IDs to ignore</TextAreaInput>
          <Button
            onClick={() => { updateSetting('dbots-ignored-roles', defaultValues["ignored-roles"]) }}
          >
            Restore Defaults
          </Button>
        </Category>
      </AdvancedScrollerThin>
    )
  }
}