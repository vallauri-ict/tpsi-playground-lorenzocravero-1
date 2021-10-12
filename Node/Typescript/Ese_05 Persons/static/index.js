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

        for (const nazione of nazioni) 
        {
            let li = $("<li>");
            li.text(nazione);
            li.appendTo(_lstNazioni);    
        }
    });

    _lstNazioni.on("click","li",visualizzaPersone);

    function visualizzaPersone(){
        let currentNazione = $(this).text();
        console.log(currentNazione);

        let request = inviaRichiesta("get","/api/elencoPersone",{"nazione" : currentNazione});
        request.fail(errore);
        request.done(function(data){
            //console.log(data);
            persone = data["Persone"];
            _tabStudenti.empty();
            for (const persona of persone) 
            {
                let tr = $("<tr>");
                tr.appendTo(_tabStudenti);

                let td = $("<td>");
                td.appendTo(tr);
                td.text(persona.name);

                td = $("<td>");
                td.appendTo(tr);
                td.text(persona.city);

                td = $("<td>");
                td.appendTo(tr);
                td.text(persona.state);

                td = $("<td>");
                td.appendTo(tr);
                td.text(persona.cell);

                td = $("<td>");
                td.appendTo(tr);
                let btnDettagli = $("<button>");
                btnDettagli.text("Dettagli");
                btnDettagli.prop("persona",persona);
                btnDettagli.on("click",visualizzaDettagli);
                btnDettagli.appendTo(td);

                td = $("<td>");
                td.appendTo(tr);
                let btnElimina = $("<button>");
                btnElimina.text("Elimina");
                btnElimina.on("click",elimina);
                btnElimina.appendTo(td);
            }
        })

        function visualizzaDettagli(){
            console.log($(this).prop("persona").name);
        }
    
        function elimina(){
            
        }
    }

})