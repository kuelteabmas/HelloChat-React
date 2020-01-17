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
        this.createRoom = this.createRoom.bind(this)
    }
    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator,
            userId,
            tokenProvider: new TokenProvider({
                url: tokenUrl
            }),

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

    // Create Room method
    createRoom(name) {
        this.currentUser.createRoom({
            name
        })
        .then(room => this.subscribeToRoom(room.id))
        .catch(error => console.log('Error with createRoom: ', error))
    }
    render() {
        return (
            <div className="app">
                <RoomList 
                    roomId={this.state.roomId}
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList 
                    roomId={this.state.roomId}
                    messages={this.state.messages} />
                <SendMessageForm 
                    disabled={!this.state.roomId}
                    sendMessage={this.sendMessage} />
                <NewRoomForm createRoom={this.createRoom} />
            </div>
        );
    }
}

export default App