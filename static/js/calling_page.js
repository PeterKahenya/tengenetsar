var fundi_peer_id = document.getElementById('expert_id').value;
var my_peer_id = document.getElementById('caller_id').value;
var call_id = document.getElementById('call_id').value;

var my_video = document.getElementById('my_video')
var other_video = document.getElementById('other_video')
var send_chat_btn = document.getElementById('send_chat_btn')
var my_chat_text_area = document.getElementById('my_chat_text_area')
var start_call_button = document.getElementById('start_call_button')
var chat_logs = document.getElementById('chat_logs')
var mic_off_btn = document.getElementById('mic_off_btn')
var videocam_off_btn = document.getElementById('videocam_off_btn')
var flip_camera_btn = document.getElementById('flip_camera_btn')
var my_stream;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var logs_panel = document.getElementById('logs')
var devices_panel = document.getElementById('devices')
var peer;
var call;
var mode="user"



const DEFAULT_CONFIG = {
  iceServers: [{
      urls: "stun:stun.kipya-africa.com:5349"
    },
    {
      urls: "turn:turn.kipya-africa.com:5349",
      username: "kipyadev",
      credential: "Kipya2010$"
    }
  ],
  sdpSemantics: "unified-plan"
};


function parse_chat(chat_message) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return chat_message.replace(urlRegex, '<a target="_blank" href="$1">$1</a>')
}


function save_chat(text,sender_id) {
  console.log("Locking this Fundi")
  axios.post('/calls/chats/add', {
    "sender_id": sender_id,
    'text':text,
    'call_id':call_id
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


function prepare_flip() {
  flip_camera_btn.onclick=(e)=>{
    my_stream.getTracks().forEach(track => track.stop());
    var new_mode = mode === "user"?"environment":"user"
    getUserMedia({ audio: true, video: { facingMode:new_mode  } },
      function (stream) {

        my_video.srcObject = stream
        my_stream = stream;
        let videoTrack = stream.getVideoTracks()[0];
        video_sender=call.peerConnection.getSenders().find(function(s) {
          return s.track.kind == videoTrack.kind;
        });
        video_sender.replaceTrack(videoTrack);
        mode=new_mode
      },
      function (err) {
        chat_logs.append('Failed to get local stream'+err)
        alert('Failed to get local stream'+Object.toString(err.message));
      })
  }
}

function setup_call(peer_object) {
  console.log("setting up video call")
  logs_panel.innerHTML += "."
  getUserMedia({
    // video:{facingMode: {exact: "environment"}},
    video:true,
    audio: true
  }, function (stream) {

    my_video.srcObject = stream
    my_stream = stream;
    my_video.muted = true

    videocam_off_btn.onclick = (e) => {
      if (my_stream.getVideoTracks()[0].enabled) {
        my_stream.getVideoTracks()[0].enabled = false
        videocam_off_btn.classList.replace("btn-outline-light", "btn-danger")
        videocam_off_btn.innerText = "videocam_off"
      } else {
        my_stream.getVideoTracks()[0].enabled = true
        videocam_off_btn.classList.replace("btn-danger", "btn-outline-light")
        videocam_off_btn.innerText = "videocam"
      }
    }

    mic_off_btn.onclick = (e) => {
      if (my_stream.getAudioTracks()[0].enabled) {
        my_stream.getAudioTracks()[0].enabled = false
        mic_off_btn.classList.replace("btn-outline-light", "btn-danger")
        mic_off_btn.innerText = "mic_off"
      } else {
        my_stream.getAudioTracks()[0].enabled = true
        mic_off_btn.classList.replace("btn-danger", "btn-outline-light")
        mic_off_btn.innerText = "mic"
      }
    }

    call = peer_object.call(fundi_peer_id, stream);
    call.on('stream', function (remoteStream) {
      other_video.srcObject = remoteStream
      console.log("Got Local Stream ", remoteStream)
      document.getElementById('start_call_page').style.display = "none"
      document.getElementById('live_calling_page').style.display = "flex"
      my_video.onclick=(e)=>{
        other_stream=other_video.srcObject
        other_video.srcObject = my_video.srcObject
        my_video.srcObject = other_stream
      }
    });
    prepare_flip()
  }, function (err) {
    console.log('Failed to get local stream', err);
  });
}


start_call_button.onclick = (e) => {
    console.log("Connecting to Fundi...")
    logs_panel.innerHTML += "."

    peer = new Peer(my_peer_id, {
        host: 'signaling.kipya-africa.com',
        port: 9000,
        path: '/broker',
        secure: true,
        pingInterval: 500,
        config: DEFAULT_CONFIG
    });

    console.log("Peer Created...", peer)
    logs_panel.innerHTML += "."


    peer.on('error', function (err) {
        console.log("Error...", peer)
        logs_panel.innerHTML += "|"
    })

    peer.on('open', function (peer_id) {
        console.log("This peer has connected to PeerServer with id ", peer_id)
        logs_panel.innerHTML += "."


        var connection = peer.connect(fundi_peer_id, {reliable: true})
        connection.on('open', function () {
        console.log('Connection ready to send and receive data')
        logs_panel.innerHTML += "."

        connection.on('data', function (data) {
            save_chat(data,fundi_peer_id)
            var other_chat_node = document.createElement("div")
            other_chat_node.className = "other_chat"
            var chat = document.createElement("div")
            chat.innerHTML=parse_chat(data)
            other_chat_node.appendChild(chat)
            chat_logs.appendChild(other_chat_node)
            chat_logs.scrollTop = chat_logs.scrollHeight + 30
        })
        console.log('Data Receiver is Ready')
        logs_panel.innerHTML += "."


        send_chat_btn.onclick = function (e) {
            var my_chat_text_area_data = my_chat_text_area.value
            save_chat(my_chat_text_area_data,my_peer_id)

            connection.send(my_chat_text_area_data);
            var other_chat_node = document.createElement("div")
            other_chat_node.className = "my_chat"
            var chat = document.createElement("div")
            chat.innerHTML=parse_chat(my_chat_text_area_data)
            other_chat_node.appendChild(chat)
            chat_logs.appendChild(other_chat_node)
            chat_logs.scrollTop = chat_logs.scrollHeight;
            my_chat_text_area.value = ""
        }
        console.log('Data Sender is Ready')
        setup_call(peer)
        })
        
    })

}

