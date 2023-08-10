// const messaging=firebase.messaging()

messaging.onMessage(function(payload){
	console.log('onMessage:',payload)
})