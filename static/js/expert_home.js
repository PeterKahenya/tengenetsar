var incoming_call=document.getElementById('incoming_call')
var accept_call_btn=document.getElementById('accept_call_btn')


const firebaseConfig = {
  apiKey: "AIzaSyDWA6iiUK1IPcKU5-p0iEhNBGLf358Xco8",
  authDomain: "tengenetsar-487c1.firebaseapp.com",
  projectId: "tengenetsar-487c1",
  storageBucket: "tengenetsar-487c1.appspot.com",
  messagingSenderId: "901165180362",
  appId: "1:901165180362:web:3978749683bbb0fc27db33",
  measurementId: "G-RZE98WX20Y"
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
  accept_call_btn.href="http://127.0.0.1:8000/expert/call/"+payload.data.room_id
  incoming_call.style.display="block"
})

function unlock_this_fundi(status) {
  console.log("Locking this Fundi")
  axios.post('/expert/lock', {
    'status':status
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

unlock_this_fundi(true)