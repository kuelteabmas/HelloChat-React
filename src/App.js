import React from 'react'
import MessageList from '../src/components/MessageList'
import SendMessageForm from '../src/components/SendMessageForm'
import RoomList from '../src/components/RoomList'
import NewRoomForm from '../src/components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

// import { tokenUrl, instanceLocator, userId, roomId } from './config'
import { TokenProvider, ChatManager } from '@pusher/chatkit-client'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        const chatKitManager = new ChatManager({
            instanceLocator,
            userId: 'devP',
            tokenProvider: new TokenProvider({
                url: tokenUrl
            })
        })

        chatKitManager.connect()
        .then(currentUser => {
            currentUser.subscribeToRoom({
                roomId: 19528602,
                hooks: {
                    onNewMessage: message => {
                        this.setState({
                            messages: [...this.state.messages, message]
                        })                        
                    }
                }
            })
        })
    }

    render() {
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