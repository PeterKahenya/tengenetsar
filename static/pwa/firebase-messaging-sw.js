importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js")




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
messaging.setBackgroundMessageHandler(function (payload) {
    console.log("payload")
    const title="Tengeneza Incoming Call"
    const options={
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data:{
            room_id:payload.data.room_id
        }
    }
    return self.registration.showNotification(title,options)
})

self.addEventListener('notificationclick', function(event) {
    console.log("Event",event)
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://tengenetsar.kipya-africa.com/expert/call/'+event.notification.data.room_id)
  );
});