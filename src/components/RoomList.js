import React from 'react'

class RoomList extends React.Component {
    render() {

        // will sort different joined rooms
        const orderedRooms = [...this.props.rooms].sort((a,b) => a.id - b.id)

        console.log(orderedRooms)
        return (
            <div className="rooms-list">
                <div className="help-text">
                    <ul>
                        <h3>Your Rooms</h3>
                        {orderedRooms.map(room => {
                            const active = this.props.roomId === room.Id ? "active-room" : ""
                            return (
                                <li key={room.id} className={"room " + active}>
                                    <a
                                        onClick={() => this.props.subscribeToRoom(room.id)}
                                        href="#">
                                        
                                        # {room.name}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default RoomList