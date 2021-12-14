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

      //accediamo tramite dom alla label
      let label = divCollections.children("label");

      for (const collection of collections) 
      {
          let clone = label.clone();
          clone.appendTo(divCollections);
          clone.children("input").val(collection.name);
          clone.children("span").text(collection.name);
          divCollections.append(("<br>"));
      }
      label.remove();
    })

    divCollections.on("click","input[type=radio]",function(){
        alert("funziona");
    });


   
   
   
   
});