/*global document */

import {atrasEditorMensualidad,
        entrarEditorMensualidades,
        entrarTiposEdicion,
        atrasTiposEdicion
} from "./controlesTiposEdicion.js";

//ENTRAR Y SALIR DEL MENU DE TIPOS DE EXONERACION

document.getElementById("ediciones").addEventListener("click", entrarTiposEdicion);
document.getElementById("atrasTipoEdicion").addEventListener("click", atrasTiposEdicion);

//ENTRAR Y SALIR DEL EDITOR DE MENSUALIDADES

document.getElementById("mensualidadesExoneradas").addEventListener("click", entrarEditorMensualidades);
document.getElementById("atrasEditorMensualidad").addEventListener("click", atrasEditorMensualidad);
