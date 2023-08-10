var roomRef;
var localStream;
var callID = document.getElementById('room').value;
var utype = document.getElementById('utype').value;

var peerConnection;
var sessionNumber;
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')
var send_chat_btn = document.getElementById('send_chat_btn')
var my_chat_text_area = document.getElementById('chat_text_area')
var chat_logs = document.getElementById('chat_logs')
var awaitingCallContainer = document.getElementById('awaitingCallContainer')

var logsPanel = document.getElementById('callDetailsContainer')
var cameraOrientation = "user"
var flipCameraButton = document.getElementById("flip_camera_btn")


async function prepare() {
	log("prepare")
	







  //Create Peer Connection and set the event listeners
  peerConnection = new RTCPeerConnection(iceConfig);
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



  if (utype==="callee") {
  	roomRef.update({
  		callee_is_ready:true,
  		updated:firebase.firestore.FieldValue.serverTimestamp(),
  		calleeSessionNumber:sessionNumber
  	})
  }

  //Get local stream
  localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
  localVideo.srcObject = localStream
  flipCameraButton.onclick = handleOnFlipCamera



  if (utype==="caller") {

  //Send the call request using FCM


	}

	setupChating()



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
		roomRef.collection("messages").add({type:'iceCandidate',from:utype,'candidate':event.candidate.toJSON(),sessionNumber:sessionNumber});
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

	if (utype==="caller") {

		const offer = await peerConnection.createOffer();
		if (peerConnection.signalingState != "stable") {
			log("The connection isn't stable yet; postponing.")
			return;
		}

		await peerConnection.setLocalDescription(offer)
		const roomWithOffer = {'offer': {type: offer.type,sdp: offer.sdp},from:utype,type:'offer',sessionNumber:sessionNumber};
		await roomRef.collection("messages").add(roomWithOffer)

	}else{



	}
	

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
	remoteVideo.srcObject = event.streams[0];
	console.log("go away")
	awaitingCallContainer.style.display="none"
}


async function handleGotAnswer(answer) {
	log("handleGotAnswer ",answer)
	console.log(utype,answer.from)
	await peerConnection.setRemoteDescription(answer.answer)
	console.log("go away")
	awaitingCallContainer.style.display="none"

}


async function handleGotOffer(offer) {

	log("handleGotOffer ",offer," from, ",offer.from)
    await peerConnection.setRemoteDescription(offer.offer);
  
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    const roomWithAnswer = {'answer': {type: answer.type,sdp: answer.sdp},from:utype,type:'answer',sessionNumber:sessionNumber};
    await roomRef.collection("messages").add(roomWithAnswer)

}


async function handleGotRemoteICECandidate(iceCandidate) {
	log("handleGotRemoteICECandidate ",iceCandidate)

	var candidate = new RTCIceCandidate(iceCandidate.candidate);

	try {
		await peerConnection.addIceCandidate(candidate)
	} catch(err) {
		log(err);
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

function log(message) {
	logsPanel.innerHTML = JSON.stringify(message)
}



function setupChating() {

  send_chat_btn.onclick=async (e)=>{
    // alert("send btn pressed")
    chat_message=my_chat_text_area.value
    if (chat_message==="") {return;}


    await roomRef.collection("chats").add({
      	from:utype,
      	chatMessage:chat_message,
      	timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })


      // save_chat(chat_message,user==="caller"?caller_id:expert_id)
      var other_chat_node = document.createElement("div")
      other_chat_node.className = "my_chat"
      var chat = document.createElement("div")
      chat.innerHTML=parse_chat(chat_message)
      other_chat_node.appendChild(chat)
      chat_logs.appendChild(other_chat_node)
      chat_logs.scrollTop = chat_logs.scrollHeight+30;
      my_chat_text_area.value = ""
  }
  
  roomRef.collection("chats").onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        var actualMessage=change.doc.data()
        // alert(JSON.stringify(actualMessage))
        var other_chat_node = document.createElement("div")
        other_chat_node.className = "other_chat"
        var chat = document.createElement("div")
        chat.innerHTML=parse_chat(actualMessage.chatMessage)
        if (actualMessage.from===utype) {
          // log(actualMessage)
        }else{
          other_chat_node.appendChild(chat)
          chat_logs.appendChild(other_chat_node)
        }
        chat_logs.scrollTop = chat_logs.scrollHeight + 30
      }
    })
  });
}


function parse_chat(my_message) {
  console.log(my_message)
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return my_message.replace(urlRegex, '<a target="_blank" href="$1">$1</a>')
}


prepare()



