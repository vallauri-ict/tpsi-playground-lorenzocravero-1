"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()

import {HEADERS} from "./headers"
import facts from "./facts.json";


/* ********************** */

let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);

//proviamo ad inserire un nuovo record
mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){
  if(!err)
  {
    let db = client.db("5B_studenti");
    let collection = db.collection("Studenti");
    let newStudent = {"nome" : "lollo", "indirizzo" : "informatica", "sezione" : "B", "lavoratore" : false, "hobbies" : ["calcio", "cinema", "pugilato"], "residenza" : { "citta " : "Fossano", "provincia" : "cuneo", "cap" : "12045"}};
    collection.insertOne(newStudent,function(err,data){
      if(!err)
      {
        console.log(data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

//lo possiamo tenere come modello di accesso ai database
//NB: la chiusura della connessione deve SEMPRE essere l'ultima istruzione della callback
//perchè se la mettiamo fuori essendo mongo asincrono, chiude la connessione prima di eseguire la funzione
mongoClient.connect("mongodb://127.0.0.1:27017",function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db("5B_studenti");
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Studenti");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find().toArray(function(err,data){
      if(!err)
      {
        console.log(data);
      }
      else
      {
        console.log("errore esecuzione query " + err.message);
      }
      client.close();
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
});

