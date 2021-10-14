"use strict"

$(document).ready(function(){
    let wrapper = $("#wrapper");
    let news = $("#news");
    let notizie;
    let request = inviaRichiesta("get","/api/elenco");
    request.fail(errore);
    request.done(function(data){
        console.log(data);
        notizie = data;

        for (const notizia of notizie) 
        {
            let div = $("<div>");
            div.appendTo(wrapper);

            let span = $("<span>");
            span.addClass("titolo");
            span.text(notizia.titolo);
            span.appendTo(div);

            let a = $("<a>");
            a.text("Leggi");
            a.prop("notizia",notizia);
            a.prop("href","#");
            a.on("click",visualizzaDettagli);
            a.appendTo(div);

            span = $("<span>");
            span.addClass("nVis");
            span.text("visualizzato " + notizia.visualizzazioni + " volte");
            span.appendTo(div);

            $("<br>").appendTo(div);

        }
    });

    function visualizzaDettagli(){
        let titolo = $(this).prop("notizia").titolo;
        let nomeFile = $(this).prop("notizia").file;
        let request = inviaRichiesta("post","/api/dettagli",{"nomeFile" : nomeFile, "titolo" : titolo});
        request.fail(errore);
        request.done(function(message){
            news.html(message);
        })
    }
})