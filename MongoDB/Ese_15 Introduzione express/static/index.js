"use strict";

$(document).ready(function () {
  let select = $("#select");
  let textarea = $("#textarea");
  let button = $("#salva");


  
  let request = inviaRichiesta("GET", "/api/getIds");
  request.catch(errore);
  request.then((data) => {
    for (const fact of data) {
      let option = $("<option>");
      option.appendTo(select);
      option.text(fact._id);
      option.val(fact.value);
    }
    $('#select').val("3y7vnqsvtvuvvmhtuqjuma").change();
    
 
  });


  $("#select").on("change", function () {
    textarea.empty();
    textarea.text($(this).val());
  });

  button.click(function () {
    let textChanged = textarea.val();
    let id = $("#select option:selected").text();

    let requestSave = inviaRichiesta("POST", "/api/update", {
      _id: id,
      _textChanged: textChanged,
    });
    requestSave.catch(errore);
    requestSave.then((data) => {
      console.log(data);
    });
  });
});
