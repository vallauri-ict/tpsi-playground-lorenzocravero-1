"use strict"

//il dispatcher si prende incarico delle http request e genera le respond per ogni richiesta

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as _querystring from "query-string";
import { inherits } from "util";
import { isGeneratorFunction } from "util/types";

//headers non ha un wrap come typescript quindi dobbiamo usare require per forza
import {HEADERS} from "./headers";
let paginaErrore : string;

//dichiariamo la classe dispatcher tramite sintassi ES6
export class Dispatcher{
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
        //se il metodo esiste nel vettore dei listener allora si fa un accesso diretto al vettore
        if(metodo in this.listeners)
        {
            //andiamo dentro la chiave metodo e aggiungiamo un ulteriore chiave a cui associeremo una callback
            this.listeners[metodo][risorsa] = callback;
        }
        //altrimenti lancia un messaggio di errore perchè il metodo non esiste
        else
        {
            throw new Error("metodo non valido");
        }
    }


    dispatch(req,res){
        let method = req.method.toUpperCase();
        if(method == "GET")
        {
            this.innerDispatch(req,res);
        }
        else
        {
            let _this = this;
            let parametriBody : string = "";
            //questa funzione viene richiaata ogni volta che arrivano dei dati da http request
            req.on("data",function(data){
                parametriBody += data;
            });

            let parametriJson = {};
            req.on("end",function(){
                //se i parametri sono json allora il try va a buon fine altrimenti sono url endoded
                try{
                    parametriJson = JSON.parse(parametriBody);
                }
                catch(errore)
                {
                    parametriJson = _querystring.parse(parametriBody);
                }
                //finally è una funzione che viene eseguita in ogni caso, sia try che catch
                finally{
                    //creiamo in req un campo riservato a tutti i parametri richiesti da un metodo NON GET
                    //quelli presi dunque dal body e ci mettiamo dentro i parametri json
                    req["BODY"] = parametriJson;
                    _this.innerDispatch(req,res);
                }
            });
        }
    }

    innerDispatch(req,res){
        //leggiamo metodo,risorsa e parametri
        let method = req.method;
        let url = _url.parse(req.url,true);
        let resource = url.pathname;
        let params = url.query;
    
        req["GET"] = params;
        
        //visualizziamo le informazioni principali della richiesta
        //parametri GET
        console.log(`${this.prompt} ${method}: ${resource} ${JSON.stringify(params)}`);
        
        //parametri body
        if(req["BODY"] != null)
        {
            console.log(`${this.prompt} ${method}: ${resource} ${JSON.stringify(params)}`);
        }

        if(resource.startsWith("/api/"))
        {
            if(resource in this.listeners[method])
            {
                //se la risorsa esiste fra i metodi del vettore listeners, dichiariamo un puntatore a funzione
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
            res.writeHead(200,header);
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

