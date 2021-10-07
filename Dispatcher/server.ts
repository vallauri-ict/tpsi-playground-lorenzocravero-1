//questo file è il main
"use strict"

import * as _http from "http";
let HEADERS = require("./headers.json");
//NB: esportiamo in questa maniera perchè in dispatcher non c'è alcuna funzione
//o metodo o property al di fuori della classe dispatcher in se
//nel caso in cui ci siano più funzioni, vedere esercizio 3.
let dispatcher = require("./dispatcher.ts");
const PORT:number = 1337;

let server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);

//registriamo i servizi che vogliamo fornire PRIMA che arrivi qualsiasi tipo di richiesta dal client
dispatcher.addListener("POST","/api/servizio1",function(req,res){
    //nella function inseriamo il codice di risposta al servizio
    res.writeHead(200,HEADERS.json);
    let nome = req["BODY"].nome;
    res.write(JSON.stringify({"nome":nome,"id" : req["GET"].id}));
    res.end();
})

dispatcher.addListener("GET","/api/servizio2",function(req,res){
    //nella function inseriamo il codice di risposta al servizio
    res.writeHead(200,HEADERS.json);
    //andiamo in req a prendere nella chiave GET (cioè il metodo) l'unico parametro che è Nome
    let nome = req["GET"].nome;
    res.write(JSON.stringify({"nome":nome}));
    res.end();
})