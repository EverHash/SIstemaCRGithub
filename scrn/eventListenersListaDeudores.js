/*global document */

//ESTE DOCUMENTO CONTIENE LOS EVENT LISTENERS A LOS ELEMENTOS Y NAVEGACION DEL MODULO
//DE DEUDORES, ASI COMO TAMBIEN LAS CONSULTAS QUE ESTE REALIZA

import { listaDeudores } from "./listaDeudores.js";
import { entrarListaDeDeudores, gradoDeInstruccionDeudores, entrarListaGeneralDeudores, atrasListaGeneralDeudores, entrarListaDeudoresSeccion, atrasTiposListaDeudores, atrasListaDeudores } from "./controlesDeudores.js";
import { imprimirListaDeudores } from "./impresion.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";

//NAVEGACION

document.getElementById("listaDeudores").addEventListener("click", entrarListaDeDeudores);
document.getElementById("atrasTiposDeudores").addEventListener("click", atrasTiposListaDeudores);
document.getElementById("atrasListaDeudores").addEventListener("click", atrasListaDeudores);
document.getElementById("listaParticularDeudores").addEventListener("click", entrarListaDeudoresSeccion);
document.getElementById("listaGeneralDeudores").addEventListener("click", entrarListaGeneralDeudores);
document.getElementById("atrasListaGeneralDeudores").addEventListener("click", atrasListaGeneralDeudores);
document.getElementById("Grado-De-Instruccion-Deudores").addEventListener("change", gradoDeInstruccionDeudores);

//OTROS BOTONES

document.getElementById("BotonBuscarDeudores").addEventListener("click", listaDeudores);
document.getElementById("flechaArribaAnnoEscolarDeudores").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarDeudores").addEventListener("click", flechaAbajoAnnoEscolar);


document.getElementById("imprimirListaDeudores").addEventListener("click", imprimirListaDeudores);