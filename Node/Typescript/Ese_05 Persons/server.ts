//questo file è il main
"use strict"

import * as _http from "http";
let HEADERS = require("./headers.json");
let persons = require("./persons.json");

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
dispatcher.addListener("GET","/api/nazioni",function(req,res){
    res.writeHead(200, HEADERS.json);
    let nazioni = [];
    for (const person of persons["results"]) 
    {
        if(!nazioni.includes(person.location.country))
        {
            nazioni.push(person.location.country);
        }
    }
    nazioni.sort();
    res.write(JSON.stringify({"Nazioni" : nazioni}));
    res.end();
});

dispatcher.addListener("GET","/api/persone",function(req,res){
    let persone = [];
    let currentNazione = req["GET"].nazione;
    for (const person of persons["results"]) 
    {
        let aus = {
            "name" : person.name.title + " " + person.name.first + " " + person.name.last,
            "city" : person.city,
            "state" : currentNazione,
            "cell" : person.cell
        };
        persone.push(aus);
    }
    res.write(JSON.stringify({"Persone" : persone}));
    res.end();
});