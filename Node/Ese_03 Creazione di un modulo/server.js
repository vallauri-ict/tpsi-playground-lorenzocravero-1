//server.js sarà il nostro main
let modulo = require("modulo.js");

//richiamiamo una funzione anonima ed una con nome
//in questo caso le due funzioni anonime hanno un numero di parametri diverso quindi non vi è conflitto fra omonimi
modulo(2,4); 
modulo.sottr(5,4);

//richiamiamo non una funzione ma un attributo del modulo
console.log(modulo.json.nome);
//richiamo la function setNome tramite la property json del modulo
modulo.json.setNome("luca");
console.log(modulo.json.nome);
console.log(modulo.myClass.nome);
