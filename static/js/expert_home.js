var incoming_call=document.getElementById('incoming_call')
var accept_call_btn=document.getElementById('accept_call_btn')


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
if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected.');
firebase.initializeApp(firebaseConfig);


const messaging=firebase.messaging()
messaging.requestPermission()
.then(function () {
    console.log("Have permission")
    return messaging.getToken()
}).then(function (token) {
    axios({
        method: 'POST',
        url: '/expert/addToken',
        data: {
          token: token,
        }
      }).then(function (response) {
        console.log(response.data)
      });;
}).catch(function (err) {
    console.log("Error Occurred",err)
})

messaging.onMessage(function (payload) {
  accept_call_btn.href="https://tengenetsar.kipya-africa.com/expert/call/"+payload.data.room_id
  incoming_call.style.display="block"
  alert("onMessage: "+JSON.stringify(payload))
})