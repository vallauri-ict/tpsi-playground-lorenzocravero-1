"use strict"

$(document).ready(function() {

    let divIntestazione = $("#divIntestazione");
    let divCollections = $("#divCollections");
    let divFilters = $(".card").eq(0);
    let table = $("#mainTable");
    let divDettagli = $("#divDettagli");
    let currentCollection = "";
    let tbody = $("table").children("tbody");

    divFilters.hide();

    let request = inviaRichiesta("get","/api/getCollections");
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

    //non posso fare input.click perchè all'onload non è stato ancora creato
    divCollections.on("click","input[type=radio]",function(){
        tbody.empty();
        currentCollection = $(this).val();
        let request = inviaRichiesta("GET","/api/"+currentCollection);
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            divIntestazione.find("strong").eq(0).text(currentCollection);
            divIntestazione.find("strong").eq(1).text(data.length);
            if(currentCollection == "unicorns")
            {
                divFilters.slideDown();
            }
            else
            {
                divFilters.slideUp();
            }

            //popolamento tabella
            for (const item of data) 
            {
                let tr = $("<tr>");
                tr.appendTo(tbody);

                let td = $("<td>");
                td.appendTo(tr);
                td.prop("width","30%");
                td.text(item["_id"]);
                td.prop("id",item["_id"]);
                td.on("click",visualDettagli);

                td = $("<td>");
                td.appendTo(tr);
                td.prop("width","40%");
                td.text(item["name"]);
                td.prop("id",item["_id"]);
                td.on("click",visualDettagli);

                td = $("<td>");
                td.appendTo(tr);
                td.prop("width","30%");
                //creiamo 3 div e basta perchè ci pensa il css
                for (let i = 0; i < 3; i++) 
                {
                    $("<div>").appendTo(td); 
                }
            }
        })
    }); 
    
    function visualDettagli(){
        let currentId = $(this).prop("id");
        let request = inviaRichiesta("GET","/api/"+currentCollection+"/"+currentId);
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            let content = "";
            for (const key in data[0]) 
            {
                content += "<strong>"+key+": </strong>" + data[0][key] + "<br>";
                divDettagli.html(content);
            }
        })
    }
});