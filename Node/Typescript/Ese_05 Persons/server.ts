//questo file è il main
"use strict"

import * as _http from "http";
import {HEADERS} from "./headers";
import {persons} from "./persons";

//NB: esportiamo in questa maniera perchè in dispatcher non c'è alcuna funzione
//o metodo o property al di fuori della classe dispatcher in se
//nel caso in cui ci siano più funzioni, vedere esercizio 3.
import {Dispatcher} from "./dispatcher";
const PORT:number = 1337;

let dispatcher = new Dispatcher();

let server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);


//registriamo i servizi che vogliamo fornire PRIMA che arrivi qualsiasi tipo di richiesta dal client
dispatcher.addListener("GET","/api/nazioni",function(req,res){
    let nazioni = [];
    for (const person of persons["results"]) 
    {
        if(!nazioni.includes(person.location.country))
        {
            nazioni.push(person.location.country);
        }
    }
    nazioni.sort();
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({"Nazioni" : nazioni}));
    res.end();
});

dispatcher.addListener("GET","/api/elencoPersone",function(req,res){
    let persone = [];
    let currentNazione = req["GET"].nazione;
    for (const person of persons["results"]) 
    {
        if(person.location.country == currentNazione)
        {
            let json = {
                "name" : person.name.title + " " + person.name.first + " " + person.name.last,
                "city" : person.location.city,
                "state" : person.location.state,
                "cell" : person.cell
            };
            persone.push(json);
        }
    }
    res.writeHead(200, HEADERS.json);
    res.write(JSON.stringify({"Persone" : persone}));
    res.end();
});

dispatcher.addListener("PATCH","/api/dettagli",function(req,res){
    let trovato = false;
    let personReq = req["BODY"].name;
    let person;
    for (person of persons["results"]) 
    {
        if((person.name.title + " " + person.name.first + " " + person.name.last) == personReq)
        {
            trovato = true;
            break;
        }
    }
    if(trovato)
    {
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify(person));
        res.end();
    }
    else
    {
        res.writeHead(200, HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }
});

dispatcher.addListener("DELETE","/api/elimina",function(req,res){
    let persona = req["BODY"].persona;
    let trovato = false;
    let i;

    for (i = 0; i < persons.results.length; i++) {
        let name = persons.results[i].name.title + " " + persons.results[i].name.first + " " + persons.results[i].name.last
        if(persona == name)
        {
            trovato = true;
            break;
        }
    }
    if(trovato)
    {
        persons.results.splice(i,1);
        res.writeHead(200, HEADERS.json);
        res.write(JSON.stringify("Persona eliminata correttamente"));
        res.end();
    }
    else
    {
        res.writeHead(404, HEADERS.text);
        res.write("Persona non trovata");
        res.end();
    }  
});