"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");
    let nazioni;
    let persone;

    _divDettagli.hide();
    
    //facciamo subito una richiesta al server per le nazioni
    let request = inviaRichiesta("get","/api/nazioni");
    request.fail(errore);
    request.done(function(data){
        nazioni = data["Nazioni"];
        //console.log(nazioni);

        for (const nazione of nazioni) 
        {
            let li = $("<li>");
            li.text(nazione);
            li.prop("nazione", nazione);
            li.appendTo(_lstNazioni);
        }
    });

    _lstNazioni.on("click", "li",function(){

        console.log(this.text);
        let currentNazione = _lstNazioni.text();
        console.log(currentNazione);
        let request = inviaRichiesta("get","/api/persone",{"nazione" : currentNazione});
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            persone = data;
        })
    });
 
})