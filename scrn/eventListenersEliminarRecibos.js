/*global document */

import { atrasEliminarRecibo, entrarEliminarRecibo, mostrarPantallaConfirmarBorrarRecibo, ocultarPantallaConfirmarBorrarRecibo } from "./controlesEliminarRecibos.js";
import { eliminarDatosPago, verTicketEliminar } from "./eliminarRecibos.js";

//ENTRAR

document.getElementById("eliminarRecibo").addEventListener("click", entrarEliminarRecibo);

//SALIR

document.getElementById("atrasEliminarRecibo").addEventListener("click", atrasEliminarRecibo);

//CONSULTAR TICKET

document.getElementById("botonConsultarEliminarRecibo").addEventListener("click", verTicketEliminar);

//MOSTRAR MODAL CONFIRMAR ELIMINAR RECIBO (BOTON ROJO DEBAJO DEL RECIBO)

document.getElementById("botonEliminarRecibo").addEventListener("click", mostrarPantallaConfirmarBorrarRecibo);

//OCULTAR MODAL CONFIRMAR ELIMINAR RECIBO (RESPUESTA NO)

document.getElementById("noBorrarReciboConfirmar").addEventListener("click", ocultarPantallaConfirmarBorrarRecibo);

//SI CONFIRMAR ELIMINAR RECIBO (RESPUESTA SI)

document.getElementById("borrarReciboConfirmar").addEventListener("click", eliminarDatosPago);