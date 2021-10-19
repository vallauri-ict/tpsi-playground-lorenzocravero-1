"use strict";

$(document).ready(function () {
  let lstRegioni = $("#lstRegioni");
  let table = $("#tbody");
  let regioni;
  let radios;

  let request = inviaRichiesta("get","/api/elenco");
  request.fail(errore);
  request.done(function(data){
    console.log(data);
    regioni = data;

    for (const regione of regioni) 
    {
      let opt = $("<option>");
      opt.text(`${regione.name} [${regione.stationcount} emittenti]`);
      opt.val(regione.name);
      opt.appendTo(lstRegioni);
    }

  })

  lstRegioni.on("change",function(){
    let request2 = inviaRichiesta("post","/api/radios",{"state" : lstRegioni.val()});
    request2.fail();
    request2.done(function(data){
      console.log(data);
      radios = data;
      table.empty();
      for (const radio of radios) 
      {
        let tr = $("<tr>");
        tr.appendTo(table);

        let td = $("<td>");
        let img = $("<img>");
        img.prop("src",radio.favicon);
        img.css("width","40px");
        img.appendTo(td);
        td.appendTo(tr);

        td = $("<td>");
        td.text(radio.name);
        td.appendTo(tr);

        td = $("<td>");
        td.text(radio.codec);
        td.appendTo(tr);

        td = $("<td>");
        td.text(radio.bitrate);
        td.appendTo(tr);

        td = $("<td>");
        td.text(radio.votes);
        td.appendTo(tr);

        td = $("<td>");
        img = $("<img>");
        img.prop("src","./like.jpg");
        img.on("click",like);
        img.prop("id",radio.id);
        img.css("width","40px");
        img.appendTo(td);
        td.appendTo(tr);
      }
    })
  })

  function like(){
    let id = $(this).prop("id");
    console.log(id);
    let _this = $(this);
    let request3 = inviaRichiesta("post","/api/like",{"id": id});
    request3.fail(errore);
    request3.done(function(data){
      _this.parent().prev().text(data.nLike);
    })
  }
});
