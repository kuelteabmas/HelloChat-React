import React from 'react'

class SendMessageForm extends React.Component {
    constructor() {
        super()
        
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            message: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.sendMessage(this.state.message)    
        
        // Clear text input field
        this.setState({
            message: ''
        })
    }

    render() {
        return (
            <form 
                onSubmit={this.handleSubmit}
                className="send-message-form">
                    <input
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                        placeholder="Type your message here and press Enter"
                        type="text"
                        value={this.state.message} />
            </form>
        )
    }
}

export default SendMessageForm