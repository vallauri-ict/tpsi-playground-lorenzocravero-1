"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");
    let nazioni;
    let persone;
    let selectedNation;
    let first = _divDettagli.find("a").eq(0);
    let last = _divDettagli.find("a").eq(1);
    let next = _divDettagli.find("a").eq(2);
    let previous = _divDettagli.find("a").eq(3);
    let vetPersone = [];
    let i;
    let index;
    let click = true;

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
        if($(this).text())
        {
            selectedNation = $(this).text();
        }
        let request = inviaRichiesta("get","/api/elencoPersone",{"nazione" : selectedNation});
        request.fail(errore);
        request.done(function(data){
            persone = data["Persone"];
            _tabStudenti.empty();
            for (let i = 0; i < 5; i++) 
            {
                let aus = vetPersone.pop();
            }
            i = 0;
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
                btnDettagli.prop("name",persona.name);
                btnDettagli.prop("indice",i);
                vetPersone.push(persona.name);
                btnDettagli.on("click",visualizzaDettagli);
                btnDettagli.appendTo(td);

                td = $("<td>");
                td.appendTo(tr);
                let btnElimina = $("<button>");
                btnElimina.text("Elimina");
                btnElimina.appendTo(td);
                
                i++;
            }
            console.log(vetPersone);
        })

        _tabStudenti.on("click","button:contains(Elimina)",function(){
            let request = inviaRichiesta("DELETE","/api/elimina",{"person" : $(this).prop("name")});
            request.fail(errore);
            request.done(function(message){
                alert(message);
                visualizzaPersone();
            })
        });

        function visualizzaDettagli(){
            _divDettagli.show();
            if(click)
            {
                index = $(this).prop("indice"); 
            }
            let name = vetPersone[index];
            let request = inviaRichiesta("patch","/api/dettagli",{"name" : name});
            request.fail(errore);
            request.done(function(person){
                console.log(person);
                $(".card-img-top").prop("src",person.picture.thumbnail);
                $(".card-title").text(name);
                let s = `<b>Gender: </b> ${person.gender} </br>`;
                s += `<b>Address: </b> ${JSON.stringify(person.location)} </br>`;
                s += `<b>Email: </b> ${person.email} </br>`;
                s += `<b>Dob: </b> ${JSON.stringify(person.dob)} </br>`;
                $(".card-text").html(s);
            });
            click = true;
        }

        first.on("click",function(){
            console.log(index);
            index = 0;
            click = false;
            visualizzaDettagli();
        });
    
        last.on("click",function(){
            console.log(index);
            index = vetPersone.length -1;
            click = false;
            visualizzaDettagli();
        });
    
        next.on("click",function(){
            console.log(index);
            index+=1;
            click = false;
            visualizzaDettagli();
        });
    
        previous.on("click",function(){
            console.log(index);
		    index-=1;
            click = false;
            visualizzaDettagli();
        });
    }
})