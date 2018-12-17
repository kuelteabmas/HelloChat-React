import React from 'react'

class SendMessageForm extends React.Component {
    render() {
        return (
            <form className="send-message-form">
                <input
                    placeholder="Type your message here and press Enter"
                    type="text" />
            </form>
        )
    }
}

export default SendMessageForm