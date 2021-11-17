"use strict"

import * as _mongodb from 'mongodb'
const mongoClient = _mongodb.MongoClient;
const CONNSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";


//adotteremo l'approccio con le promise(come per ajax)
//nel caso in cui dovessimo aprire due promise annidate dovremmo andare a aprire il secondo client nella then
//della prima req e chiuderlo sempre li dentro

//query 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Orders");
  
    //dopo aver fatto i gruppi con $group, il recordset risultante avrà solo due colonne
    //ovvero _id e totale, tutti gli altri campi non saranno più visibili
    //NOTA: i nomi dei campi se sono a DESTRA dei due punti devono essere virgolettati
    //se sono a SINISTRA non è necessario che le abbiano
    let req = collection.aggregate([
      {$match:{status: 'A'}},
      {$group:{_id: "$cust_id", totale: {$sum : "$amount"}}},
      {$sort : {totale: -1}}
    ]).toArray();
    req.then(function(data){
      console.log("Query 1: ", data);
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
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Orders");
    let req = collection.aggregate([
      //questa query ragguppa i dati per cust_id in una tabella con 3 colonne
      {$group:{_id: "$cust_id", avgAmount: {$avg : "$amount"}, avgTotal : {$avg: {$multiply : ["$qta" ,"$amount"]}}}}
    ]).toArray();
    req.then(function(data){
      console.log("Query 2: ", data);
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
    let collection = db.collection("Unicorns");
    let req = collection.aggregate([{"$match" : {"gender" : {$exists : true}}},{$group:{"_id":"$gender","totale" : {"$sum" : 1}}}]).toArray();
    req.then(function(data){
      console.log("Query 3 : ", data);
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
    let collection = db.collection("Unicorns");
    let req = collection.aggregate([{$group:{"_id": {"gender" : "$gender"},"mediaVampiri" : {"$avg" : "$vampires"}}}]).toArray();
    req.then(function(data){
      console.log("Query 4 : ", data);
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
    let collection = db.collection("Unicorns");
    let req = collection.aggregate([{$group:{"_id": {"gender" : "$gender", "hair" : "$hair"},"nEsemplari" : {"$sum" : 1}}},{"$sort" : {"nEsemplari" : -1, "_id" : -1}}]).toArray();
    req.then(function(data){
      console.log("Query 5 : ", data);
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
    let collection = db.collection("Unicorns");
    //in questo caso dobbiamo fare un gruppo fittizio lasciando l'id vuoto perchè ci serve una media su TUTTO 
    //il recordset
    let req = collection.aggregate([{$group:{"_id": {},"mediaVampiri" : {"$avg" : "$vampires"}}},{"$project" : {"_id" : 0, "mediaVampiri" : {$round : "$mediaVampiri"}}}]).toArray();
    req.then(function(data){
      console.log("Query 6 : ", data);
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
    let collection = db.collection("Quizzes");
    //in questo caso dobbiamo fare un gruppo fittizio lasciando l'id vuoto perchè ci serve una media su TUTTO 
    //il recordset
    let req = collection.aggregate([
      {$project : {"quizAvg" : {$avg : "$quizzes"},"labAvg" : {$avg : "$labs"}, "examAvg" : {$avg : ["$final", "$midterm"]}}},
      {$project : {"_id" : 0, "quizAvg" : {$round : "$quizAvg"}, "labAvg" : {$round : "$labAvg"}, "examAvg" : {$round : "$examAvg"}}},
      {$group : {"_id" : {}, "mediaQuiz" : {$avg : "$quizAvg"}, "mediaLab" : {$avg : "$labAvg"}, "mediaExam": {$avg : "$examAvg"}}}]).toArray();
    req.then(function(data){
      console.log("Query 7 della madonna : ", data);
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
    let collection = db.collection("Students");
    //in questo caso dobbiamo fare un gruppo fittizio lasciando l'id vuoto perchè ci serve una media su TUTTO 
    //il recordset
    let req = collection.aggregate([
      {$match : {"genere" : "f"}},
      {$project : {"nome" : 1, "mediaVoto" : {$avg : "$voti"}}},
      {$sort : {"mediaVoto": -1}},
      {$skip : 1},
      {$limit : 1}
    ]).toArray();
    req.then(function(data){
      console.log("Query 8 : ", data);
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
mongoClient.connect(CONNSTRING, function (err, client) {
  if (!err) {
    let regex = new RegExp("f", "i"); //con la i la ricerca è case unsensitive
    let db = client.db(DBNAME);
    let collection = db.collection("Orders");
    let req = collection.aggregate([{ $project: { "status": 1, "nDettagli": 1 } },
     { $unwind: "$nDettagli" }, 
     { $group: { _id: "$status", "sommaDettagli": { $sum: "$nDettagli" } } }

    ]).toArray();
    req.then(function (data) {
      console.log("Query 9 : ", data);
    });
    req.catch(function (err) {
      console.log("errore nell'esecuzione della query " + err);
    });
    req.finally(function () {
      client.close();
    })
  }
  else {
    console.log("Errore nella connessione al database");
  }
});


//QUERY BONUS

//query bonus 1
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Students");
    let req = collection.aggregate([{$group : {_id : "$classe" , "nAlunni" : {$sum : 1}}}]).toArray();
    req.then(function(data){
      console.log("Query bonus 1 : ", data);
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

//quey bonus 2
mongoClient.connect(CONNSTRING,function(err,client){
  if(!err)
  {
    //andiamo ad accedere al database 5B_studenti
    let db = client.db(DBNAME);
    let collection = db.collection("Students");
    let req = collection.aggregate([{$group : {_id : "$classe", "mediaClasse" : {$avg : {$avg : "$voti"}}}}]).toArray();
    req.then(function(data){
      console.log("Query bonus 2 : ", data);
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
