"use strict"

//librerie che ci serviranno per l'esercizio
const _http = require("http");
const _url = require("url");
const _fs = require("fs");
const _mime = require("mime");
let HEADERS = require("./headers.json");

const PORT = 1337;
let paginaErrore;

let server = _http.createServer(function(req, res) {
    //otteniamo dal server tutte le informazioni che ci servono
    let metodo = req.method;
    // parsing della url ricevuta dal client
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let param = url.query;
    //visualizziamo le solite informazioni sulla richiesta
    console.log(`Richiesta: ${metodo} - ${risorsa}, Params: ${JSON.stringify(param)}`);
    
    //inizialmente la risorsa è sempre /, quindi indirizziamo alla pagina iniziale, index.html
    if(risorsa == "/")
    {
        risorsa = "/index.html";
    }
    //se la risposta è una pagina e non un servizio allora lanciamo la lettura della pagina richiesta
    if(!(risorsa.startsWith("/api/")))
    {
        risorsa = "./static" + risorsa;
        //error è un oggetto che nel caso in cui non ci siano errori vale false, altrimenti contiene il codice di errore
        //data contiene il contenuto del file letto
        //leggiamo il la pagina e ne otteniamo il tipo grazie a.
        _fs.readFile(risorsa,function(err,data){
            if(!err)
            {
                //leggiamo il tipo di file da leggere grazie alla libreria mime e lo mettiamo nel header
                let header = {"Content-type" : _mime.getType(risorsa)};
                //se non funziona .getType() utilizzare .lookup() che è la sua versione più vecchia
                res.writeHead(200,header);
                res.write(data);
                res.end();
            }
            else
            {
                res.writeHead(404,HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        });
    }
    //per la gestione dei servizi dobbiamo fare funzioni diverse per ognuno
    //van fatte quindi tante else if per ogni servizio
    //infine la else finale intercetta il caso in cui venga richiesto un servizio inesistente
    else if(risorsa == "/api/servizio")
    {
        //quello che andrebbe fatto è entrare nel db e restituire dei dati veri
        //siccome non siamo ancora capaci, creiamo un json di risposta a mano
        let json = {"ris":"ok"};
        res.writeHead(200,HEADERS.JSON);
        res.write(JSON.stringify(json));
        res.end();
    }
    //tutte le altre else if per ogni servizio
    else
    {
        //in caso di errore non è necessario creare alcuna risposta, basta mandare messaggio di errore
        res.writeHead(404,HEADERS.text);
        res.write("Servizio inesistente");
        res.end();
    }
});

server.listen(PORT,function(){
    //questa istruzione NON lancia ancora la pagina errore, ma la prepara nel caso 
    //in cui serva, per questo la facciamo per prima
    //per visualizzare la pagina va sempre fatto il metodo .write()
    _fs.readFile("./static/error.html",function(err,data){
        if(!err)
        {
            paginaErrore = data;
        }
        else
        {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    })
});
console.log("Server in ascolto sulla porta " + PORT);

