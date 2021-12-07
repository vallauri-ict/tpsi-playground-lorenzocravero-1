"use strict"

import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";

const base64Chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J","K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]


//query 1
mongoClient.connect(CONNSTRING,function(err,client){
    if(!err)
    {
      //andiamo ad accedere al database 5B_studenti
      let db = client.db(DBNAME);
      let collection = db.collection("Facts");
      let req = collection.find({$or : [{"categories" : "music"},{"score" : {$gt : 620}}]}).project({"_id" : 1, "categories" : 1, "score" : 1}).toArray();
      req.then(function(data){
        console.log(data);
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

//query 2
mongoClient.connect(CONNSTRING,function(err,client){
  //inserimento di un nuovo fact
  let newFact = "I'm inserting a new chuck norris fact";
  let newId = "";
  let newDate = new Date;
  for (let i = 0; i < 22; i++) 
  {
    newId+= base64Chars[Math.floor(Math.random() * base64Chars.length + 1)];
  }
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Facts");
    let req = collection.insertOne({"id" : newId, "created_at" : newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate(), "updated_at" : newDate.getFullYear() + "-" + newDate.getMonth() + "-" + newDate.getDate(), "icon_url" : "https://assets.chucknorris.host/img/avatar/chuck-norris.png", "url" : "https://api.chucknorris.io/jokes/" + newId, "score" : 0});
    req.then(function(data){
      console.log(data);
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
    let collection = db.collection("Facts");
    let req = collection.deleteMany({$and : [{"score" : 0}, {"created_at" : {$gt : "2021-11-15"}}]});
    req.then(function(data){
      console.log(data);
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
    let collection = db.collection("Facts");
    let req = collection.aggregate([{$unwind : "$categories"},{$group : {"_id" : "$categories", "mediaScore" : {$avg : "$score"}}},{$sort : {"mediaScore" : -1, "categories" : 1}},{"$project" : {"categories" : 1, "mediaScore" : {$round : "$mediaScore"}}}]).toArray();
    req.then(function(data){
      console.log(data);
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
    let collection = db.collection("Facts");
    let req = collection.distinct("categories");
    req.then(function(data){
      console.log(data);
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
    let collection = db.collection("Facts");
    let req = collection.aggregate([{$unwind : "$categories"},{$group : {"_id" : "$categories"}},{$sort : {"_id" : 1}}]).toArray();
    req.then(function(data){
      console.log(data);
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