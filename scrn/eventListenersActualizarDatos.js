/*global document */

import { entrarActualizarDatos, 
         atrasActualizarDatos,
         paginaSiguienteActualizar,
         paginaAnteriorActualizar
        } from "./controlesActualizarDatos.js";

import { obtenerDatosActualizar, actualizarDatos } from "./actualizarDatos.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("actualizarDatos").addEventListener("click", entrarActualizarDatos);
document.getElementById("atrasActualizarDatos").addEventListener("click", atrasActualizarDatos);

//BOTONES DE NAVEGACION DE FORMULARIO

document.getElementById("actualizarSiguiente").addEventListener("click", paginaSiguienteActualizar);
document.getElementById("actualizarAtras").addEventListener("click", paginaAnteriorActualizar);

//CONEXION A LA BASE

document.getElementById("buscarRepresentanteActualizarDatos").addEventListener("click", obtenerDatosActualizar);
document.getElementById("botonActualizarDatos").addEventListener("click", actualizarDatos);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaActualizarDatos").addEventListener("click", pegarContenidoPortapapeles);