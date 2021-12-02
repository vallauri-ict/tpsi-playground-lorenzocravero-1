"use strict"

import express from "express";
import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from "mongodb"
import * as _bodyparser from "body-parser";
import { inherits } from "util";


const app =  express();
const mongoClient = _mongodb.MongoClient;
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const CONNSTRING = "mongodb://lorenzocravero:lollo@cluster0-shard-00-00.iwwbt.mongodb.net:27017,cluster0-shard-00-01.iwwbt.mongodb.net:27017,cluster0-shard-00-02.iwwbt.mongodb.net:27017/test?replicaSet=atlas-gt4d36-shard-0&ssl=true&authSource=admin";
const DBNAME = "5B";
const PORT = 1337; 


const server = _http.createServer(app);

server.listen(PORT,()=>{
  console.log("Server in ascolto sulla porta: " + PORT);
  init();
});

//creiamo una variabile globale per contenere una pagina di errore
let paginaErrore  = "";

function init(){
  _fs.readFile("./static/error.html",(err,data)=>{
    if(!err)
    {
      paginaErrore = data.toString();
    }
    else
    {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  })
}

/* **************************************************** */
/// Elenco delle route di tipo middleware
/* **************************************************** */

// 1)log
app.use("/",(req,res,next)=>{
  console.log("=>" + req.method + ":" + req.originalUrl);
  next();
})

// 2)static route
//va nella cartella static a cercare se trova un file col nome della risorsa,
//se lo trova li restituisce, altrimenti fa next ed il controllo passa all'app.use successiva
app.use("/",express.static("./static"));

// 3)route di lettura dei parametri POST
app.use("/",_bodyparser.json());
app.use("/",_bodyparser.urlencoded({"extended" : true}));

// 4)log dei parametri
app.use("/",(req,res,next)=>{
  if(Object.keys(req.query).length > 0)
  {
    console.log("      Parametri GET : " , req.query);
  }
  if(Object.keys(req.body).length > 0)
  {
    console.log("      Parametri BODY : " , req.body);
  }
  next();
})


/* **************************************************** */
/// Elenco delle route di risposta al client
/* **************************************************** */

//apriamo la connessione per tutte le query
app.use("/",function(req,res,next){
  mongoClient.connect(CONNSTRING,function(err,client){
    if(err)
    {
      res.status(503).send("Errore di connessione al database");
    }
    else
    {
      req["client"] = client;
      next();
    }
  })
});

//modello di query con express con parametri come json
app.get("/api/risorsa1",(req,res,next)=>{
  let nome = req.query.nome;
  if(nome)
  {
    let db = req["client"].db(DBNAME);
    let collection = db.collection("unicorns");
    let request = collection.find({"name" : nome}).toArray();
    request.then(function(data){
      res.send(data);
    });

    request.catch(function(err){
      res.status(500).send("Errore nell'esecuzione della query" + err);
    });

    request.finally(function(){
      req["client"].close();
    });
  }
  else
  {
    res.status(400).send("Parametro non trovato");
    req["client"].close();
  }
});


//query 2
app.patch("/api/risorsa2",(req,res,next)=>{
  let nome = req.body.nome;
  let vampiri = req.body.vampiri;
  if(nome && vampiri)
  {
    let db = req["client"].db(DBNAME);
    let collection = db.collection("unicorns");
    let request = collection.updateOne({"name" : nome},{$inc : {"vampires" : vampiri}});
    
    request.then(function(data){
      res.send(data);
    });

    request.catch(function(err){
      res.status(500).send("Errore nell'esecuzione della query" + err);
    });

    request.finally(function(){
      req["client"].close();
    });
  }
  else
  {
    res.status(400).send("Parametro non trovato");
    req["client"].close();
  }
});


//modello di query con express con parametri passati nella risorsa
app.get("/api/risorsa3/:gender/:hair",(req,res,next)=>{
  let gender = req.params.gender;
  let hair = req.params.hair;
  //in questo caso non serve neanche fare la if per il controllo dei parametri 
  //perchè se non li trova non entra proprio nella query
  let db = req["client"].db(DBNAME);
  let collection = db.collection("unicorns");
  let request = collection.find({$and : [{"gender" : gender},{"hair" : hair}]}).toArray();
    
  request.then(function(data){
    res.send(data);
  });

  request.catch(function(err){
    res.status(500).send("Errore nell'esecuzione della query" + err);
  });

  request.finally(function(){
    req["client"].close();
  });
});


/* **************************************************** */
/// Elenco delle route di gestione dell'errore
/* **************************************************** */

app.use("/",(req,res,next) =>{
  res.status(404);
  if(req.originalUrl.startsWith("/api/"))
  {
    res.send("Risorsa non trovata");
  }
  else
  {
    res.send(paginaErrore);
  }
})

//route per la gestione dell'errore
app.use(function(err,req,res,next){
  console.log("Errore lato server " + err.message);
})


