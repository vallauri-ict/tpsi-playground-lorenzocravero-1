"use strict"

import express from "express";
import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mongodb from "mongodb";
import * as _bodyparser from "body-parser";
import fileUpload, * as _fileUpload from "express-fileupload";
import { inherits } from "util";
import _cors from "cors";
import cloudinary, { UploadApiResponse } from "cloudinary";
import environment from "./environment.json";
import { execPath } from "process";
import { url } from "inspector";

const app = express();
const mongoClient = _mongodb.MongoClient;
const DBNAME = "5B";
const port = process.env.PORT || 1337;

//impostazione config cloudinary
cloudinary.v2.config({
  cloud_name: environment.CLOUDINARY.cloud_name,
  api_key: environment.CLOUDINARY.apy_key,
  api_secret: environment.CLOUDINARY.api_secret,
});

//lista che indica chi può accedere al server
const whitelist = [
  "http://localhost:4200",
  "http://localhost:1337",
  "https://lorenzocravero-crud-server.herokuapp.com",
  /*"http://lorenzocravero-crud-server.herokuapp.com"*/
];

//creazione e ascolto del server
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

// 3)route di lettura dei parametri POST con impostazione del limite per img base64
app.use("/", _bodyparser.json({"limit" : "10mb"}));
app.use("/", _bodyparser.urlencoded({ extended: true , "limit" : "10mb"}));

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

// 6) binary file upload
app.use(
  fileUpload({
    "limits ": { "fileSize ": 10 * 1024 * 1024 }, // 10 MB --> limita la dimensione dell'immagine
  })
);


/* **************************************************** */
/// Elenco delle route di risposta al client
/* **************************************************** */

//middleware di apertura della connessione
app.use("/", function (req, res, next) {
  mongoClient.connect(process.env.MONGODB_URI || environment.CONNECTIONSTRING, function (err, client) {
    if (err) {
      res.status(503).send("Errore di connessione al database");
    } else {
      req["client"] = client;
      next();
    }
  });
});

//middleware GET
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

//middleware POST
app.post("/api/uploadBinary", function (req, res, next) {
  if (!req.files || Object.keys(req.files).length == 0) {
    res.status(400).send("No files were uploaded");
  } else {
    let file = req.files.img as _fileUpload.UploadedFile;
    file.mv("./static/img/" + file["name"], function (err) {
      if (err) {
        res.status(500).json(err.message);
      } else {
        let db = req["client"].db(DBNAME);
        let collection = db.collection("images");
        let user = { username: req["body"].username, img: file.name };
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

app.post("/api/uploadBase64", (req, res, next) => {
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

app.post("/api/cloudinaryBase64", (req, res, next) => {
  cloudinary.v2.uploader
    .upload(req["body"].img, {
      folder: "5binf/Ese_03 Upload",
      use_filename: true,
    })
    .catch((error) => {
      res.status(500).send("error uploading file");
    })
    .then((result: UploadApiResponse) => {
      //res.send({"url":result.secure_url})
      let db = req["client"].db(DBNAME);
      let collection = db.collection("images");
      let user = {
        username: req["body"].username,
        img: result.secure_url,
      };
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
    });
});



app.post("/api/cloudinaryBinary", (req, res, next) => {
  if (!req.files || Object.keys(req.files).length == 0 || !req.body.username) 
  {
    res.status(400).send("No files were uploaded");
  } 
  else {
    let file = req.files.img as fileUpload.UploadedFile;
    let path = './static/img/' + file["name"];
    file.mv(path, function (err) {
      if (err){
        res.status(500).json(err.message);
      }
      else {
        cloudinary.v2.uploader.upload(path, { folder: "5binf/Ese_03 Upload", use_filename: true }) //il primo è il path dove leggere l immagine 
        .catch((error) => {
          res.status(500).send("error uploading file to cloudinary")
        })
        .then((result: UploadApiResponse) => {
          //res.send({"url":result.secure_url})
          let db = req["client"].db(DBNAME);
          let collection = db.collection("images");
          let user = {
            "username": req.body.username,
            "img": result.secure_url
          }
          let request = collection.insertOne(user);
          request.then((data) => {
            res.send(data);
          });
          request.catch((err) => {
            res.status(503).send("Sintax error in the query");
          });
          request.finally(() => {
            req["client"].close();
          });
        })
      }
    })
  }
})

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
