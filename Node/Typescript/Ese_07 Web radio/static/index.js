"use strict"

$(document).ready(function(){
    let lstRegioni = $("#lstRegioni");
    let regioni;

    let request = inviaRichiesta("post","/api/contaRadio");
    request.fail(errore);
    request.done(function(data){
        alert("Json salvato correttamente");
    });

    let requestElenco = inviaRichiesta("get","/api/elenco");
    requestElenco.fail(errore);
    requestElenco.done(function(data){
        console.log(data);
        regioni = data;

        for (const regione of regioni) 
        {
            let opt = $("<option>");
            opt.prop("regione",regione);
            opt.on("click",visualizzaDettagli);
            opt.text(`${regione.name} [${regione.stationcount} emittenti]`);
            opt.appendTo(lstRegioni);
        }
    })

    function visualizzaDettagli(){
        //console.log($(this).prop("regione").name);
    }
})