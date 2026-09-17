/*global document */

export {noNecesitaVerificacion, verificarGrises, necesitaVerificacion, bloquearPalomillasVerificacion, setModoVerificacion, modoVerificacion};

let modoVerificacion;

function setModoVerificacion(cadena){
    modoVerificacion = cadena;
}

function noNecesitaVerificacion(){
    bloquearPalomillasVerificacion();
}

function necesitaVerificacion(){
    
}

function verificarGrises(){
    let tabla = document.getElementById("tablaDetallesPagoUnico");
    let contador = 0;
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        if(tabla.rows[i].cells[6].children[0].disabled == true){
            contador++;
        }
        if((tabla.rows[i].cells[6].children[0].disabled == true) && (contador == tabla.rows.length - 1)){
            return 1;
        }
    }
    return 0;
}

function bloquearPalomillasVerificacion(){
    let tabla = document.getElementById("tablaDetallesPagoUnico");
    for(let i = 1; i <= tabla.rows.length - 1; i++){
        tabla.rows[i].cells[6].children[0].disabled = true;
    }
}