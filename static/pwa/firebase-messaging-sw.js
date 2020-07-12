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
    const title="Tengenetsar Incoming Call"
    const options={
        body: "Request for Advice",
        icon: "/static/images/icon.png",
        // image: "/static/images/icon.png",
        badge: "/static/images/icon.png",
        sound: "/static/multimedia/sounds.mp3",
        tag: "incoming-call",
        requireInteraction: true,
        renotify: true,
        silent: false,
        actions: [{
            action: 'accept-action',
            title: 'Accept',
            icon: '/images/images/icons/accept.png'
          },
          {
            action: 'reject-action',
            title: 'Reject',
            icon: '/images/images/icons/accept.png'
          },],

        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data:{
            room_id:payload.data.room_id
        }
    }
    return self.registration.showNotification(title,options)
})

self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        event.notification.close();
        return;
      }
      switch (event.action) {
        case 'accept-action':
        event.waitUntil(
            clients.openWindow('https://tengenetsar.kipya-africa.com/expert/call/'+event.notification.data.room_id)
        );
        break;
        case 'reject-action':
            event.notification.close();
          break;
        default:
            event.notification.close();
          break;
      }
  
});