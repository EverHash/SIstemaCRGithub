/*global document */

import {atrasEdicionAbonos, 
        agregarFilaAbonos, 
        entrarEdicionAbonos,
        cerrarModalEditarAbonos,
        mostrarModalEditarAbonos,
        cerrarModalBorrarContenedor} from "./controlesEdicionAbonos.js";
import { consultarRepresentante, editarAbonos, eliminarAbono } from "./edicionAbonos.js";
import { pegarContenidoPortapapeles } from "./portapapeles.js";

//NAVEGACION

document.getElementById("editorAbonos").addEventListener("click", entrarEdicionAbonos);
document.getElementById("atrasEdicionAbonos").addEventListener("click", atrasEdicionAbonos);

//BOTONES

document.getElementById("consultarRepresentanteEdicionAbonos").addEventListener("click", consultarRepresentante);
document.getElementById("editarAbonosRepresentante").addEventListener("click", mostrarModalEditarAbonos);
document.getElementById("agregarContenedorEditarAbono").addEventListener("click", agregarFilaAbonos);

//BOTONES MODAL CONFIRMAR EDITAR CONTENEDORES

document.getElementById("confirmarEditarAbonos").addEventListener("click", editarAbonos);
document.getElementById("noEditarAbonos").addEventListener("click", cerrarModalEditarAbonos);

//PORTAPAPELES

document.getElementById("pegarCedulaCopiadaEdicionAbonos").addEventListener("click", pegarContenidoPortapapeles);

//MODAL ELIMINAR CONTENEDOR

document.getElementById("confirmarBorrarContenedor").addEventListener("click", eliminarAbono);
document.getElementById("noBorrarContenedor").addEventListener("click", cerrarModalBorrarContenedor);
