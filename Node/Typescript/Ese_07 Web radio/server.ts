//questo file è il main
"use strict"

import * as _http from "http";
import {HEADERS} from "./headers";
import radios from "./radios.json";
import states from "./states.json";
import * as _fs from "fs";

//NB: esportiamo in questa maniera perchè in dispatcher non c'è alcuna funzione
//o metodo o property al di fuori della classe dispatcher in se
//nel caso in cui ci siano più funzioni, vedere esercizio 3.
import {Dispatcher} from "./dispatcher";
const PORT:number = 1345;

let dispatcher = new Dispatcher();

let server = _http.createServer(function(req,res){
    dispatcher.dispatch(req,res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);

//aggiungo i vari listener
dispatcher.addListener("POST","/api/contaRadio",function(req,res){
    //la prima volta azzero tutti i counter, così che ad ogni
    //refresh si riparta da zero
    for (const state of states) 
    {
        for (const radio of radios) 
        {
            if(state.name == radio.state)
            {
                let cont = 0;
                console.log(cont);
                state.stationcount = cont.toString();
            }
        }
    }
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err)
        {
            res.writeHead(404,HEADERS.text);
            res.write(err);
        }
        else
        {
            res.writeHead(200,HEADERS.text);
            res.write("Json salvato correttamente su disco");
        }
    })

    //la seconda li incremento
    for (const state of states) 
    {
        for (const radio of radios) 
        {
            if(state.name == radio.state)
            {
                let cont = parseInt(state.stationcount);
                console.log(cont);
                cont++;
                state.stationcount = cont.toString();
            }
        }
    }
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err)
        {
            res.writeHead(404,HEADERS.text);
            res.write(err);
        }
        else
        {
            res.writeHead(200,HEADERS.text);
            res.write("Json salvato correttamente su disco");
        }
    })
    res.end();
});


dispatcher.addListener("GET","/api/elenco",function(req,res){
    res.writeHead(200,HEADERS.json);
    res.write(JSON.stringify(states));
    res.end();
});

