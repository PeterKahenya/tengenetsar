var firebaseConfig = {
    apiKey: "AIzaSyB6dl19UhwSuJfZBVZFLqwpvEVYQnZI7dQ",
    authDomain: "tengenetsar.firebaseapp.com",
    databaseURL: "https://tengenetsar.firebaseio.com",
    projectId: "tengenetsar",
    storageBucket: "tengenetsar.appspot.com",
    messagingSenderId: "242190833367",
    appId: "1:242190833367:web:fbbb3383cf8755e06a4292",
    measurementId: "G-5LS6BV6K04"
};
  
var configuration = {
    iceServers: [{
        urls: [
          'stun:stun.kipya-africa.com:5349',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302'
        ]},
      {
        urls: "turn:turn.kipya-africa.com:5349",
        username: "kipyadev",
        credential: "Kipya2010$"
      }
    ],
    sdpSemantics: "unified-plan",
    iceCandidatePoolSize: 10,
};
  
var roomRef;
var localStream;
var callID = "mggW8krNxmM0UyYLVOLj";
var peerConnection;
var sessionNumber;
var localVideo = document.getElementById('localVideo')
var cameraOrientation = "user"

async function prepare() {
  
    if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected.')
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    roomRef = await db.collection('rooms').doc(callID);

    sessionNumber = (await roomRef.get()).data().callerSessionNumber

    roomRef.onSnapshot(async snapshot => {
      // const data = snapshot.data();
    });
  


    roomRef.collection("messages").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                let message = change.doc.data();
                switch (message.type) {
                    case 'offer':
                        if (message.sessionNumber === sessionNumber) {
                          handleGotOffer(message)
                        }
                        break;
                    
                    case 'iceCandidate':
                        if (message.sessionNumber === sessionNumber && message.from==='caller') {
                          handleGotRemoteICECandidate(message)
                        }
                        break;
                
                    default:
                        break;
                }
            }
        })
    })

  
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onaddstream = handleOnAddStream
    peerConnection.onconnectionstatechange  = handleOnConnectionStateChange
    peerConnection.ondatachannel = handleOnDataChannel
    peerConnection.onicecandidate = handleOnICECandidate
    peerConnection.oniceconnectionstatechange = handleOnICEConnectionStateChange
    peerConnection.onicegatheringstatechange  = handleOnICEGatheringStateChange
    peerConnection.onidentityresult = handleOnIdentityResult
    peerConnection.onidpassertionerror = handleOnIDPassertionError
    peerConnection.onidpvalidationerror = handleOnIDPValidationError
    peerConnection.onnegotiationneeded = handleOnNegotiationNeeded
    peerConnection.onpeeridentity = handleOnPeerIdentity
    peerConnection.onremovestream = handleOnRemoveStream
    peerConnection.onsignalingstatechange = handleOnSignalingStateChange
    peerConnection.ontrack=handleOnTrack
  
    
    roomRef.update({
        callee_is_ready:true,
        updated:firebase.firestore.FieldValue.serverTimestamp(),
        calleeSessionNumber:sessionNumber
    })

    localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
    localVideo.srcObject = localStream

  
}
  
  
  
function handleOnAddStream(event) {
  console.log("handleOnAddStream",event)
}


function handleOnConnectionStateChange(event) {
  console.log("handleOnConnectionStateChange, event:",event," peer connection status ",peerConnection.iceConnectionState)

  switch(peerConnection.iceConnectionState) {
    case "closed":
      console.log("iceconnection closed ")
    break;
    case "failed":
      console.log("iceconnection failed ")
    break;
    case "disconnected":
      console.log("iceconnection disconnected")
      break;
  }


}


function handleOnDataChannel(event) {
  console.log("handleOnDataChannel",event)
}


function handleOnICECandidate(event) {
  console.log("handleOnICECandidate")
  try {
    roomRef.collection("messages").add({type:'iceCandidate',from:'callee','candidate':event.candidate.toJSON(),sessionNumber:sessionNumber});
  } catch (error) {
    
  }
}


function handleOnICEConnectionStateChange(event) {
  console.log("ICEConnectionStateChange ",event," To Status ",peerConnection.iceGatheringState)
}


function handleOnICEGatheringStateChange(event) {
  console.log("handleOnICEGatheringStateChange",event)
}


function handleOnIdentityResult(event) {
  console.log("handleOnIdentityResult",event)
}


function handleOnIDPassertionError(event) {
  console.log("handleOnIDPassertionError",event)
}


function handleOnIDPValidationError(event) {
  console.log("handleOnIDPValidationError",event)
}


async function handleOnNegotiationNeeded(event) {
  console.log("handleOnNegotiationNeeded",event)
  // const offer = await peerConnection.createOffer();

  // if (peerConnection.signalingState != "stable") {
  //   console.log("     -- The connection isn't stable yet; postponing...")
  //   return;
  // }

  // await peerConnection.setLocalDescription(offer)

  // const roomWithOffer = {'offer': {type: offer.type,sdp: offer.sdp},type:'offer'};
  // await roomRef.collection("messages").add(roomWithOffer)
}


function handleOnPeerIdentity(event) {
  console.log("handleOnPeerIdentity",event)
}


function handleOnRemoveStream(event) {
  console.log("handleOnRemoveStream",event)
}


function handleOnSignalingStateChange(event) {
  console.log("handleOnSignalingStateChange",event)

  console.log("*** WebRTC signaling state changed to: " + peerConnection.signalingState);
  switch(peerConnection.signalingState) {
    case "closed":
      console.log("signaling state changed to closed")
      break;
  }


}


function handleOnTrack(event) {
  console.log("handleOnTrack",event)
  document.getElementById("remoteVideo").srcObject = event.streams[0];

}


function handleGotAnswer(answer) {
  console.log("handleGotAnswer ",answer)
}


async function handleGotOffer(offer) {
  await peerConnection.setRemoteDescription(offer.offer);
  
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)

  const roomWithAnswer = {'answer': {type: answer.type,sdp: answer.sdp},type:'answer',sessionNumber:sessionNumber};
  await roomRef.collection("messages").add(roomWithAnswer)
}


async function handleGotRemoteICECandidate(iceCandidate) {
  console.log("handleGotRemoteICECandidate ",iceCandidate)

  var candidate = new RTCIceCandidate(iceCandidate.candidate);

  try {
    await peerConnection.addIceCandidate(candidate)
  } catch(err) {
    console.warn(err);
  }
}


async function handleOnFlipCamera(event){
  cameraOrientation = cameraOrientation==="user"?"environment":"user";
  localStream.getTracks().forEach(track => track.stop());
  localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
  localVideo.srcObject = localStream

  let videoTrack = localStream.getVideoTracks()[0];
  video_sender=peerConnection.getSenders().find(function(s) {
      return s.track.kind == videoTrack.kind;
  });
  video_sender.replaceTrack(videoTrack);

}

  
prepare()
  
  
  
  