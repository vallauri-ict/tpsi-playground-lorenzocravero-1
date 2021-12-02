"use strict";

$(document).ready(function () {
  $("#btn1").on("click",function(){
    let request = inviaRichiesta("GET","/api/risorsa1",{"nome" : "Aurora"});
    request.fail(errore);
    request.done(function(data){
      console.log(data);
    })
  });

  $("#btn2").on("click",function(){
    let request = inviaRichiesta("PATCH","/api/risorsa2",{"nome" : "Unico","vampiri" : 3});
    request.fail(errore);
    request.done(function(data){
      console.log(data);
    })
  });

  //passiamo i parametri direttamente nell risorsa
  $("#btn3").on("click",function(){
    let request = inviaRichiesta("GET","/api/risorsa3/m/brown");
    request.fail(errore);
    request.done(function(data){
      console.log(data);
    })
  });

});
