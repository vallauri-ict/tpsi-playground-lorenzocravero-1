"use strict";

$(document).ready(function () {
  let divIntestazione = $("#divIntestazione");
  let divCollections = $("#divCollections");
  let divFilters = $(".card").eq(0);
  let table = $("#mainTable");
  let divDettagli = $("#divDettagli");
  let currentCollection = "";
  let tbody = $("table").children("tbody");

  divFilters.hide();

  let request = inviaRichiesta("get", "/api/getCollections");
  request.fail(errore);
  request.done(function (collections) {
    console.log(collections);

    //accediamo tramite dom alla label
    let label = divCollections.children("label");

    for (const collection of collections) {
      let clone = label.clone();
      clone.appendTo(divCollections);
      clone.children("input").val(collection.name);
      clone.children("span").text(collection.name);
      divCollections.append("<br>");
    }
    label.remove();
  });

  //non posso fare input.click perchè all'onload non è stato ancora creato
  divCollections.on(
    "click",
    "input[type=radio]",

    function () {
      tbody.empty();
      currentCollection = $(this).val();
      let request = inviaRichiesta("GET", "/api/" + currentCollection);
      request.fail(errore);
      request.done(aggiornaTabella);
    }
  );

  function aggiornaTabella(data){
    tbody.empty();
    console.log(data);
    divIntestazione.find("strong").eq(0).text(currentCollection);
    divIntestazione.find("strong").eq(1).text(data.length);
    if (currentCollection == "unicorns") {
      divFilters.slideDown();
    } else {
      divFilters.slideUp();
    }

    //popolamento tabella
    for (const item of data) {
      let tr = $("<tr>");
      tr.appendTo(tbody);

      let td = $("<td>");
      td.appendTo(tr);
      td.prop("width", "30%");
      td.text(item["_id"]);
      td.prop({ id: item["_id"], metodo: "GET" });
      td.on("click", visualDettagli);

      td = $("<td>");
      td.appendTo(tr);
      td.prop("width", "40%");
      td.text(item["name"]);
      td.prop({ id: item["_id"], metodo: "GET" });
      td.on("click", visualDettagli);

      td = $("<td>");
      td.appendTo(tr);
      td.prop("width", "30%");
      //creiamo 3 div e basta perchè ci pensa il css
      $("<div>")
        .appendTo(td)
        .prop({ id: item["_id"], metodo: "PATCH" })
        .on("click", visualDettagli);
      $("<div>")
        .appendTo(td)
        .prop({ id: item["_id"], metodo: "PUT" })
        .on("click", visualDettagli);
      $("<div>").appendTo(td).prop("id", item["_id"]).on("click", elimina);
    }
  }

  function visualDettagli() {
    let currentId = $(this).prop("id");
    let currentMethod = $(this).prop("metodo").toUpperCase();
    let request = inviaRichiesta(
      "GET",
      "/api/" + currentCollection + "/" + currentId
    );
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
      if (currentMethod == "GET") {
        let content = "";
        for (const key in data) {
          content += "<strong>" + key + ": </strong>" + data[key] + "<br>";
          divDettagli.html(content);
        }
      } else {
        divDettagli.empty();
        let txtArea = $("<textarea>");

        //il metodo delete permette di eliminare una chiave da un vettore
        //nel nostro caso eliminiamo l'id perchè non venga cambiato
        delete data["_id"];
        txtArea.val(JSON.stringify(data, null, 2));
        txtArea.appendTo(divDettagli);

        //scroll height è una property javascript che restituisce l'altezza di una textarea sulla base del contenuto
        txtArea.css({ height: txtArea.get(0).scrollHeight + "px" });

        visualPulsanteInvia(currentMethod, currentId);
      }
    });
  }

  $("#btnAdd").on("click", function () {
    divDettagli.empty();
    let txtArea = $("<textarea>");
    txtArea.val("{ }");
    txtArea.appendTo(divDettagli);
    visualPulsanteInvia("POST");
  });

  $("#btnFind").on("click", function () {
    let filter = {};
    let hair = $("#lstHair").children("option:selected").val();
    if (hair) filter["hair"] = hair.toLowerCase();

    let male = divFilters.find("input[type=checkbox]").first().is(":checked");
    let female = divFilters.find("input[type=checkbox]").last().is(":checked");
    if (male && !female) filter["gender"] = "m";
    else if (female && !male) filter["gender"] = "f";

    let request = inviaRichiesta("get", "/api/" + currentCollection, filter);
    request.fail(errore);
    request.done(aggiornaTabella);
  });

  function visualPulsanteInvia(metodo, id = "") {
    let btnInvia = $("<button>");
    btnInvia.text("Invia");
    btnInvia.appendTo(divDettagli);
    btnInvia.on("click", function () {
      let param = "";
      try {
        param = JSON.parse(divDettagli.children("textArea").val());
        console.log(param);
      } catch {
        alert("Json non valido");
        return;
      }

      let request = inviaRichiesta(
        metodo.toUpperCase(),
        "/api/" + currentCollection + "/" + id,
        param
      );
      request.fail(errore);
      request.done(function () {
        alert("Operazione eseguita correttamente");
        divDettagli.empty();
        aggiorna();
      });
    });
  }

  function elimina() {
    let request = inviaRichiesta(
      "DELETE",
      "/api/" + currentCollection + "/" + $(this).prop("id")
    );
    request.fail(errore);
    request.done(function (data) {
      alert("Documento eliminato correttamente");
      aggiorna();
    });
  }

  function aggiorna() {
    var event = jQuery.Event("click");
    event.target = divCollections.find("input[type=radio]:checked")[0];
    divCollections.trigger(event);
  }
});
