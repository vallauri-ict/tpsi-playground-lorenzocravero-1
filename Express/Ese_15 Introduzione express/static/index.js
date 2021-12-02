"use strict";

$(document).ready(function () {
  $("#btn1").on("click",function(){
    let request = inviaRichiesta("GET","/api/risorsa1",{"nome" : "pippo"});
    request.fail(errore);
    request.done(function(data){
      console.log(data.nome);
    })
  });

  $("#btn2").on("click",function(){
    let request = inviaRichiesta("POST","/api/risorsa2",{"nome" : "pippo"});
    request.fail(errore);
    request.done(function(data){
      console.log(data.nome);
    })
  });
});
