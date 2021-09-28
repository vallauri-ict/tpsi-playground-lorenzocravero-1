//questo file è il modulo
"use strict"

//il dispatcher si prende incarico delle http request e genera le respond per ogni richiesta

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";

//headerse non ha un wrap come typescritp quindi dobbiamo usare require per forza
let HEADERS = require("headers.json");
let paginaErrore : string;

//dichiariamo la classe dispatcher tramite sintassi ES6
class dispatcher{
    prompt:string = ">>>"
    //listener è un json costituito da 5 campi che corrispondono a tutte le chiamate http possibili
    //ogni listener è a sua volta costituito da un json {"risorsa":"callback"}
    //quindi per ogni tipo di chiamata verrà eseguita la relativa callback
    //se la risorsa richiesta è "studenti", il dispatcher cercherà gli studenti ed eseguira la callback di GET
    listeners:any = {
        "GET":{}, 
        "POST":{}, 
        "DELETE":{}, 
        "PATCH":{}, 
        "PUT":{}
    }

    constructor(){}

    //mettiamo a disposizione del main un metodo che gli servirà ogni volta che vorrà aggiungere un listener
    //la function aggiungerà quindi il listener ricevuto dal main al vettore dei listener
    addListener(metodo:string, risorsa:string, callback:any){
        metodo = metodo.toUpperCase();
        // due modi equivalenti per controllare che il metodo esista nel json dei listener
        /*if(this.listeners[metodo])
        {

        }*/
        if(metodo in this.listeners)
        {
            this.listeners[metodo][risorsa] = callback;
        }
        else
        {
            throw new Error("metodo non valido");
        }
    }
}

