//sezione del web server ch si occupa della gestione delle richieste
import *  as _http from 'http';
import *  as _url from 'url';
import *  as _fs from 'fs';
import *  as _mime from 'mime';
import * as _querystring from 'query-string';
import { throws } from 'assert/strict';
import { json } from 'stream/consumers';
import { brotliDecompress } from 'zlib';


import  {HEADERS} from './headers' //require perchè non è typescript e essendo di piccole dimensioni va bene
let paginaErrore: string;

export class Dispatcher {  //sintassi classi Es6
    prompt: string = ">>> "
    //any perchè è un json e va bene costituito da diverse chiai che costituiscono i metodi http
    listeners: any = {
        //ogni listener è csotituito da un json es:{risorsa:callback}  i listeners sono suddivisi in base al metodo di chiamata  
        "GET": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }
    constructor() {
        init();
    }
    //deve andare a registrare il listener dentro il vettore dei listeners
    addListener(method: string, resource: string, callBack: any) {
        method = method.toUpperCase();//mi restituisce il valore in maiuscolo
        /*if (this.listeners[method]) { }*/
        if (method in this.listeners) { //vedere se una chiave è in un json
            this.listeners[method][resource] = callBack; //crea una nuova chiave che si chiama risorsa e come valore mette una callback
        } else {
            throw new Error("metodo non valido");
        }
    }

    dispatch(req, res) { //se la richiesta è get parte subito se l' evento non è get prendiamo i parametri 
        let metodo = req.method.toUpperCase();
        if (metodo == 'GET') {
            this.innerDispatch(req, res); //non uso this perchè non è membro di classe
        } else {
            let parametriBody = '';
            let _this=this; //salviam il puntatore perchè successimamente this sara riferito a req.on invece prima non va fatto eperchè siamo interno alla nostra classe
            req.on('data', function (data) {
                parametriBody += data;
            })
            let jsonParameters = {};
            req.on('end', function () {
                //se la conversione va bene sono json se non va bene è urlencoded
                try { //parto con l ipotesi che i paramtri siamo json se fallisce significa che sono urlen coded
                    jsonParameters = JSON.parse(parametriBody); //prendiamo i paraetri e li convertiamo in json

                } catch (error) {
                    jsonParameters = _querystring.parse(parametriBody)
                }
                finally {
                    //salviamo i paramtri 
                    req["BODY"] = jsonParameters;
                    _this.innerDispatch(req, res);

                }
            })
        }
       
    }
    innerDispatch(req, res) { //quando arriva una richiesta va a vedere se è un servizio e lo cerca dentro il vettore se c ' chiama la callback se non cè da err
        //ci prendiamo le caratteristiche
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa: any = url.pathname;
        let parametri = url.query;//parametri è un jso
        console.log(`${this.prompt}  ${metodo}:  ${risorsa} ${JSON.stringify(parametri)}`);
        if (req["BODY"]) {
            console.log(`    ${JSON.stringify(req["BODY"])}  `);
        }
        req["GET"] = parametri;

        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) {
                let callback = this.listeners[metodo][risorsa];
                //lancio in esecuzione la callback
                callback(req, res);
            } else {
                //il client si aspetta un json  ma in caso di errore gli mandiamo una string
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        } else {
            staticListener(req, res, risorsa); //la usa solo il dispatcher 
        }
    }
}


function staticListener(req: any, res: any, risorsa: any) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let filename = "./static" + risorsa; //risorsa starta sempre per /
    _fs.readFile(filename, function (err, data) {
        if (!err) {
            let header = { "Content-Type": _mime.getType(filename) };
            res.writeHead(200, header);
            res.write(data);
            res.end();
        } else {
            console.log()
            //il client si aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}
function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = ("<h1>Pagina non trovata!!</h1>")
        }
    })
}


