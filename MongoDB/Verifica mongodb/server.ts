"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()
import { HEADERS } from "./headers";
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const PORT: number = 1337;

let server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);


//listeners
dispatcher.addListener("GET","/api/facts",function(req,res){
  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err)
    {
      //andiamo ad accedere al database 5B_studenti
      let db = client.db(DBNAME);
      let collection = db.collection("Facts");
      let req = collection.find().project({"_id" : 1, "value" : 1}).toArray();
      req.then(function(data){
        if(!err)
        {
          res.writeHead("200",HEADERS.json);
          res.write(JSON.stringify(data));
        }
        else
        {
          res.writeHead("500",HEADERS.text);
          res.write("Errore esecuzione query");
        }
        res.end();
      });
      req.catch(function(err){
        console.log("errore nell'esecuzione della query " + err);
      });
      req.finally(function(){
        client.close();
      })
    }
    else
    {
      console.log("Errore nella connessione al database");
    }
  })
});


dispatcher.addListener("POST","/api/servizio1",function(req,res){
  let id = req["BODY"].id;
  let value = req["BODY"].value;
  let newDate = new Date();

  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err)
    {
      //andiamo ad accedere al database 5B_studenti
      let db = client.db(DBNAME);
      let collection = db.collection("Facts");
      let req = collection.updateOne({"_id" : id},{$set : {"value" : value, "updated_at" : newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate()}});
      req.then(function(data){
        if(!err)
        {
          res.writeHead("200",HEADERS.json);
          res.write(JSON.stringify({"ris" : "Json modificato correttamente"}));
        }
        else
        {
          res.writeHead("500",HEADERS.text);
          res.write("Errore esecuzione query");
        }
        res.end();
      });
      req.catch(function(err){
        console.log("errore nell'esecuzione della query " + err);
      });
      req.finally(function(){
        client.close();
      })
    }
    else
    {
      console.log("Errore nella connessione al database");
    }
  })
});