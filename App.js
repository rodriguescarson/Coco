import React, { Component } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { Dialogflow_V2 } from 'react-native-dialogflow'

import { dialogflowConfig } from './env'
const botAvatar = require('./assets/images/')

const BOT = {
  _id: 2,
  name: 'Mr.Bot',
  avatar: botAvatar
}

class App extends Component {

  state = {
    messages: [{
      _id: 1,
      text: 'Hi',
      createdAt: new Date(),
      user: BOT
    },
    {
      _id: 2,
      text: 'My name is Coco',
      createdAt: new Date(),
      user: BOT
    }
    ],
    id: 1,
    name: ''
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    )
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfilmentMessages[0]
    text.text[0]

    this.sendBotResponse(text)
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT
    }
    this.setState((previousState) => {
      messages: GiftedChat.append(previousState.messages, [msg])
    })
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
    console.log(message)
    let message = messages[0].text

    Dialogflow_V2.requestQuery(message, (result) => {
      message,
        (result) => this.handleGoogleResponse(result),
        (error) => console.log(error)
    })
  }

  onQuickReply(quickReply) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, quickReply)
    }))

    let message = quickReply[0].value

    Dialogflow_V2.requestQuery(message, (result) => {
      message,
        (result) => this.handleGoogleResponse(result),
        (error) => console.log(error)
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messageIdGenerator={this.state.message}

          onSend={(message) => {
            this.onSend(message)
          }}

          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          user={{ _id: 1 }}

        />
      </View>
    )
  }
}
export default App;