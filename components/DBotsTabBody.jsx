const { React } = require('powercord/webpack')
const { TextInput, Category } = require('powercord/components/settings')
const { Button, AdvancedScrollerThin } = require('powercord/components')
const { shell: { openExternal } } = require('electron')

module.exports = class DBotsTabBody extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      moderationCategoryOpen: false
    }
  }

  render() {
    return (
      <AdvancedScrollerThin style={{
        height: "inherit"
      }}>
        <div style={{
          padding: "10px",
          paddingTop: "15px"
        }}>
          <Category
            name="Moderation"
            description={`@${this.props.user.username}, please dont spam you are get ban`}
            opened={this.state.moderationCategoryOpen}
            onChange={() => { this.setState({ moderationCategoryOpen: !this.state.moderationCategoryOpen }) }}
          >
            <form onSubmit={(e) => { e.preventDefault() }}>
              <TextInput
                defaultValue=""
                placeholder="Enter a reason"
                onChange={() => { }}
              >Enter a reason to apply to the action performed</TextInput>
              <Button style={{ display: "inline-block", marginRight: "5px" }} color={Button.Colors.BLURPLE}>Mute</Button>
              <Button style={{ display: "inline-block", marginRight: "5px" }} color={Button.Colors.BLURPLE}>Bully</Button>
              <Button style={{ display: "inline-block", marginRight: "5px" }} color={Button.Colors.BLURPLE}>Supermute</Button>
              <Button style={{ display: "inline-block", marginRight: "5px" }} color={Button.Colors.RED}>Shitpostmute</Button>
              <Button style={{ display: "inline-block", marginRight: "5px", marginTop: "5px" }} color={Button.Colors.RED}>Delete</Button>
            </form>
          </Category>
          {this.props.data &&
            <Button
              color={Button.Colors.BLURPLE}
              onClick={() => { openExternal(`https://discord.bots.gg/bots/${this.props.id}`) }}
            >
              Open bot profile
          </Button>
          }
          {!this.props.data &&
            <Button
              color={Button.Colors.RED}
              onClick={() => { }}
            >
              Bot not on site
      </Button>
          }
        </div>
      </AdvancedScrollerThin>
    )
  }
}
