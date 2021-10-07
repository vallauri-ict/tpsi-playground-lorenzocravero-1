$(document).ready(function() {

    $("#btnInvia1").on("click", function() {
        let request = inviaRichiesta("post", "/api/servizio1", {"nome":"davide"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });

    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio2", {"nome":"maurizio"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
});
