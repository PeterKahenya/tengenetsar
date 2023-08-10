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
    ]
  },
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
var sessionNumber = Math.floor((Math.random() * 100000000000000000000000000000000) + 1);
var localVideo = document.getElementById('localVideo')
var cameraOrientation = "user"
var flipCameraButton = document.getElementById("flip_camera_btn")
flipCameraButton.onclick = handleOnFlipCamera



async function prepare() {
  if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected.')
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  roomRef = await db.collection('rooms').doc(callID);
  await roomRef.update({callerSessionNumber:sessionNumber})

  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (data.callee_is_ready && data.calleeSessionNumber === sessionNumber) {

      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

    }
  });



  roomRef.collection("messages").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
            let message = change.doc.data();
            switch (message.type) {
                case 'answer':
                      if (message.sessionNumber === sessionNumber) {
                        handleGotAnswer(message)
                      }
                    break;
                
                case 'iceCandidate':
                      if (message.sessionNumber === sessionNumber && message.from==='callee') {
                        handleGotRemoteICECandidate(message)
                      }
                    break;
            
                default:
                    break;
            }
        }
    })
  })



  



  //Create Peer Connection and set the event listeners
  peerConnection = new RTCPeerConnection(configuration);
  peerConnection.onaddstream = handleOnAddStream
  peerConnection.onconnectionstatechange = handleOnConnectionStateChange
  peerConnection.ondatachannel = handleOnDataChannel
  peerConnection.onicecandidate = handleOnICECandidate
  peerConnection.oniceconnectionstatechange = handleOnICEConnectionStateChange
  peerConnection.onicegatheringstatechange = handleOnICEGatheringStateChange
  peerConnection.onidentityresult = handleOnIdentityResult
  peerConnection.onidpassertionerror = handleOnIDPassertionError
  peerConnection.onidpvalidationerror = handleOnIDPValidationError
  peerConnection.onnegotiationneeded = handleOnNegotiationNeeded
  peerConnection.onpeeridentity = handleOnPeerIdentity
  peerConnection.onremovestream = handleOnRemoveStream
  peerConnection.onsignalingstatechange = handleOnSignalingStateChange
  peerConnection.ontrack = handleOnTrack


  //Get local stream
  localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
  localVideo.srcObject = localStream


  //Send the call request using FCM







}



function handleOnAddStream(event) {
  log("handleOnAddStream",event)
}


function handleOnConnectionStateChange(event) {
  log("handleOnConnectionStateChange",event)
}


function handleOnDataChannel(event) {
  log("handleOnDataChannel",event)
}


function handleOnICECandidate(event) {
  try {
    roomRef.collection("messages").add({type:'iceCandidate',from:'caller','candidate':event.candidate.toJSON(),sessionNumber:sessionNumber});
  } catch (error) {
    
  }
}


function handleOnICEConnectionStateChange(event) {
  log("handleOnICEConnectionStateChange",event)
}


function handleOnICEGatheringStateChange(event) {
  log("handleOnICEGatheringStateChange",event)
}


function handleOnIdentityResult(event) {
  log("handleOnIdentityResult",event)
}


function handleOnIDPassertionError(event) {
  log("handleOnIDPassertionError",event)
}


function handleOnIDPValidationError(event) {
  log("handleOnIDPValidationError",event)
}


async function handleOnNegotiationNeeded(event) {
  const offer = await peerConnection.createOffer();

  if (peerConnection.signalingState != "stable") {
    log("The connection isn't stable yet; postponing.")
    return;
  }

  await peerConnection.setLocalDescription(offer)
  const roomWithOffer = {'offer': {type: offer.type,sdp: offer.sdp},type:'offer',sessionNumber:sessionNumber};
  await roomRef.collection("messages").add(roomWithOffer)
  
}


function handleOnPeerIdentity(event) {
  log("handleOnPeerIdentity",event)
}


function handleOnRemoveStream(event) {
  log("handleOnRemoveStream",event)
}


function handleOnSignalingStateChange(event) {
  log("handleOnSignalingStateChange",event)
}


function handleOnTrack(event) {
  log("handleOnTrack",event)
  document.getElementById("remoteVideo").srcObject = event.streams[0];
}


async function handleGotAnswer(answer) {
  log("handleGotAnswer ",answer)

  await peerConnection.setRemoteDescription(answer.answer)


}


function handleGotOffer(offer) {

    log("handleGotOffer ",offer)
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
  log("handleGotRemoteICECandidate ",iceCandidate)

  var candidate = new RTCIceCandidate(iceCandidate.candidate);

  try {
    await peerConnection.addIceCandidate(candidate)
  } catch(err) {
    reportError(err);
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



