"use strict";

import express from "express";
import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mongodb from "mongodb";
import * as _bodyparser from "body-parser";
import fileUpload, * as _fileUpload from "express-fileupload";
import { inherits } from "util";
import _cors from "cors";

const app = express();
const mongoClient = _mongodb.MongoClient;
const CONNSTRING =
  process.env.MONGODB_URI ||
  "mongodb://lorenzocravero:lollo@cluster0-shard-00-00.iwwbt.mongodb.net:27017,cluster0-shard-00-01.iwwbt.mongodb.net:27017,cluster0-shard-00-02.iwwbt.mongodb.net:27017/test?replicaSet=atlas-gt4d36-shard-0&ssl=true&authSource=admin"; //prendiamo la stringa di connessione da heroku
//const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
//const CONNSTRING = "mongodb://lorenzocravero:lollo@cluster0-shard-00-00.iwwbt.mongodb.net:27017,cluster0-shard-00-01.iwwbt.mongodb.net:27017,cluster0-shard-00-02.iwwbt.mongodb.net:27017/test?replicaSet=atlas-gt4d36-shard-0&ssl=true&authSource=admin";
const DBNAME = "5B";
const port = process.env.PORT || 1337;

//importiamo il file con le configurazioni cloudinary
import cloudinary from "./environment.json";

//lista che indica chi può accedere al server
const whitelist = [
  "http://localhost:4200",
  "http://localhost:1337",
  "https://lorenzocravero-crud-server.herokuapp.com",
  /*"http://lorenzocravero-crud-server.herokuapp.com"*/
];


const server = _http.createServer(app);

server.listen(port, () => {
  console.log("Server in ascolto sulla porta: " + port);
  init();
});

//creiamo una variabile globale per contenere una pagina di errore
let paginaErrore = "";

function init() {
  _fs.readFile("./static/error.html", (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  });
}

/* **************************************************** */
/// Elenco delle route di tipo middleware
/* **************************************************** */

// 1)log
app.use("/", (req, res, next) => {
  console.log("=>" + req.method + ":" + req.originalUrl);
  next();
});

// 2)static route
//va nella cartella static a cercare se trova un file col nome della risorsa,
//se lo trova li restituisce, altrimenti fa next ed il controllo passa all'app.use successiva
app.use("/", express.static("./static"));

// 3)route di lettura dei parametri POST
app.use("/", _bodyparser.json());
app.use("/", _bodyparser.urlencoded({ extended: true }));

// 4)log dei parametri
app.use("/", (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    console.log("      Parametri GET : ", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("      Parametri BODY : ", req.body);
  }
  next();
});

// 5) middleware cors
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    } else return callback(null, true);
  },
  credentials: true,
};
app.use("/", _cors(corsOptions) as any);

// 6) file upload
//stabiliamo la dimensione massima dell'immagine
app.use(fileUpload({
  "limits ": { "fileSize ": (10 * 1024 * 1024) } // 10 MB
 }));

/* **************************************************** */
/// Elenco delle route di risposta al client
/* **************************************************** */

//middleware di aprtura della connessione
app.use("/", function (req, res, next) {
  mongoClient.connect(CONNSTRING, function (err, client) {
    if (err) {
      res.status(503).send("Errore di connessione al database");
    } else {
      req["client"] = client;
      next();
    }
  });
});

//middleware per la richiesta get
app.get("/api/images", (req, res, next) => {
  let db = req["client"].db(DBNAME);
  let collection = db.collection("images");
  let request = collection.find().toArray();
  request.then(function (data) {
    res.send(data);
  });

  request.catch(function (err) {
    res.status(500).send("Errore nell'esecuzione della query" + err);
  });

  request.finally(function () {
    req["client"].close();
  });
});

app.post("/api/uploadBinary", function (req, res, next) {
  if (!req.files || Object.keys(req.files).length == 0) {
    res.status(400).send("No files were uploaded");
  } else {
    let file = req.files.img as _fileUpload.UploadedFile;
    file.mv(__dirname + "/static/img/" + file["name"], function (err) {
      if (err) {
        res.status(500).json(err.message);
      } else {
        let db = req["client"].db(DBNAME);
        let collection = db.collection("images");
        let user = { "username": req["body"].username, "img": file.name };
        let request = collection.insertOne(user);
        request.then(function (data) {
          res.send(data);
        });

        request.catch(function (err) {
          res.status(500).send("Errore nell'esecuzione della query" + err);
        });

        request.finally(function () {
          req["client"].close();
        });
      }
    });
  }
});

app.post("/api/uploadBase64",(req,res,next) => {
  let db = req["client"].db(DBNAME);
        let collection = db.collection("images");
        let request = collection.insertOne(req["body"]);
        request.then(function (data) {
          res.send(data);
        });

        request.catch(function (err) {
          res.status(500).send("Errore nell'esecuzione della query" + err);
        });

        request.finally(function () {
          req["client"].close();
        });
});

/* **************************************************** */
/// Elenco delle route di gestione dell'errore
/* **************************************************** */

app.use("/", (req, res, next) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("Risorsa non trovata");
  } else {
    res.send(paginaErrore);
  }
});

//route per la gestione dell'errore
app.use(function (err, req, res, next) {
  console.log(
    "************************** Errore lato server " +
      err.message +
      "*********************************"
  );
});
