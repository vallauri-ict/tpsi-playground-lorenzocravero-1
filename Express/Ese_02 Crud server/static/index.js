"use strict"

$(document).ready(function() {

    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let currentCollection = "";

    let request = inviaRichiesta("get", "api/getCollections");
    request.fail(errore)
    request.done(function(collections) {
	  console.log(collections);
    })


   
   
   
   
});