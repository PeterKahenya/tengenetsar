var my_peer_id = document.getElementById('fundi_id').value
var caller_id;
var my_video=document.getElementById('my_video')
var other_video=document.getElementById('other_video')
var send_chat_btn=document.getElementById('send_chat_btn')
var my_chat_text_area=document.getElementById('my_chat_text_area')
var accept_call_btn=document.getElementById('accept_call_btn')
var mic_off_btn=document.getElementById('mic_off_btn')
var videocam_off_btn=document.getElementById('videocam_off_btn')
var hangout_btn=document.getElementById('hangout_btn')
var my_stream;
var chat_logs=document.getElementById('chat_logs')
var get_ready_btn=document.getElementById('get_ready_btn')


const DEFAULT_CONFIG = {
  iceServers: [
    { urls: "stun:stun.kipya-africa.com:5349" },
    { urls: "turn:turn.kipya-africa.com:5349", username: "kipyadev", credential: "Kipya2010$" }
  ],
  sdpSemantics: "unified-plan"
};

function lock_this_fundi(status) {
  console.log("Locking this Fundi")
  axios.post('/fundi/lock', {
    "fundi_id": my_peer_id,
    'status':status
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}


var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
getUserMedia({video: true, audio: true}, function(stream) {

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

    customer_call.answer(stream); // Answer the call with an A/V stream.
    customer_call.on('stream', function(remoteStream) {
      other_video.srcObject=remoteStream
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });



dataconnection.on('data',function(data) {
  var other_chat_node=document.createElement("div")
  other_chat_node.className="other_chat"
  other_chat_node.appendChild(document.createTextNode(data))
  chat_logs.appendChild(other_chat_node)
  chat_logs.scrollTop = chat_logs.scrollHeight;
})

send_chat_btn.onclick=function(e){
  var my_chat_text_area_data=my_chat_text_area.value
  dataconnection.send(my_chat_text_area_data);
  var other_chat_node=document.createElement("div")
  other_chat_node.className="my_chat"
  other_chat_node.appendChild(document.createTextNode(my_chat_text_area_data))
  chat_logs.appendChild(other_chat_node)
  chat_logs.scrollTop = chat_logs.scrollHeight
  my_chat_text_area.value=""
}
  
hangout_btn.onclick=(e)=> {
  peer.disconnect()
  peer.destroy()
  dataconnection.close()
}