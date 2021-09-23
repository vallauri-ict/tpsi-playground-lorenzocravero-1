//dichiariamo due librerie che ci serviranno per le funzioni
let _http = require("http");
let _url = require("url");
//let _colors = require("colors");
//con questa variabile otteniamo il file headers.json che contiene tutte le intestazioni
let HEADERS = require("./headers.json"); //punto e slash indica la cartella corrente

let port = 1337; //porta da cui faremo partire node js

//crea un web server e ne restituisce il puntatore ma non lo fa ancora partire
//la callback di create server verrà eseguita ogni volta che arriva una richiesta 
//alla callback vengono iniettati 2 parametri: request e response
//request contiene tutte le informazioni sulla richiesta
//response contiene la risposta da restituire
let server=_http.createServer(function (req, res) {

    /* Prima prova del server
    res.writeHead(200,HEADERS.text);
    res.write("Richiesta eseguita correttamente")
	res.end(); //invia la response
    console.log("Richiesta eseguita");
    */

    let method = req.method;
    //per fare il parsing usiamo la libreria _url ed il metodo .parse()
    //si aspetta due parametri,la url da parsificare e true perchè di default non parsifica niente
    let url = _url.parse(req.url,true);
    let resource = url.pathname;
    let params = url.query;
    let domain = req.headers.host;
    //abbiamo al metodo,alla risorsa e ai parametri, che sono le 3 informazioni fondamentali
    res.writeHead(200,HEADERS.html);
    res.write("<h1>Informazioni relative alla richiesta ricevuta</h1>");
    res.write("</br>");
    //mettiamo tutte le informazioni nell'html di risposta
    res.write(`<p><b>Risorsa: </b> ${resource}`);
    res.write(`<p><b>Metodo: </b> ${method}</p>`);
    res.write(`<p><b>Parametri: </b> ${JSON.stringify(params)}</p>`);
    res.write(`<p><b>Dominio: </b> ${domain}</p>`);
    res.write("<p>Grazie per la richiesta</p>");

    res.end();
    console.log("Richiesta avvenuta correttamente"+req.url);
    
});

// se non si specifica l'indirizzo IP di ascolto il server risponde a tutte le interfacce
//altrimenti si deve specificare l'ip dell'interfaccia desiderata
//server.listen serve a far partire il server, come parametro ha il numero di porta e l'indirizzo dell'interfaccia
// su cui vogliamo farlo partire, se viene omesso significa che c'è solo un interfaccia
server.listen(port);
console.log("Server in ascolto sulla porta " + port);