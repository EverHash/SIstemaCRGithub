/*global document */

//ESTE DOCUMENTO TIENE TODOS LOS EVENT LISTENERS ASOCIADOS A LISTA DE PAGOS

import { consultarListaDePagos, botonAtrasListaPagos, botonSiguienteListaPagos } from "./listaPagos.js";
import { atrasListaDePagos } from "./controlesListaPagos.js";

//NAVEGACION

document.getElementById("PagosRecibidos").addEventListener("click", consultarListaDePagos);
document.getElementById("atrasListaDePagos").addEventListener("click", atrasListaDePagos);

//BOTONES INTERNOS

document.getElementById("listaSiguiente").addEventListener("click", botonSiguienteListaPagos);
document.getElementById("listaAtras").addEventListener("click", botonAtrasListaPagos);