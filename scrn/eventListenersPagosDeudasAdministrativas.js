/* CODIGO REMUERTO, MUERTISIMO, AQUI NO HAY NADA RELEVANTE */
/* CODIGO REMUERTO, MUERTISIMO, AQUI NO HAY NADA RELEVANTE */
/* CODIGO REMUERTO, MUERTISIMO, AQUI NO HAY NADA RELEVANTE */

/*global document */

import { atrasDeudasAdministrativas, entrarDeudasAdministrativas, seleccionarPagarTodasLasDeudas } from "./controlesDeudasAdministrativas.js";

//NAVEGACION

document.getElementById("pagarDeudaAdministrativo").addEventListener("click", entrarDeudasAdministrativas);
document.getElementById("atrasPagosPendientesAdministrativos").addEventListener("click", atrasDeudasAdministrativas);

//CHECKBOX DE LA TABLA

document.getElementById("casillaPagosAdministrativos").addEventListener("change", seleccionarPagarTodasLasDeudas);