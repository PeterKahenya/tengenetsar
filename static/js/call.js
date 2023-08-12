var iceConfig = {
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
var callID = document.getElementById('room').value;
var utype = document.getElementById('utype').value;
var peerConnection;
var sessionNumber;
var localVideo = document.getElementById('localVideo')
var remoteVideo = document.getElementById('remoteVideo')
var send_chat_btn = document.getElementById('send_chat_btn')
var send_cart_btn = document.getElementById('send_cart_btn')

var my_chat_text_area = document.getElementById('chat_text_area')
var chat_logs = document.getElementById('chat_logs')

var awaitingCallContainer = document.getElementById('awaitingCallContainer')

var logsPanel = document.getElementById('callDetailsContainer')
var cameraOrientation = "user"
var flipCameraButton = document.getElementById("flip_camera_btn")
var mic_off_btn = document.getElementById('mic_off_btn')
var videocam_off_btn = document.getElementById('videocam_off_btn')
var hangup_btn = document.getElementById('hangup_btn')



async function prepare() {
	console.log("prepare function called")
	const db = window.firebase.firestore();
	roomRef = await db.collection('rooms').doc(callID);
	console.log("got room wit ID ",roomRef.id)
	if (utype==="caller") {
		console.log("This is the Caller ",utype)

		sessionNumber = Math.floor((Math.random() * 100000000000000) + 1);
		console.log("Session Number ",sessionNumber)

		await roomRef.update({callerSessionNumber:sessionNumber})
		console.log("Session Number Uploaded ",sessionNumber)

		roomRef.onSnapshot(async snapshot => {
			const data = snapshot.data();
			if (data.callee_is_ready && data.calleeSessionNumber === sessionNumber) {
				console.log("New Client Connected ",data)

				localStream.getTracks().forEach(track => {
					peerConnection.addTrack(track, localStream);
				});

			}
		});

	}else{
		sessionNumber = (await roomRef.get()).data().callerSessionNumber

		roomRef.onSnapshot(async snapshot => {
	      // const data = snapshot.data();
	  });

	}



	roomRef.collection("messages").onSnapshot(snapshot => {
		snapshot.docChanges().forEach(async change => {
			if (change.type === 'added') {
				let message = change.doc.data();
				switch (message.type) {
					case 'answer':
						if (message.sessionNumber === sessionNumber && message.from!=utype) {
							handleGotAnswer(message)
						}
					break;

					case 'offer':
						if (message.sessionNumber === sessionNumber && message.from!=utype) {
							handleGotOffer(message)
						}
					break;

					case 'iceCandidate':
						if (message.sessionNumber === sessionNumber && message.from!=utype) {
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


  localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
  localVideo.srcObject = localStream
  localVideo.muted=true

  flipCameraButton.onclick = handleOnFlipCamera
  mic_off_btn.onclick = handleOnMute
  videocam_off_btn.onclick = handleCameraToggle
  hangup_btn.onclick = handleOnHangUp



  if (utype==="caller") {


	
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

function handleOnHangUp(event){
	  window.location.href="/shop"
}

function handleOnMute(event){

	  if (localStream.getAudioTracks()[0].enabled) {
        localStream.getAudioTracks()[0].enabled = false
        mic_off_btn.classList.replace("btn-outline-light", "btn-danger")
        mic_off_btn.classList.add("bg-danger")
        mic_off_btn.innerText = "mic_off"
      } else {
        localStream.getAudioTracks()[0].enabled = true
        mic_off_btn.classList.replace("btn-danger", "btn-outline-light")
        mic_off_btn.classList.remove("bg-danger")
        mic_off_btn.innerText = "mic"
      }


}


function handleCameraToggle(event){
	if (localStream.getVideoTracks()[0].enabled) {
        localStream.getVideoTracks()[0].enabled = false
        videocam_off_btn.classList.replace("btn-outline-light", "btn-danger")
        videocam_off_btn.classList.add("btn-danger")
        videocam_off_btn.innerText = "videocam_off"
      } else {
        localStream.getVideoTracks()[0].enabled = true
        videocam_off_btn.classList.replace("btn-danger", "btn-outline-light")
        videocam_off_btn.classList.remove("btn-danger")

        videocam_off_btn.innerText = "videocam"
      }
}


async function handleOnFlipCamera(event){
	cameraOrientation = cameraOrientation==="user"?"environment":"user";
	localStream.getTracks().forEach(track => track.stop());
	localStream = await navigator.mediaDevices.getUserMedia({ video: {facingMode:cameraOrientation}, audio: true });
	localVideo.srcObject = localStream
	localVideo.muted=true

	let videoTrack = localStream.getVideoTracks()[0];
	video_sender=peerConnection.getSenders().find(function(s) {
		return s.track.kind == videoTrack.kind;
	});
	video_sender.replaceTrack(videoTrack);

}

function log(message) {
	// logsPanel.innerHTML = JSON.stringify(message)
	console.log(message)
}



function orderReceived(order_items){
	var basket = document.createElement("div")
	console.log(order_items)

	order_items.map(oi=>{
		var order_item_holder = document.createElement("div")

		var product_name = document.createElement("div")
		product_name.innerHTML=oi.product.name

		var add_to_cart_button = document.createElement("add_to_cart_button")
		add_to_cart_button.className ="btn btn-warning"
		add_to_cart_button.innerHTML="Add To Cart"

		add_to_cart_button.onclick=(e)=>{
				updateCartCookie(oi)
				add_to_cart_button.innerHTML="In Cart"
		}




		order_item_holder.appendChild(product_name)
		order_item_holder.appendChild(add_to_cart_button)

		basket.appendChild(order_item_holder)		

	})

	return basket
}



function setupChating() {
	console.log("setting up chatting")
  send_chat_btn.onclick=async (e)=>{
    chat_message=my_chat_text_area.value
    if (chat_message==="") {return;}

    await roomRef.collection("chats").add({
    	message_type:"chat",
      	from:utype,
      	chatMessage:chat_message,
      	timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      my_chat_text_area.value = ""
  }

  send_cart_btn.onclick=async (e)=>{
  	console.log("send_cart_btn clicked ",e)
  	if(JSON.parse(getCookie("cart")).order_items.length===0){return;}
  	await roomRef.collection("chats").add({
  		message_type:'cart',
      	from:utype,
      	chatMessage:getCookie("cart"),
      	timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })

  	console.log("cart send ",e)


  }
  
  roomRef.collection("chats").onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'added') {
        	var actualMessage=change.doc.data()
			var other_chat_node = document.createElement("div")
			console.log(actualMessage)
        	if (actualMessage.message_type==="cart") {
        		console.log("New Basket Sent")
        		cart = JSON.parse(actualMessage.chatMessage)
        		console.log("Cart ",cart)
        		let basket=orderReceived(cart.order_items)
        		other_chat_node.appendChild(basket)
        		console.log("basket",basket)
        		

        	} else {
		        var chat = document.createElement("div")
		        chat.innerHTML=parse_chat(actualMessage.chatMessage)
				other_chat_node.appendChild(chat)
        	}
        	if (actualMessage.from===utype) {
		        	other_chat_node.className = "my_chat shadow-sm"
		        }else{
					other_chat_node.className = "other_chat shadow-sm"
			}
			chat_logs.appendChild(other_chat_node)
        	chat_logs.scrollTop = chat_logs.scrollHeight + 50
      }
    })
  });
}


function parse_chat(my_message) {
//   console.log(my_message)
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return my_message.replace(urlRegex, '<a target="_blank" href="$1">$1</a>')
}


var getOrCreateCookieCart=()=>{
    let cart = null

    if (!getCookie("cart")) { cart = { order_items: [] }} 
    else {cart = JSON.parse(getCookie("cart"))}
    document.cookie = "cart=" + JSON.stringify(cart) + ";domain;path=/"

    return cart
}


var updateCartCookie=(data) =>{
    let cart = getOrCreateCookieCart()
    let order_item_index=cart.order_items.findIndex(order_item=>{return order_item.product.id===data.product.id})
    if (order_item_index===-1) {
        cart.order_items.push({
            product:data.product,
            quantity:data.quantity
        })
    }else{
        if (data.quantity===0) {cart.order_items.splice(order_item_index,1)} 
        else {cart.order_items[order_item_index].quantity=data.quantity}
    }

    document.cookie = "cart=" + JSON.stringify(cart) + ";domain;path=/"

    return cart
}


function getCookie(name){
    var cookieArray = document.cookie.split(";");

    for (let index = 0; index < cookieArray.length; index++) {
        const cookiePair = cookieArray[index].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


prepare()



