"use strict"

$(document).ready(function() {
    let user = {"username":"","room":""};
    let serverSocket;

    let btnConnetti = $("#btnConnetti")
    let btnDisconnetti = $("#btnDisconnetti");
    let btnInvia = $("#btnInvia");

    btnDisconnetti.prop("disabled",true);
    
	// mi connetto al server che mi ha inviato la pagina,
	// il quale mi restituisce il suo serverSocket
    // io.connect é SINCRONO, bloccante
    
    // 1) creiamo la connessione al server socket 
    btnConnetti.click(function(){
        serverSocket = io({transports:['websocket'], upgrade: false}).connect();

        serverSocket.on('connect', function() {
            console.log("connessione ok");
            user.username = prompt("Inserisci lo username:");
            if(user.username == "pippo"||user.username == "pluto")
            {
                user.room = "room1";
            }
            else
            {
                user.room = "defaultRoom";
            }
            serverSocket.emit("login", JSON.stringify(user));
        });

        serverSocket.on('loginAck', function(data) {
            if (data=="NOK"){
                alert("Nome già esistente. Scegliere un altro nome")
                user.username = prompt("Inserisci un nuovo username:");
                serverSocket.emit("login", JSON.stringify(user));
            }
            else
                document.title = user.username;
        }); 

        serverSocket.on('message_notify', function(data) {
            // ricezione di un messaggio dal server			
            data = JSON.parse(data);
            visualizza(data.from, data.message, data.date, data.img);
        });

        serverSocket.on('disconnect', function() {
            alert("Sei stato disconnesso!");
        });

        btnConnetti.prop("disabled",true);
        btnDisconnetti.prop("disabled",false);
        btnInvia.prop("disabled",false);
    });
     

	// 2a) invio messaggio
    btnInvia.click(function() {
        let msg = $("#txtMessage").val();
        serverSocket.emit("message", msg);

        $("#txtMessage").val("");
    });
	  

	// 3) disconnessione
    btnDisconnetti.click(function() {
        serverSocket.disconnect();

        btnDisconnetti.prop("disabled",true);
        btnConnetti.prop("disabled",false);
        btnInvia.prop("disabled",true);
    });


    function visualizza(username, message, date, img) {
        let wrapper = $("#wrapper")
        let container = $("<div class='message-container'></div>");
        container.appendTo(wrapper);

        //immagine
        let img = $("<img>");
        img.prop("src","img/"+img);

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