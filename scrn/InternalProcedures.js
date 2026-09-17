/*global document */

import {obtenerPrecioInscripcion,
        obtenerPrecioAdministrativo,
        inscribirEstudiante,
        efectuarPagoIndividual,
        realizarPagoAdministrativo,
        listaGeneralDeudores} from "../scrn/firebase.js";
import { limpiarMetodosPago } from "./controlesPagos.js";
        

function subcadenaHastaOcurrenciaDeCaracter(cadena, caracter){
    let resultado = "";
    for(let i = 0; i <= cadena.length - 1; i++){
        if(cadena[i] === caracter){
            break;
        }
        resultado += cadena[i];
    }
    return resultado;
}

/*document.getElementById("Seleccionar-curso").addEventListener("change", function(){
    if(this.selectedIndex == 14 && this.parentNode.parentNode.children[4].children[0].selectedIndex == 3){
            this.parentNode.parentNode.children[3].children[0].style.display = "none";
            this.parentNode.parentNode.children[3].children[1].style.display = "block";
    }
    else{
        this.parentNode.parentNode.children[3].children[0].style.display = "block";
        this.parentNode.parentNode.children[3].children[1].style.display = "none";
    }
});*/


document.getElementById("reinscribirEstudiante").addEventListener("click", entrarReinscribirEstudiante);
document.getElementById("reinscribirSiguiente").addEventListener("click", paginaSiguienteReinscripcion);
document.getElementById("reinscribirAtras").addEventListener("click", paginaAnteriorReinscripcion);