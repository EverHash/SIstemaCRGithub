/*global document */

import { determinarSelectCurso, salir } from "./controlesNuevaListaDeudoresSeccion.js";
import {entrarPantallaSeleccionNuevaListaDeudores, 
        entrarTodasLasSeccionesDeudores, 
        entrarUnaSeccionListaDeudoresNueva,
        salirTiposNuevaListaDeudores} from "./controlesTiposNuevaListaDeudores.js";

import { salir as salirAnno } from "./controlesNuevaListaDeudoresAnno.js";
import {consultarDeudoresAnnoCompletoNuevaLista, consultarDeudoresSeccionNuevaLista } from "./nuevaListaDeudores.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";
import { imprimirNuevaListaDeudoresSeccion } from "./impresion.js";

//

document.getElementById("atrasSeleccionarTipoNuevaListaDeudores").addEventListener("click", salirTiposNuevaListaDeudores);

//AÑO

document.getElementById("todasLasSeccionesNuevaListaDeudores").addEventListener("click", entrarTodasLasSeccionesDeudores);
document.getElementById("nuevaListaDeudores").addEventListener("click", entrarPantallaSeleccionNuevaListaDeudores);
document.getElementById("buscarNuevaListaDeudoresAnnoCompleto").addEventListener("click", consultarDeudoresAnnoCompletoNuevaLista);
document.getElementById("atrasNuevaListaDeudoresAnno").addEventListener("click", salirAnno);
document.getElementById("flechaArribaAnnoEscolarListaDeudoresAnno").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarListaDeudoresAnno").addEventListener("click", flechaAbajoAnnoEscolar);

//SECCION

document.getElementById("seccionIndividualNuevaListaDeudores").addEventListener("click", entrarUnaSeccionListaDeudoresNueva);
document.getElementById("gradoDeInstruccionNuevaListaDeudores").addEventListener("change", determinarSelectCurso);
document.getElementById("atrasNuevaListaDeudoresSeccion").addEventListener("click", salir);
document.getElementById("buscarNuevaListaDeudoresSeccion").addEventListener("click", consultarDeudoresSeccionNuevaLista);
document.getElementById("flechaArribaAnnoEscolarListaDeudoresSeccion").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarListaDeudoresSeccion").addEventListener("click", flechaAbajoAnnoEscolar);
document.getElementById("imprimirNuevaListaDeudoresSeccion").addEventListener("click", imprimirNuevaListaDeudoresSeccion);