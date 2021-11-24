"use strict"

$(document).ready(function(){
   let btnInvia = $("#btnInvia");

   btnInvia.on("click",function(){
      let dataStart = $("#txtDataStart").val();
      let dataEnd = $("#txtDataEnd").val();
      
      let request = inviaRichiesta("POST","/api/servizio1",{"dataStart" : dataStart, "dataEnd" : dataEnd});
      request.fail(errore);
      request.done(function(data){
          console.log(data);
      })
   })
})