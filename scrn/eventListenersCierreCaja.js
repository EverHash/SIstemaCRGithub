/*global document */

import {atrasCierreCaja, entrarCierreDeCaja, seleccionarAnnoCierreCaja, seleccionarMesCierreCaja} from "./controlesCierreCaja.js";
import { calcularCierre } from "./cierreCaja.js";

//NAVEGACION

document.getElementById("atrasCierreCaja").addEventListener("click", atrasCierreCaja);
document.getElementById("CierreDeCaja").addEventListener("click", entrarCierreDeCaja);

//ELEMENTOS HMTL

document.getElementById("SeleccionarAnno").addEventListener("change", seleccionarAnnoCierreCaja);
document.getElementById("SeleccionarMes").addEventListener("change", seleccionarMesCierreCaja);
document.getElementById("BotonCalcularCierre").addEventListener("click", calcularCierre);