"use strict"


$(document).ready(function(){
    let mainWrapper = $("#mainWrapper");
    let btnAdd = $("#btnAdd");
    let lstCategories = $("<select>");
    let textArea = $("#newFact");
    lstCategories.appendTo($("#categoryList"));

    let categories;
    let currentCategory;
    let facts;
    let ids = [];
    let index

    let request = inviaRichiesta("get","/api/categories");
    request.fail(errore);
    request.done(function(data){
        categories = data;

        for (const category of categories) 
        {
            let opt = $("<option>");
            opt.text(category);
            opt.appendTo(lstCategories);
        }
    })

    caricaFacts("career");

    lstCategories.on("change",function(){
        caricaFacts(lstCategories.val());
    });

    btnAdd.on("click",function(){
        let addCategory = lstCategories.val();
        let addValue = textArea.text();

        //ultimo punto non terminato
        /*let request6 = inviaRichiesta("post","/api/add",{"categoria" : addCategory, "value" : addValue});
        request6.fail(errore);
        request6.done(function(message){
            alert(message);
        })*/
    });

    function caricaFacts(currentCategory){
        mainWrapper.empty();

        let request4 = inviaRichiesta("get","/api/facts",{"category" : currentCategory});
        request4.fail(errore);
        request4.done(function(data){
            console.log(data);
            facts = data;
            index = 1;
            for (const fact of facts) 
            {
                let chk = $("<input type=checkbox>");
                chk.prop("value",fact.id);
                chk.appendTo(mainWrapper);

                let span =$("<span>");
                span.text(fact.value);
                span.appendTo(mainWrapper);

                $("<br>").appendTo(mainWrapper);

                index++;
            }

            let btnInvia = $("<button>");
            btnInvia.text("invia");
            btnInvia.on("click",invia);
            btnInvia.prop("nChk",index);
            btnInvia.appendTo(mainWrapper);
        })
    }

    function invia(){
        console.log($(this).prop("nChk"));
        console.log(mainWrapper.children("input").eq(2).prop("value"));
        for (let i = 0; i < $(this).prop("nChk"); i++) 
        {
            if(mainWrapper.children("input").eq(i).prop("checked"))
            {
                ids.push(mainWrapper.children("input").eq(i).prop("value"));
            }
        }
        console.log(ids);

        let request5 = inviaRichiesta("post","/api/rate",ids);
        request5.fail(errore);
        request5.done(function(message){
            alert(message.ris);
        })
    }
})