var my_peer_id = document.getElementById('expert_id').value
var caller_id;
var my_video=document.getElementById('my_video')
var other_video=document.getElementById('other_video')
var send_chat_btn=document.getElementById('send_chat_btn')
var my_chat_text_area=document.getElementById('my_chat_text_area')
var accept_call_btn=document.getElementById('accept_call_btn')
var mic_off_btn=document.getElementById('mic_off_btn')
var videocam_off_btn=document.getElementById('videocam_off_btn')
var flip_camera_btn=document.getElementById('flip_camera_btn')

var my_stream;
var chat_logs=document.getElementById('chat_logs')
var get_ready_btn=document.getElementById('get_ready_btn');
var peer;


function parse_chat(chat_message) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return chat_message.replace(urlRegex, '<a target="_blank" href="$1">$1</a>')
}

const DEFAULT_CONFIG = {
  iceServers: [
    { urls: "stun:stun.kipya-africa.com:5349" },
    { urls: "turn:turn.kipya-africa.com:5349", username: "kipyadev", credential: "Kipya2010$" }
  ],
  sdpSemantics: "unified-plan"
};

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

function accept_call(e){
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  getUserMedia({video: true, audio: true}, function(stream) {
    document.getElementById('standby_container').style.display="none"
    document.getElementById('row-holder').style.display="flex"

    lock_this_fundi(false)
    my_video.srcObject=stream;
    my_video.muted=true
    my_stream=stream;
    videocam_off_btn.onclick=(e)=>{
      if (stream.getVideoTracks()[0].enabled) {
        stream.getVideoTracks()[0].enabled=false
        videocam_off_btn.classList.replace("btn-outline-light","btn-danger")
        videocam_off_btn.innerText="videocam_off"
      } else {
        stream.getVideoTracks()[0].enabled=true
        videocam_off_btn.classList.replace("btn-danger","btn-outline-light")
        videocam_off_btn.innerText="videocam"
      }
    }
    
    mic_off_btn.onclick=(e)=>{
      if (stream.getAudioTracks()[0].enabled) {
        stream.getAudioTracks()[0].enabled=false
        mic_off_btn.classList.replace("btn-outline-light","btn-danger")
        mic_off_btn.innerText="mic_off"
      } else {
        stream.getAudioTracks()[0].enabled=true
        mic_off_btn.classList.replace("btn-danger","btn-outline-light")
        mic_off_btn.innerText="mic"
      }
    }

    console.log("Peer Connection ",peer.peerConnection)


    customer_call.answer(stream); // Answer the call with an A/V stream.
    customer_call.on('stream', function(remoteStream) {
      other_video.srcObject=remoteStream
      my_video.onclick=(e)=>{
        other_stream=other_video.srcObject
        other_video.srcObject = my_video.srcObject
        my_video.srcObject = other_stream
      }
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
}

function notify() {
    if (Notification.permission !== 'granted')
     Notification.requestPermission();
    else {
      const title = 'Tengenetsar Incoming Call';
      const options = {
        body: 'Tengenetsar Incoming Call',
        icon: '/static/images/icon.png',
        badge: '/static/images/badge.png'
      };
      swRegistration.showNotification(title, options);
  }
}

get_ready_btn.onclick=function (event) {
    console.log("Connection Started...")

    peer = new Peer(my_peer_id,{
      host:'signaling.kipya-africa.com',
      port:9000,
      path:'/broker',
      pingInterval:500,
      secure:true,
      config:DEFAULT_CONFIG
    });
    
    peer.on('open',function (peer_id){
        console.log("This peer has connected to PeerServer with id ",peer_id)
        lock_this_fundi(true)

      document.getElementById('fundi_home').style.display="none"
      document.getElementById('standby_container').style.display="flex"
      peer.on('connection',function (connection){
        console.log('New Peer Created data connection ',connection)
        dataconnection=connection;
        connection.on('open',function() {
          console.log('Connection ready to send and receive data')

          connection.on('data',function(data) {
            var other_chat_node=document.createElement("div")
            other_chat_node.className="other_chat"
            var chat = document.createElement("div")
            chat.innerHTML=parse_chat(data)
            other_chat_node.appendChild(chat)
            chat_logs.appendChild(other_chat_node)
            chat_logs.scrollTop = chat_logs.scrollHeight;
          })

          send_chat_btn.onclick=function(e){
            var my_chat_text_area_data=my_chat_text_area.value
            connection.send(my_chat_text_area_data);
            var other_chat_node=document.createElement("div")
            other_chat_node.className="my_chat"
            var chat = document.createElement("div")
            chat.innerHTML=parse_chat(my_chat_text_area_data)
            other_chat_node.appendChild(chat)
            chat_logs.appendChild(other_chat_node)
            chat_logs.scrollTop = chat_logs.scrollHeight
            my_chat_text_area.value=""
          }

        })
      })

    accept_call_btn.onclick=(e)=>{
      accept_call(e)
    }
  })
  peer.on('call', function(call) {
    console.log("received call")
    customer_call=call
    document.getElementById('standby_mode').style.display="none"
    document.getElementById('incoming_call_mode').style.display="flex"
    document.getElementById('standby_container').style.background="linear-gradient(to top right,#15ad43,#00b050)";

    notify()
  });
}
