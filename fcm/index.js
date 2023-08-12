
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

firebase.initializeApp(firebaseConfig)

const messaging=firebase.messaging()

messaging.requestPermission()
.then(function(){
	return messaging.getToken()
})
.then(function(token){
	console.log(token)
})
.catch(function(err){
	console.log(err)
})

messaging.onMessage(function(payload){
	console.log('onMessage:',payload)
})
