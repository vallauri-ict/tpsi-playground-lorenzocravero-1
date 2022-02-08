"use strict";
const http = require('http');
const colors = require('colors');
const express = require('express');
const app = express()
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 1337

server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

app.use(express.static('./static'));


/************************* gestione web socket ********************** */
let users = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  Per ogni utente la funzione di callback crea una variabile locale
  'user' contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function(clientSocket) {
	let user = {};

	// 1) ricezione username
	clientSocket.on('login', function(username) {
		// controllo se user esiste già
		let item = users.find(function(item) {
			return (item.username == username)
		})
		if (item != null) {
			clientSocket.emit("loginAck", "NOK")
		}
		else{
			user.username = username;
			user.socket = clientSocket;
			users.push(user);
			clientSocket.emit("loginAck", "OK")
			log('User ' + colors.yellow(user.username) +
						" (sockID=" + user.socket.id + ') connected!');
		}
	});

	// 2) ricezione di un messaggio	 
	clientSocket.on('message', function(msg) {
		log('User ' + colors.yellow(user.username) + 
		          " (sockID=" + user.socket.id + ') sent ' + colors.green(msg))
		// notifico a tutti i socket (mittente compreso) il messaggio ricevuto 
		let response = {
			'from': user.username,
			'message': msg,
			'date': new Date()
		}
		io.sockets.emit('message_notify', JSON.stringify(response));
	});

    // 3) disconnessione dell'utente
    clientSocket.on('disconnect', function() {
		// ritorna -1 se non lo trova
		let index = users.findIndex(function(item){
			return (item.username == user.username)
		})
		users.splice(index, 1)
		log(' User ' + user.username + ' disconnected!');
    });
});

// stampa i log con data e ora
function log(msg) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " +msg)
}