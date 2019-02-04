import React from 'react'
import MessageList from '../src/components/MessageList'
import SendMessageForm from '../src/components/SendMessageForm'
import RoomList from '../src/components/RoomList'
import NewRoomForm from '../src/components/NewRoomForm'

import { tokenUrl, instanceLocator, userId, roomId } from './config'
import { ChatManager, TokenProvider} from '@pusher/chatkit-client'


class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            joinedRooms: [],
            joinableRooms: [],
            roomId: null
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.getRooms = this.getRooms.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
    }
    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator,
            userId,
            tokenProvider: new TokenProvider({
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
            console.log('Successful connection with user', currentUser)
            this.currentUser = currentUser
            this.getRooms()
            this.subscribeToRoom()
        })
        .catch(error => {
            console.log('Error on connection', error)
        })

    }

    // Subscribe To A Room method: When user clicks on a room, it is automatically joined to that room
    subscribeToRoom(roomId) {
        // Clear message list before joining a room
        this.setState({
            messages: []
        }) 
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    console.log(`Received new message: ${message.text}`)
                    this.setState({
                        messages: [...this.state.messages, message]
                    })     
                    
                }
            }
        })
        // add selected joinableRoom to joinedRoom list
        .then(room => {
            this.getRooms()
            this.setState({
                roomId: room.id
            })
        })
        .catch(error => console.log("Error on subscribing to room: ", error))
    }

    // Joinable Room Method
    getRooms() {
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
            .catch(error => console.log('Error on joinableRooms: ', error))
        })
    }

    // Send Message method
    sendMessage(text) {
       this.currentUser.sendMessage({
           text,
           roomId: this.state.roomId
       })
    }

    render() {

        return (
            <div className="app">
                <RoomList 
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}

export default App