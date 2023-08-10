importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js")




var firebaseConfig = {
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
            clients.openWindow('http://127.0.0.1:8000/expert/call/'+event.notification.data.room_id)
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