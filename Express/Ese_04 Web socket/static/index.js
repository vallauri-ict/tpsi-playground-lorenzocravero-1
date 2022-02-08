$(document).ready(function() {
    let username = prompt("Inserisci lo username:");
    
	// mi connetto al server che mi ha inviato la pagina,
	// il quale mi restituisce il suo serverSocket
	// io.connect é SINCRONO, bloccante
	let serverSocket = io.connect()

    /* 1a) lo username viene inviato SOLO a connessione avvenuta
	       in questo modo si evita di connetere/disconnettere + volte */
	serverSocket.on('connect', function() {
		console.log("connessione ok");
        serverSocket.emit("login", username);
    });

    // 1b) utente valido / non valido
    serverSocket.on('loginAck', function(data) {
		if (data=="NOK"){
			alert("Nome già esistente. Scegliere un altro nome")
			username = prompt("Inserisci un nuovo username:");
			serverSocket.emit("login", username);
		}
		else
			document.title = username;
    });  

	// 2a) invio messaggio
    $("#btnInvia").click(function() {
        let msg = $("#txtMessage").val();
        serverSocket.emit("message", msg);
    });
	
    // 2b) ricezione della risposta
    serverSocket.on('message_notify', function(data) {
        // ricezione di un messaggio dal server			
        data = JSON.parse(data);
        visualizza(data.from, data.message, data.date);
    });  

	// 3) disconnessione
    $("#btnDisconnetti").click(function() {
        serverSocket.disconnect();
    });

    serverSocket.on('disconnect', function() {
        alert("Sei stato disconnesso!");
    });


    function visualizza(username, message, date) {
        let wrapper = $("#wrapper")
        let container = $("<div class='message-container'></div>");
        container.appendTo(wrapper);

        // username e date
        date = new Date(date);
        let mittente = $("<small class='message-from'>" + username + " @" 
		                  + date.toLocaleTimeString() + "</small>");
        mittente.appendTo(container);

        // messaggio
        message = $("<p class='message-data'>" + message + "</p>");
        message.appendTo(container);

        // auto-scroll dei messaggi
        /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
           l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
		*/
        let h = wrapper.prop("scrollHeight");
        // fa scorrere il testo verso l'alto in 500ms
        wrapper.animate({ "scrollTop": h }, 500);
    }
});