let peerConnection = null;
let localStream = null;
let remoteStream = null;
var my_video = document.getElementById('my_video')
var other_video = document.getElementById('other_video');
var send_chat_btn = document.getElementById('send_chat_btn')
var my_chat_text_area = document.getElementById('my_chat_text_area')
var chat_logs = document.getElementById('chat_logs')
var mic_off_btn = document.getElementById('mic_off_btn')
var videocam_off_btn = document.getElementById('videocam_off_btn')
var flip_camera_btn = document.getElementById('flip_camera_btn')
var hangup_btn = document.getElementById('hangup_btn')
var user = document.getElementById('user').value;
let roomId = null;
let mode="environment"
var expert_id = document.getElementById('expert_id').value;
var caller_id = document.getElementById('caller_id').value;
var start_call_page = document.getElementById('start_call_page')
var live_calling_page = document.getElementById('live_calling_page')




const configuration = {
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




async function init() {
  if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected.');
  firebase.initializeApp(firebaseConfig);
  if (user==="caller") {
    localStream = await navigator.mediaDevices.getUserMedia({video: { facingMode:"environment" }, audio: true});
  }else{
    localStream = await navigator.mediaDevices.getUserMedia({video: { facingMode:"user" }, audio: true});
  }
  my_video.srcObject = localStream;
  remoteStream = new MediaStream();
  other_video.srcObject = remoteStream;
  if (user==="caller") {
    await createRoom()
    start_call_page.style.display="none"
    live_calling_page.style.display="flex"
  } else {
    roomId = document.getElementById('room_id').value;
    await joinRoom(roomId)
    lock_this_fundi(false)
  }

  my_video.onclick=(e)=>{
    other_stream=other_video.srcObject
    other_video.srcObject = my_video.srcObject
    my_video.srcObject = other_stream
  }
  
  mic_off_btn.onclick = (e) => {
    if (localStream.getAudioTracks()[0].enabled) {
      localStream.getAudioTracks()[0].enabled = false
      mic_off_btn.classList.replace("btn-outline-light", "btn-danger")
      mic_off_btn.innerText = "mic_off"
    } else {
      localStream.getAudioTracks()[0].enabled = true
      mic_off_btn.classList.replace("btn-danger", "btn-outline-light")
      mic_off_btn.innerText = "mic"
    }
  }

  videocam_off_btn.onclick = (e) => {
    if (localStream.getVideoTracks()[0].enabled) {
      localStream.getVideoTracks()[0].enabled = false
      videocam_off_btn.classList.replace("btn-outline-light", "btn-danger")
      videocam_off_btn.innerText = "videocam_off"
    } else {
      localStream.getVideoTracks()[0].enabled = true
      videocam_off_btn.classList.replace("btn-danger", "btn-outline-light")
      videocam_off_btn.innerText = "videocam"
    }
  }

  hangup_btn.onclick=(e)=>{
    hangUp(e)
  }

  flip_camera_btn.onclick=(e)=>{
    localStream.getTracks().forEach(track => track.stop());
    var new_mode = mode === "user"?"environment":"user"
    navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode:new_mode  } },
        function (stream) {
        my_video.srcObject = stream
        localStream = stream;
        let videoTrack = stream.getVideoTracks()[0];
        video_sender=peerConnection.getSenders().find(function(s) {
          return s.track.kind == videoTrack.kind;
        });
        video_sender.replaceTrack(videoTrack);
        mode=new_mode
      },
      function (err) {
        alert('Failed to get local stream'+Object.toString(err.message));
      })
  }

  loadMessages(roomId)
}


function lock_this_fundi(status) {
  console.log("Locking this Fundi")
  axios.post('/expert/lock', {
    "expert_id": my_peer_id,
    'status':status
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}




function sendRoom(roomId) {
  axios.post('/calls/sendroom', {
    expert_id: expert_id,
    room_id: roomId,
    call_id:call_id,
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

function save_chat(text,sender_id) {
  console.log("Saving Chat")
  axios.post('/calls/chats/add', {
    "sender_id": sender_id,
    'text':text,
    'call_id':call_id
  })
  .then(function (response) {
    console.log(JSON.stringify(response));
  })
  .catch(function (error) {
    console.warn(JSON.stringify(error));
  });
}

async function createRoom() {
  const db = firebase.firestore();
  const roomRef = await db.collection('rooms').doc();
  peerConnection = new RTCPeerConnection(configuration);
  registerPeerConnectionListeners();
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });
  const callerCandidatesCollection = roomRef.collection('callerCandidates');
  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {return}
    callerCandidatesCollection.add(event.candidate.toJSON());
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const roomWithOffer = {'offer': {type: offer.type,sdp: offer.sdp}};
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  sendRoom(roomId)
  peerConnection.addEventListener('track', event => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  });

  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });

  roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

}

function parse_chat(my_message) {
  console.log(my_message)
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return my_message.replace(urlRegex, '<a target="_blank" href="$1">$1</a>')
}



async function joinRoom(roomId) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRef.get();

  if (roomSnapshot.exists) {
      peerConnection = new RTCPeerConnection(configuration);
      registerPeerConnectionListeners();
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          return;
        }
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });

      peerConnection.addEventListener('track', event => {
        event.streams[0].getTracks().forEach(track => {
          remoteStream.addTrack(track);
        });
      });

      const offer = roomSnapshot.data().offer;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await roomRef.update(roomWithAnswer);
      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });    
    }
}


async function hangUp(e) {
  var tracks=my_video.srcObject.getTracks();
  tracks.forEach(track => {track.stop()});

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  my_video.srcObject = null;
  other_video.srcObject = null;
  

  // Delete room on hangup
  if (roomId) {
    const db = firebase.firestore();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }
  if (user==="caller") {
    document.location.href="/caller/";
  }else{
    document.location.href="/expert/";
  }
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

init().then(function (err) {
  console.log("Error: ",err)
});

function loadMessages(room) {
  const db = firebase.firestore();
  const roomRef = db.collection('rooms').doc(`${room}`);

  send_chat_btn.onclick=(e)=>{
    chat_message=my_chat_text_area.value
    if (chat_message==="") {return;}
    roomRef.collection("messages").add({
      from:user==="caller"?"caller":"expert",
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
  
  roomRef.collection("messages").onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        var actualMessage=change.doc.data()
        alert(JSON.stringify(actualMessage))
        var other_chat_node = document.createElement("div")
        other_chat_node.className = "other_chat"
        var chat = document.createElement("div")
        chat.innerHTML=parse_chat(actualMessage.chatMessage)
        other_chat_node.appendChild(chat)
        chat_logs.appendChild(other_chat_node)
        chat_logs.scrollTop = chat_logs.scrollHeight + 30
      }
    })
  });
}