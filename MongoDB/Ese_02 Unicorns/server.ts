"use strict"

import * as _http from 'http'
import * as _url from 'url'
import * as _fs from 'fs'
import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
import {Dispatcher} from "./dispatcher"   
let dispatcher = new Dispatcher()
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";

import {HEADERS} from "./headers";

//query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({"weight" : {$lte:800,$gte:700}}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 1: " , data);
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

//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$and:[{"loves" : "grape"},{"vampires" : {$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 2: " , data);
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

//query 3
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$or:[{"gender" : "f"},{"weight" : {$lt:700}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 3: " , data);
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

//query 4
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$and:[{"loves":{$in:["apple","grape"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 4: " , data);
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

//query 5
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$and:[{"loves":{$all:["grape","watermelon"]}},{"vampires":{$gt:60}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 5: " , data);
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

//query 6a
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$or:[{hair : "grey"},{hair : "brown"}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 6a: " , data);
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

//query 6b
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({hair:{$in:["brown","grey"]}}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 6b: " , data);
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

//query 7
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    collection.find({$and:[{vaccinated:{$exists:true}},{vaccinated : true}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 7: " , data);
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

//query 9
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    //trasformiamo la collezione in un vettore enumerativo e lo visualizziamo
    let regex = new RegExp("^A","i")
    collection.find({$and:[{name:regex},{gender:"f"}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 9: " , data);
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

//query 10
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({_id:new _mongodb.ObjectId("61823943699b9dda310fd39e")}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 10: " , data);
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

//query 11a
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({gender : "m"}).project({"name": 1, "vampires": 1}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11a: " , data);
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

//ese 11b
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11b: " , data);
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

//query 11c
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({gender : "m"}).project({name: 1, vampires: 1}).sort({vampires: -1, name: 1}).limit(3).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 11c: " , data);
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

//query 12
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({weight:{$gt:500}}).count(function(err,data){
      if(!err)
      {
        console.log("Query 12: Ci sono " + data + " unicorni più pesanti di 500 kg");
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

//query 13
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.findOne({name:"Aurora"},{projection: {weight:1, hair:1}},function(err,data){
      if(!err)
      {
        console.log("Query 12: Ci sono " + data + " unicorni più pesanti di 500 kg");
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
})

//query 14
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.find({$and:[{loves: {$in:['apple','carrot']}}, {weight: {$gt: 550}}]}).toArray(function(err,data){
      if(!err)
      {
        console.log("Query 14:  " , data);
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
})

//query 15
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.insertOne({"name": "topo", "gender": "m", "loves" : ['apple','grape']},function(err,data){
      if(!err)
      {
        console.log("Query 15a: unicorno inserito", data);
        collection.deleteMany({name : "topo"},function(err,data){
          if(!err)
          {
            console.log("Query 15b: unicorno eliminato correttamente ", data)
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
        console.log("errore esecuzione query " + err.message);
      }
    });
  }
  else
  {
    console.log("Errore nella connessione al database");
  }
})

//query 16
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    //prendiamo tramite il metodo collection l'elemento studenti
    let collection = db.collection("Unicorns");
    collection.updateOne({name:"Pilot"},{$inc:{vampires:1}},function(err,data){
      if(!err)
      {
        console.log("Query 16: vampiri incrementati ", data);
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
})
