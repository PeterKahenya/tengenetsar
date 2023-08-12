var paybill_no=749320
var base_url="https://tengenetsar.kipya-africa.com"
// var base_url="http://127.0.0.1:8000"


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


export {paybill_no,base_url,firebaseConfig,iceConfig}