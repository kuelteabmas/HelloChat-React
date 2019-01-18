import React from 'react'
import MessageList from '../src/components/MessageList'
import SendMessageForm from '../src/components/SendMessageForm'
import RoomList from '../src/components/RoomList'
import NewRoomForm from '../src/components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'
import { ChatManager, TokenProvider} from '@pusher/chatkit-client'
// import { tokenUrl, instanceLocator, userId, roomId } from './config'
// import { TokenProvider, ChatManager } from '@pusher/chatkit-client'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: []
        }
        // this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount() {
        const chatManager = new ChatManager({
            // instanceLocator: 'v1:us1:b233b9b8-4fcc-4968-9683-4907a8cf705c',
            instanceLocator: instanceLocator,
            // key: '4103a0c6-5716-4449-a12f-600448df93af:SU/RXVYbAaR5KLXzRI9yj5XGmtiQtoS09CR1aoVRyCo=',
            userId: 'devP',
            tokenProvider: new TokenProvider({
                // url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/b233b9b8-4fcc-4968-9683-4907a8cf705c/token'
                url: tokenUrl
            }),
            // logger: {
            //     verbose: console.log,
            //     debug: console.log,
            //     info: console.log,
            //     warn: console.log,
            //     error: console.log
            //   }
        })

        chatManager.connect()
        .then(currentUser => {
            console.log('Successful connection', currentUser)
            this.currentUser = currentUser
            currentUser.subscribeToRoom({
                // roomId: 'General',
                roomId: '19528602',
                
                hooks: {
                    onNewMessage: message => {
                        console.log('message.text: ', message.text)
                        console.log(`Received new message ${message.text}`)
                        this.setState({
                            messages: [...this.state.messages, message]

                        })     
                        
                    }
                }
            })
        })
        .catch(err => {
            console.log('Error on connection', err)
        })
    }

    // sendMessage(text) {
    //    this.currentUser.sendMessage({
    //        text: text,
    //     //    roomId: 'General',
    //        roomId: '19528602'
    //    })
    // }

    render() {

        console.log('this.state.messages: ', this.state.messages)

        return (
            <div className="app">
                <RoomList />
                <MessageList messages={this.state.messages} />
                <SendMessageForm />
                <NewRoomForm />
            </div>
        );
    }
}

export default App