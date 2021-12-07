"use strict"

$(document).ready(function(){

    let lstId = $("#lstId");
    let txtValue = $("#txtValue");
    let btnSalva = $("#btnSalva");
    let facts;
    let id;
    let value;

    let request = inviaRichiesta("get","/api/facts");
    request.fail(errore);
    request.done(function(data){
        //console.log(data);
        facts = data;

        for (const fact of facts) 
        {
            let opt = $("<option>");
            opt.appendTo(lstId);
            opt.val([fact["_id"],fact["value"]]);
            opt.text(fact["_id"]);
        }
        lstId.prop("selectedIndex",-1);
    });

    lstId.on("change",function(){
        id = $(this).val().split(",")[0];
        value = $(this).val().split(",")[1];

        txtValue.text(value);
    })

    txtValue.on("change",function(){
        value = txtValue.val();
    })

    btnSalva.on("click",function(){
        console.log(id);
        console.log(value);
        let request = inviaRichiesta("POST","/api/servizio1",{"id" : id, "value" : value});
        request.fail(errore);
        request.done(function(data){
            alert(data.ris);
        })
    })
})