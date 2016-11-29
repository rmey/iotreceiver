// More detail to understand see here: http://nodecode.de/chat-nodejs-websocket
module.exports = function (thePort) {
  var ExpressApp = require('express'),
          app = ExpressApp(),
       server = require('http').createServer(app),
           io = require('socket.io').listen(server);
         port = thePort;
      message = "no message";
      thesocket  = null;

  // Setup the WebApplication
  this.startWebApplication = function () {

      server.listen(port);
      console.log('>>> startWebApplication -> port:', port);

      // provide the static folders
      app.use(ExpressApp.static(__dirname + '/public'));
      app.use(ExpressApp.static(__dirname + '/public/css'));
      app.use(ExpressApp.static(__dirname + '/public/js'));
      app.use(ExpressApp.static(__dirname + '/public/js/utils'));
      app.use(ExpressApp.static(__dirname + '/public/js/utils/dist'));
      console.log('>>> *****************\n >>> startWebApplication -> static path: \n>>> **************');

      // provide the index.html
      app.get('/', function (req, res) {
      	res.sendFile(__dirname + './public/index.html');
      });
  }

  // Start a WebSocket to receive messages
  function startSendMessage () {
    // Websocket
    io.sockets.on('connection', function (socket) {
      thesocket = socket;
      console.log('>>> startSendMessage -> socket: ', socket);
      // der Client ist verbunden
      socket.emit('chat', { time: new Date(), text: '***' + message + "***"});
      socket.on("disconnect", function() {
        //https://github.com/LearnBoost/socket.io-client/issues/251
        console.log('>>> reconnect -> socket:', socket);
        socket.socket.reconnect();
      });
    });
  }

  // This function will be called inside the server to provide the needed
  // data to show
  this.setMessage = function (theMessage){
    message = theMessage;
    console.log('>>> setMessage : ', message);
    if (thesocket  != null){
      if (thesocket.connected){
          console.log('>>> socket connected : ', thesocket )
          thesocket.emit('chat', { time: new Date(), text: '***' + message + "***"});
      } else {
        console.log('>>> socket not connected : ', socket)
        startSendMessage();
      }
    } else {
      console.log('>>> socket not connected : ');
      startSendMessage();
    }
  }

  this.startSocketServer = function () {
      // Websocket
      io.sockets.on('connection', function (socket) {
        console.log('>>> startSocketServer -> port:', socket);
        thesocket = socket;
        // der Client ist verbunden
      	socket.emit('chat', { time: new Date(), text: 'You are connected to the server' });

        // wenn ein Benutzer einen Text senden
      	socket.on('chat', function (data) {
      		// so wird dieser Text an alle anderen Benutzer gesendet
      		io.sockets.emit('chat', { time: new Date(), name: data.name || 'Anonym', text: data.text });
      	});

        socket.on("disconnect", function() {
          //https://github.com/LearnBoost/socket.io-client/issues/251
          console.log('>>> reconnect -> port:', socket);
          socket.socket.reconnect();
        });
      });
    }

}
