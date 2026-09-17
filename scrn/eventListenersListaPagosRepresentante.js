/*global document */

import {entrarPagosRepresentante, 
        atrasPagosRepresentante
 } from "./controlesPagosRepresentante.js";

 import { buscarPagosRepresentante } from "./pagosRepresentante.js";
 import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("pagosPorRepresentante").addEventListener("click", entrarPagosRepresentante);
document.getElementById("atrasPagosRepresentante").addEventListener("click", atrasPagosRepresentante);

//BOTON DE BUSCAR

document.getElementById("BotonObtenerPagosRepresentante").addEventListener("click", buscarPagosRepresentante);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaPagosRepresentante").addEventListener("click", pegarContenidoPortapapeles);