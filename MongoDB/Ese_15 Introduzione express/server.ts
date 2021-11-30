"use strict"

import  express from "express";
import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from "mongodb"
import { HEADERS } from "./headers";


const app =  express();

const mongoClient = _mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DB_NAME = "5B";
const PORT = 1337; 


const server = _http.createServer(app);


server.listen(PORT,()=>{
  console.log("Server in ascolto sulla porta: " + PORT);
});

//registrazione delle route
app.use("*",(req,res,next)=>{
  console.log("=>" + req.method + ":" + req.originalUrl);
  next();
})

app.get("*",(req,res,next)=>{
    res.send("This is the response")
})







