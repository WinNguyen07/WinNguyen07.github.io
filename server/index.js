const io = require('socket.io')(process.env.PORT || 3000);

const arrPeerID = [];

io.on('connection', socket => {
    socket.emit('ONLINE_PEER', arrPeerID);
    
    socket.on('NEW_PEER_ID', peerID => {
        socket.peerID = peerID;
        arrPeerID.push(peerID);
        io.emit('NEW_CLIENT_CONNECT', peerID);
    });
    
    socket.on('disconnect', () => {
        const index = arrPeerID.indexOf(socket.peerID);
        arrPeerID.slice(index, 1);
        io.emit('SOMEONE_DISCONNECTED', socket.peerID);
    });
});

