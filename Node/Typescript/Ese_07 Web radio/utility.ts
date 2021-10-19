//questa è l'utility che legge il file degli stati e lo salva su disco

import radios from './radios.json';
import states from "./states.json";
import * as _fs from 'fs';

//la prima function riporta a zero tutti i contatori
reset();

//la seconda li incrementa correttamente
leggiFile();


function reset(){
    for (const state of states) 
    {
        state.stationcount = "0";    
    }
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Json resettato");
        }
    })
}

function leggiFile(){
    for (const state of states) 
    {
        for (const radio of radios) 
        {
            if(state.name == radio.state)
            {
                let aus = parseInt(state.stationcount);
                aus++;
                state.stationcount = aus.toString();
            }
        }
    }

    //dopo aver incrementato i contatori salvo il file su disco
    _fs.writeFile("./states.json",JSON.stringify(states),function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Json salvato correttamente su disco");
        }
    })
}

