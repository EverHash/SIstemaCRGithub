/*global document */

import { gradoDeInstruccionDatosSeccion, atrasDatosSeccion, entrarDatosSeccion } from "./controlesDatosSeccion.js";
import {listaDatosSeccion} from "./datosSeccion.js";
import { flechaAbajoAnnoEscolar, flechaArribaAnnoEscolar } from "./utilidades.js";

//NAVEGACION

document.getElementById("atrasDatosSeccion").addEventListener("click", atrasDatosSeccion);
document.getElementById("datosSeccion").addEventListener("click", entrarDatosSeccion);

//ELEMENTOS HTML

document.getElementById("Grado-De-Instruccion-DatosSeccion").addEventListener("change", gradoDeInstruccionDatosSeccion);
document.getElementById("BotonBuscarDatosSeccion").addEventListener("click", listaDatosSeccion);
document.getElementById("flechaArribaAnnoEscolarDatosSeccion").addEventListener("click", flechaArribaAnnoEscolar);
document.getElementById("flechaAbajoAnnoEscolarDatosSeccion").addEventListener("click", flechaAbajoAnnoEscolar);