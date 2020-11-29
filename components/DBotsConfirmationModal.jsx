const { React } = require('powercord/webpack')
const { close: closeModal } = require('powercord/modal')
const { Modal } = require('powercord/components/modal')
const { TextInput } = require('powercord/components/settings')
const { Button, Text } = require('powercord/components')
const { shell: { openExternal } } = require('electron')
const config = require('../config')

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

module.exports = class DBotsConfirmationModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { action, author, channel } = props
    this.state = {
      error: "",
      reason: ""
    }
    this.actionType = action
    this.action = toTitleCase(`${action} ${author.username}#${author.discriminator}`)
    this.buttonStyle = {
      marginRight: "10px"
    }
    this.defaults = config.settings.reasons[action] || []
    this.defaultButtons = this.defaults.map(d => (
      <Button
        color={Button.Colors.TRANSPARENT}
        style={{
          marginBottom: "5px",
          width: "100%"
        }}
        onClick={() => { this.setState({ reason: d + ' ' }) }}
      >
        {d}
      </Button>
    ))
  }

  render() {
    const { sendMessage, getMember } = { ...this.props.utilityMethods }
    const { author, channel, getSetting, commandKey, action } = this.props
    return (
      <Modal>
        <Modal.Header style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ width: "100%" }}>
            <h1>{this.action}</h1>
            <a
              onClick={() => { openExternal(`https://discord.bots.gg/bots/${this.props.author.id}`) }}
            >
              View on website
            </a>
          </Text>
          <Text>
          </Text>
        </Modal.Header>
        <Modal.Content>
          <TextInput
            title="Mute Reason"
            placeholder="Spamming in chat"
            hideBorder={true}
            value={this.state.reason}
            onChange={(value) => { this.setState({ reason: value }) }}
          >
            {this.actionType} reason
          </TextInput>

          {this.defaultButtons}
          <Text
            style={{
              textAlign: 'center',
              marginBottom: "5px"
            }}
            color={Text.Colors.ERROR}
          >
            {this.state.error || '\u00A0'}
          </Text>
        </Modal.Content>
        <Modal.Footer>
          <Button color={Button.Colors.RED} onClick={async () => {
            if (this.state.reason) {
              let cmd = getSetting(commandKey, config.settings.defaultValues.chatSettings[action])
              cmd = config.commandParser(cmd, { author, channel, reason: this.state.reason })
              sendMessage(channel.id, {
                content: cmd
              }).catch(console.error)
              closeModal()
            } else {
              this.setState({ error: "You need to specify a reason!" })
            }
          }}>{this.action}</Button>
          <Button style={this.buttonStyle} onClick={() => closeModal()}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}