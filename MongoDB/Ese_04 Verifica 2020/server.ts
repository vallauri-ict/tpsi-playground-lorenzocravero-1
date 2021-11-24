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

// let server = _http.createServer(function (req, res) {
//   dispatcher.dispatch(req, res);
// });

// server.listen(PORT);
// console.log("Server in ascolto sulla porta " + PORT);

//query 1
dispatcher.addListener("POST","/api/servizio1",function(req,res){
  
  let dataStart = new Date(req["BODY"].dataStart);
  let dataEnd = new Date(req["BODY"].dataEnd);

  mongoClient.connect(CONNSTRING,function(err,client){
    if(!err)
    {
      //andiamo ad accedere al database 5B_studenti
      let db = client.db(DBNAME);
      let collection = db.collection("Vallauri");
    
      //dopo aver fatto i gruppi con $group, il recordset risultante avrà solo due colonne
      //ovvero _id e totale, tutti gli altri campi non saranno più visibili
      //NOTA: i nomi dei campi se sono a DESTRA dei due punti devono essere virgolettati
      //se sono a SINISTRA non è necessario che le abbiano
      let req = collection.aggregate([{$match : {"dob" : {$lte : dataEnd, $gte : dataStart}}},{$project : {"nome" : 1, "classe" : 1}}]).toArray();
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
  });
});

//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([
      {$project : {"classe" : 1, "mediaItaliano" : {$avg : "$italiano"}, "mediaInformatica" : {$avg : "$informatica"}, "mediaSistemi" : {$avg : "$sistemi"}, "mediaMatematica" : {$avg : "$matematica"}}},
      {$project : {"classe" : 1, "mediaStudente" : {$avg : ["$mediaItaliano","$mediaInformatica","$mediaSistemi","$mediaMatematica"]}}},
      {$group : {"_id" : "$classe", "mediaClasse" : {$avg : "$mediaStudente"}}},
      {$sort : {"mediaClasse" : -1}},
      {$project : {"mediaClasse" : {$round : ["$mediaClasse",2]}}}
      ]).toArray();
    req.then(function(data){
      console.log("Query numero 2 : ", data);
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
});

//query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.updateMany({genere : "f"},{$push: {informatica :  7 as never}});
    req.then(function(data){
      console.log("Query numero 3 : ", data);
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
});

//query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.deleteMany({sistemi : 3});
    req.then(function(data){
      console.log("Query numero 4 : ", data);
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
});

//query 5
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([{$group: {_id: "$classe", assenze: { $sum: "$assenze" }}}]).toArray();
    req.then(function(data){
      console.log("Query numero 5 : ", data);
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
});

//query 6
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([{$project : {"nome" : 1,"italiano" : 1}},{$unwind : "$italiano"},{$group : {"_id" : "$nome", "sommaVotiIta" : {$sum : "$italiano"}}},{$sort : {"sommaVotiIta" : -1}}]).toArray();
    req.then(function(data){
      console.log("Query numero 6 : ", data);
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
});

//query 7
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([{$sort : {"assenze" : -1}},{$limit : 1}]).toArray();
    req.then(function(data){
      console.log("Query numero 7 : ", data);
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
});

//query 8
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([{$match : {"genere" : "m","assenze" : {$gt : 15}}},{$project : {"nome" : 1, "assenze": 1}},{$sort : {"assenze" : -1}}]).toArray();
    req.then(function(data){
      console.log("Query numero 8 : ", data);
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
});

//query 8
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Vallauri");
    let req = collection.aggregate([{$match : {$or : [{"genere" : "f"},{"assenze": {$gt : 12}}]}},{$project : {"nome" : 1, "assenze": 1}},{$sort : {"assenze" : -1}}]).toArray();
    req.then(function(data){
      console.log("Query numero 8 : ", data);
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
});

//query 9
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Unicorns");
    let req = collection.aggregate([{$project : {"loves" : 1}},{$unwind : "$loves"},{$group : {"_id" : "$loves", "total" : {$sum : 1}}}]).toArray();
    req.then(function(data){
      console.log("Query numero 9 : ", data);
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
});