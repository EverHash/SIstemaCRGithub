import { escribirTablaDatosReporte, mostrarModalDetallesReporte } from "./controlesReporteEdiciones.js";
import { mediadorColegioFecha } from "./controlesReportesColegioFecha.js";
import { Base, collection, doc, getDoc, getDocs, orderBy, query, where } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import { limpiarFilasTabla } from "./utilidadesTablas.js";

const err = -10;

export class consultorBDcolegioFecha{

    async obtenerReportes(fecha){

        try {

            mostrarPantallaCarga();

            let arrayReportes = [];

            let flagVacio = true;

            let coleccionEdiciones = await collection(Base, "reportesVariablesDiarias/");

            let obtenerReportesEdicion = await query(coleccionEdiciones, orderBy("numeroReporte", "desc"), where("fecha", "==", fecha));

            let documentosEdicion = await getDocs(obtenerReportesEdicion);
            documentosEdicion.forEach((documento) => {

                arrayReportes.push(documento.data());
                flagVacio = false;

            });
            
            if(flagVacio){

                ocultarPantallaCarga();
                mostrarPantallaError("No hay reportes para esta fecha");
                return err;

            }

            else return arrayReportes;

        } catch (error) {
            ocultarPantallaCarga();
            mostrarPantallaError(error);
            return err;
        }

    }

}


export async function verDetallesReporteColegio(){

    try {
        
        mostrarPantallaCarga();
    
        limpiarFilasTabla("tablaDetallesReporte", 1);
    
        let numeroReporte = this.parentNode.parentNode.children[2].textContent;
    
        let reporte = await getDoc(doc(Base, "reportesVariablesDiarias", numeroReporte));
    
        escribirTablaDatosReporte(reporte.data());
    
        mostrarModalDetallesReporte();
    
        ocultarPantallaCarga();
    } catch (error) {
        ocultarPantallaCarga();
        mostrarPantallaError(error);
    }

}

export async function consultarReportesFechaColegio(){

    let mediador = new mediadorColegioFecha();

    let fecha = mediador.obtenerFechas();

    if(fecha == err) return;

    mostrarPantallaCarga();

    mediador.ocultarTabla();

    mediador.limpiarTabla();

    let reportes = await mediador.obtenerReportes(fecha);

    if(reportes == err){

        ocultarPantallaCarga();
        return;

    }

    mediador.dibujarTabla(reportes);

    mediador.mostrarTabla();

    ocultarPantallaCarga();

}