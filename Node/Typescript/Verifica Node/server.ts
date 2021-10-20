"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()

import {HEADERS} from "./headers"
import facts from "./facts.json";


/* ********************** */

// const categories = []
const categories = ["career","money","explicit","history","celebrity","dev","fashion","food","movie","music","political","religion","science","sport","animal","travel"]

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io"
const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]

let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})

server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);

//aggiungo i listener

dispatcher.addListener("GET","/api/categories",function(req,res){
  let categories = [];
  for (const fact of facts.facts) 
  {
    for (const category of fact.categories) 
    {
      if(!categories.includes(category))
      {
        categories.push(category);
      }
    }
  }

  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(categories));
  res.end();
});

dispatcher.addListener("GET","/api/facts",function(req,res){
  let currentCategory = req["GET"].category;
  let values = [];

  for (const fact of facts.facts) 
  {
    for (const category of fact.categories) 
    {
      if(currentCategory == category)
      {
        values.push(fact);
      }
    }
  }
  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(values));
  res.end();
});

dispatcher.addListener("POST","/api/rate",function(req,res){
  let ids = req["BODY"];
  for (let i = 0; i < ids.length; i++) 
  {
    for (const fact of facts.facts) 
    {
      if(ids[i] == fact.id)
      {
        fact.score++;
      }
    }
  }

  //salvo il file con le modifiche
  _fs.writeFile("./facts.json",JSON.stringify(facts),function(err){
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.writeHead(200,HEADERS.json);
      res.write(JSON.stringify({"ris" : "Ok"}));
      res.end();
    }
  })
});

//utlimo punto non terminato
/*dispatcher.addListener("POST","/api/add",function(req,res){
  let categoria = req["BODY"].categoria;
  let value = req["BODY"].value;

  console.log(categoria + " " + value);
})*/


