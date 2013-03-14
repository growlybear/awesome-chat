var io = require('socket.io');

exports.initialize = function (server) {

    'use strict';

    io = io.listen(server);

    var chatInfra = io.of('/chat_infra').on('connection', function (socket) {
        socket.on('set_name', function (data) {
            socket.set('nickname', data.name, function () {
                socket.emit('name_set', data);
                socket.send(JSON.stringify({
                    type: 'serverMessage',
                    message: 'Welcome to the most interesting chat room on earth!'
                }));
                socket.broadcast.emit('user_entered', data);
            });
        });
    });

    var chatCom = io.of('/chat_com').on('connection', function (socket) {
        socket.on('message', function (message) {
            message = JSON.parse(message);

            if (message.type === 'userMessage') {
                socket.get('nickname', function (err, nickname) {
                    message.username = nickname;
                    socket.broadcast.send(JSON.stringify(message));
                    message.type = 'myMessage';
                    socket.send(JSON.stringify(message));
                });
            }
        });
    });
};
