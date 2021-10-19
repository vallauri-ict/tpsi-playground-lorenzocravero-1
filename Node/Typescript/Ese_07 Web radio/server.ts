
import { prototype } from 'events';
import *  as _http from 'http';
import { json } from 'stream/consumers';
import { HEADERS } from "./headers";
import { Dispatcher } from './dispatcher';
import radios from './radios.json';
import states from "./states.json";
import * as _fs from 'fs';
import * as _mime from 'mime';
import { parse } from 'path/posix';

let dispatcher = new Dispatcher();
let PORT = 1337;
let server = _http.createServer(function (req, res) { //funzione richiamata ogni volta 
  //se è statico cerca il file nel file sistem se no si deve cercare il servizio nel vettore associativo del disatcher
  dispatcher.dispatch(req, res);
})
server.listen(PORT);
console.log("Server in ascolto sulla porta: " + PORT);


//aggiungo tutti i listener
dispatcher.addListener("GET","/api/elenco",function(req,res){
  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(states));
  res.end();
});

dispatcher.addListener("POST","/api/radios",function(req,res){
  let state = req["BODY"].state;
  let stazioni = [];

  if(state == "tutti")
  {
    for (const radio of radios) 
    {
      stazioni.push(radio);
    }
  }
  else
  {
    for (const radio of radios) 
    {
      if(radio.state == state)
      {
        stazioni.push(radio);
      }
    }
  }

  //restituisco i dati al chiamante
  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify(stazioni));
  res.end();
})

dispatcher.addListener("POST","/api/like",function(req,res){
  let id = req["BODY"].id;
  let like;

  for (const radio of radios) 
  {
    if(radio.id == id)
    {
      like = parseInt(radio.votes);
      like++;
      radio.votes = like.toString();
    }
  }

  _fs.writeFile("./radios.json",JSON.stringify(radios),function(err){
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Json salvato correttamente su disco");
    }
  })

  res.writeHead(200,HEADERS.json);
  res.write(JSON.stringify({"nLike" : like}));
  res.end();
})
