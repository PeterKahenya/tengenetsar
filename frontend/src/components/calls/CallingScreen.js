import React, { Component } from 'react';
import "./CallingScreen.css"


class CallingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = "/static/js/call.js"
        script.async = true
        document.body.appendChild(script)
        if (this.props.utype==="caller") {
            
        }
    }

    minimizeCall(){
        var call_screen = document.getElementById('call_screen')
        call_screen.style.display="none"
    }

    render() {
        console.log(this.props)
        return (<div className="bg-danger">
            <div className="mainCallContainer">
                    <input type="hidden" value={this.props.utype} id="utype" />
                    <input type="hidden" value={this.props.room} id="room" />
                    <div className="awaitingCallContainer" id="awaitingCallContainer">

                        {this.props.utype==="caller"?<h5>Calling...</h5>:<h5>Connecting...</h5>}
                        <a href="/shop" className="material-icons m-4 btn btn-danger bg-danger p-3 control-buttons">
                            call_end
                        </a>

                    </div>
                    <div className="callContainer"> 
                        <div className="videoPanel">
                            <div className="videoControls">

                                <div className="topControls">
                                    <button onClick={this.minimizeCall.bind(this)} style={{ float: 'left' }} className="material-icons btn btn-outline-light control-buttons">
                                        shopping_cart
                                    </button>
                                    <button id="flip_camera_btn" style={{ float: 'right' }} className="material-icons btn btn-outline-light control-buttons">
                                        flip_camera_android
        					        </button>
                                </div>

                                <div className="bottomControls">
                                    <button id="mic_off_btn" className="material-icons btn btn-outline-light control-buttons">
                                        mic
        					        </button>
                                    <button id="videocam_off_btn" className="material-icons btn btn-outline-light control-buttons">
                                        videocam
        					        </button>
                                    <button id="hangup_btn" className="material-icons bg-danger btn btn-outline-danger text-white control-buttons">
                                        call
        					        </button>
                                    <video style={{ display: 'block' }} autoPlay muted playsInline id="localVideo"></video>
                                </div>

                            </div>

                            <div className="mainVideo">
                                <video style={{ display: 'block' }} autoPlay playsInline id="remoteVideo"></video>
                            </div>
                        </div>
                        <div className="chatPanel">
                            <div className="chatProfile">

                            </div>
                            <div className="chatLogs" id="chat_logs">

                            </div>
                            <div className="chatBox">
                                <button className="material-icons m-1 bg-warning text-dark" id="send_cart_btn">
                                    add_shopping_cart
        				        </button>
                                <input autofocus id="chat_text_area" className="form-controls m-1 shadow-sm" placeholder="Enter message..." />
                                <button className="material-icons m-1" id="send_chat_btn">
                                    send
        				            </button>
                            </div>
                        </div>
                    </div>
        </div></div>);
    }
}

export default CallingScreen;