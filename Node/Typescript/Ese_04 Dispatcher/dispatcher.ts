"use strict"

//il dispatcher si prende incarico delle http request e genera le respond per ogni richiesta

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import { inherits } from "util";

//headerse non ha un wrap come typescritp quindi dobbiamo usare require per forza
let HEADERS = require("./headers.json");
let paginaErrore : string;

//dichiariamo la classe dispatcher tramite sintassi ES6
class dispatcher{
    prompt:string = ">>> "
    //listener è un json costituito da 5 campi che corrispondono a tutte le chiamate http possibili
    //ogni listener è a sua volta costituito da un json {"risorsa":"callback"}
    //quindi per ogni tipo di chiamata verrà eseguita la relativa callback
    //se la risorsa richiesta è "studenti", il dispatcher cercherà gli studenti ed eseguira la callback di GET
    listeners = {
        "GET":{}, 
        "POST":{}, 
        "DELETE":{}, 
        "PATCH":{}, 
        "PUT":{}
    }

    constructor(){
        //questa function viene eseguita una volta sola nel costruttore e serve a caricare la pagina di errore
        //per non doverla leggere tutte le volte che si verifica un errore
        init();
    }

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
            //andiamo dentro la chiava metodo e aggiungiamo un ulteriore chiave a cui associeremo una callback
            this.listeners[metodo][risorsa] = callback;
        }
        else
        {
            throw new Error("metodo non valido");
        }
    }

    dispatch(req,res){
        //leggiamo metodo,risorsa e parametri
        let method = req.method;
        let url = _url.parse(req.url,true);
        let resource = url.pathname;
        let params = url.query;
        
        //visualizziamo le informazioni principali della richiesta
        console.log(`${this.prompt} ${method}: ${resource} ${JSON.stringify(params)}`);

        if(resource.startsWith("/api/"))
        {
            if(resource in this.listeners[method])
            {
                //se la risorsa esiste fra i metodi del vettore listeners, dichiariamo uin puntatore a funzione
                //ed eseguiamo la callback riferita a quel servizio
                let _callback = this.listeners[method][resource];
                _callback(req,res);
            }
            else
            {
                res.writeHead(404,HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        }
        else
        {
            staticListener(req,res,resource);
        }
    }
}

function staticListener(req,res,risorsa){
    if(risorsa == "/")
    {
        risorsa = "/index.html";
    }
    let filename = "./static" + risorsa;

    _fs.readFile(filename,function(err,data){
        if(!err)
        {
            let header = {"Content-Type":_mime.getType(filename)}
            res.writeHead(200,{"Content-Type" : header});
            res.write(data);
            res.end();
        }
        else
        {
            console.log(`${err.code}: ${err.message}`);
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}

function init(){
    _fs.readFile("./static/error.html",function(err,data){
        if(!err)
        {
            paginaErrore = data.toString();
        }
        else
        {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    });
}

//esportiamo l'istanza della classe in forma anonima
module.exports = new dispatcher();

