import React, { Component } from 'react';
import "./CallingScreen.css"
const config=require("./config")


class CallingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.peerConnection = null
        this.localStream = null
        this.cameraOrientation = "user"
        this.localVideo = React.createRef();
        this.remoteVideo = React.createRef();

        this.prepareSignaling = this.prepareSignaling.bind(this)
        this.handleGotOffer = this.handleGotOffer.bind(this)
        this.handleGotAnswer = this.handleGotAnswer.bind(this)
        this.handleGotRemoteICECandidate = this.handleGotRemoteICECandidate.bind(this)


        this.roomRef=null
        this.callID = "mggW8krNxmM0UyYLVOLj"
        this.utype = this.props.utype
        this.sessionNumber=null

    }

    handleOnAddStream(event) {
        console.log("handleOnAddStream", event)
    }

    handleOnConnectionStateChange(event) {
        console.log("handleOnConnectionStateChange", event)
    }

    handleOnDataChannel(event) {
        console.log("handleOnDataChannel", event)
    }

    async handleOnICECandidate(event) {
        try {
            if (event.candidate) {
        console.log("handleOnICECandidate",event.candidate.toJSON())
                this.roomRef.collection("messages").add({type:'iceCandidate',from:this.utype,'candidate':event.candidate.toJSON(),sessionNumber:this.sessionNumber});
            }
            } catch (error) {
            console.warn(error)
        }
    }

    async handleGotRemoteICECandidate(iceCandidate) {
        try {
            var candidate = new RTCIceCandidate(iceCandidate.candidate);
            console.log("handleGotRemoteICECandidate ",candidate)

            await this.peerConnection.addIceCandidate(candidate)
        } catch(err) { 
            console.warn(err)
        }
    }

    handleOnICEConnectionStateChange(event) {
        console.log("handleOnICEConnectionStateChange", event)
    }

    handleOnICEGatheringStateChange(event) {
        console.log("handleOnICEGatheringStateChange", event)
    }

    handleOnIdentityResult(event) {
        console.log("handleOnIdentityResult", event)
    }

    handleOnIDPassertionError(event) {
        console.log("handleOnIDPassertionError", event)
    }

    handleOnIDPValidationError(event) {
        console.log("handleOnIDPValidationError", event)
    }

    async handleOnNegotiationNeeded(event) {
        if (this.utype==="caller") {
            const offer = await this.peerConnection.createOffer();
            if (this.peerConnection.signalingState != "stable") {
                console.log("The connection isn't stable yet; postponing.")
                return;
            }
            await this.peerConnection.setLocalDescription(offer)
            const roomWithOffer = {'offer': {type: offer.type,sdp: offer.sdp},from:this.utype,type:'offer',sessionNumber:this.sessionNumber};
            // await this.roomRef.collection("messages").add(roomWithOffer)
            
        }else{}
    }

    handleOnPeerIdentity(event) {
        console.log("handleOnPeerIdentity", event)
    }

    handleOnRemoveStream(event) {
        console.log("handleOnRemoveStream", event)
    }

    handleOnSignalingStateChange(event) {
        console.log("handleOnSignalingStateChange", event)
    }

    handleOnTrack(event) {
        console.log("handleOnTrack", event)
        this.remoteVideo.srcObject = event.streams[0];
        console.log("go away")
    }

    async componentDidMount() {
        await this.prepareSignaling()
        this.peerConnection = new RTCPeerConnection(config.iceConfig);
        this.peerConnection.onaddstream = this.handleOnAddStream.bind(this)
        this.peerConnection.onconnectionstatechange = this.handleOnConnectionStateChange.bind(this)
        this.peerConnection.ondatachannel = this.handleOnDataChannel.bind(this)
        this.peerConnection.onicecandidate = this.handleOnICECandidate.bind(this)
        this.peerConnection.oniceconnectionstatechange = this.handleOnICEConnectionStateChange.bind(this)
        this.peerConnection.onicegatheringstatechange = this.handleOnICEGatheringStateChange.bind(this)
        this.peerConnection.onidentityresult = this.handleOnIdentityResult.bind(this)
        this.peerConnection.onidpassertionerror = this.handleOnIDPassertionError.bind(this)
        this.peerConnection.onidpvalidationerror = this.handleOnIDPValidationError.bind(this)
        this.peerConnection.onnegotiationneeded = this.handleOnNegotiationNeeded.bind(this)
        this.peerConnection.onpeeridentity = this.handleOnPeerIdentity.bind(this)
        this.peerConnection.onremovestream = this.handleOnRemoveStream.bind(this)
        this.peerConnection.onsignalingstatechange = this.handleOnSignalingStateChange.bind(this)
        this.peerConnection.ontrack = this.handleOnTrack.bind(this)

        this.localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: this.cameraOrientation }, audio: true });
        this.localVideo.current.srcObject = this.localStream

        if (this.utype==="callee") {
            this.roomRef.update({
                callee_is_ready:true,
                updated:window.firebase.firestore.FieldValue.serverTimestamp(),
                calleeSessionNumber:this.sessionNumber
            })
        }else{
            //Send the call request using FCM
        }

    }
    componentDidCatch() {
        console.log("componentDidCatch")
    }
    componentDidUpdate() {
        console.log("componentDidUpdate")
    }
    componentWillMount() {
        console.log("componentWillMount")
    }
    componentWillReceiveProps() {
        console.log("componentWillReceiveProps")
    }
    componentWillUnmount() {
        alert("componentWillUnmount")
    }
    componentWillUpdate() {
        console.log("componentWillUpdate")
    }

    render() {
        return (<div>
                    <video ref={this.remoteVideo} autoPlay playsInline id="remoteVideo"></video>
                    <video ref={this.localVideo} autoPlay playsInline id="localVideo"></video>
                </div>
                );
    }





    async prepareSignaling() {
        console.log(config.firebaseConfig)
        if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected.')
        window.firebase.initializeApp(config.firebaseConfig);

        const db = window.firebase.firestore();
        this.roomRef = await db.collection('rooms').doc(this.callID);

        if (this.utype === "caller") {
            this.sessionNumber = Math.floor((Math.random() * 100000000000000) + 1);
            await this.roomRef.update({ callerSessionNumber: this.sessionNumber })
            this.roomRef.onSnapshot(async snapshot => {
                const data = snapshot.data();
                if (data.callee_is_ready && data.calleeSessionNumber === this.sessionNumber) {
                    this.localStream.getTracks().forEach(track => {
                        this.peerConnection.addTrack(track, this.localStream);
                    });
                }
            });

        } else {
            this.sessionNumber = (await this.roomRef.get()).data().callerSessionNumber
            this.roomRef.onSnapshot(async snapshot => {});
        }

        this.roomRef.collection("messages").onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let message = change.doc.data();
                    switch (message.type) {
                        case 'answer':
                            if (message.sessionNumber === this.sessionNumber && message.from != this.utype) {
                                this.handleGotAnswer(message)
                            }
                            break;

                        case 'offer':
                            if (message.sessionNumber === this.sessionNumber && message.from != this.utype) {
                                this.handleGotOffer(message)
                            }
                            break;

                        case 'iceCandidate':
                            if (message.sessionNumber === this.sessionNumber && message.from != this.utype) {
                                this.handleGotRemoteICECandidate(message)
                            }
                            break;

                        default:
                            break;
                    }
                }
            })
        })
    }


    async handleGotOffer(offer) {
        await this.peerConnection.setRemoteDescription(offer.offer);
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
        const answer = await this.eerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(answer)
        const roomWithAnswer = {'answer': {type: answer.type,sdp: answer.sdp},from:this.utype,type:'answer',sessionNumber:this.sessionNumber};
        await this.roomRef.collection("messages").add(roomWithAnswer)
    }


    async handleGotAnswer(answer) {
        await this.peerConnection.setRemoteDescription(answer.answer)
    }


    











}

export default CallingScreen;