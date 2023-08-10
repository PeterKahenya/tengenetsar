var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
    port: 9000,
    path: '/broker',
    ssl: {
        key: fs.readFileSync('/etc/letsencrypt/live/signaling.kipya-africa.com/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/signaling.kipya-africa.com/fullchain.pem', 'utf8')
    }
});
