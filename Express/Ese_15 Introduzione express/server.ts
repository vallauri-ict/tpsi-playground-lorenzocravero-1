"use strict"

import  express from "express";
import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from "mongodb"
import bodyParser, * as _bodyparser from "body-parser";
import { inherits } from "util";


const app =  express();

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";
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
//Elenco delle route di tipo middleware
/* **************************************************** */

// 1)log
app.use("/",(req,res,next)=>{
  console.log("=>" + req.method + ":" + req.originalUrl);
  next();
})

// 2)static route
app.use("/",express.static("./static"));

// 3)route di lettura dei parametri POST
app.use("/",_bodyparser.json());
app.use("/",_bodyparser.urlencoded({"extended" : true}));

// 4)log dei parametri
app.use("/",(req,res,next)=>{
  if(Object.keys(req.query).length > 0)
  {
    console.log("Parametri GET : " , req.query);
  }
  if(Object.keys(req.body).length > 0)
  {
    console.log("Parametri BODY : " , req.body);
  }
  next();
})


/* **************************************************** */
//Elenco delle route di risposta al client
/* **************************************************** */

/*app.get("*",(req,res,next)=>{
  res.send("This is the response");
})*/

app.get("/api/risorsa1",(req,res,next)=>{
  let nome = req.query.nome;
  res.send({"nome" : nome});
})

app.post("/api/risorsa2",(req,res,next)=>{
  let nome = req.body.nome;
  res.send({"nome" : nome});
})

/* **************************************************** */
//Elenco delle route di gestione dell'errore
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


