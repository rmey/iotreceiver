$(document).ready(function(){
    // WebSocket
    var socket = io.connect();
    // neue Nachricht
    socket.on('chat', function (data) {
        var time = new Date(data.time);
        $('#content').append(
            $('<li></li>').append(
                // time
                $('<span>').text('[' +
                    (time.getHours() < 10 ? '0' + time.getHours() : time.getHours())
                    + ':' +
                    (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())
                    + '] '
                ),
                // Message Type Name
                $('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
                // Text
                $('<span>').text(data.text))
        );
        // nach unten scrollen
        $('body').scrollTop($('body')[0].scrollHeight);
    });
    // Send message
    function send(){
        // Input
        var name = $('#name').val();
        var text = $('#text').val();
        // send Socket
        socket.emit('chat', { name: name, text: text });
        // Text-Eingabe leeren
        $('#text').val('');
    }
    // using click
    $('#send').click(send);
    //or enter
    $('#text').keypress(function (e) {
        if (e.which == 13) {
            send();
        }
    });
});
