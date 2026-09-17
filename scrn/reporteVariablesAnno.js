import { mediadorVariablesAnno } from "./controlesReporteVariablesAnno.js";
import { Base, doc, getDoc } from "./firebase.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";

const err = -10;

export class consultorBDreporteAnno{

    async obtenerReporte(anno){

        try {

            mostrarPantallaCarga();

            let documentoReporte = await doc(Base, "reportesVariablesAnuales", anno);

            let obtenerReportesAnno = await getDoc(documentoReporte);    

            if(!obtenerReportesAnno.exists()){

                ocultarPantallaCarga();
                mostrarPantallaError("No hay reportes para el año consultado");
                return err;

            }

            ocultarPantallaCarga();

            let datosObtenidos = obtenerReportesAnno.data();

            return datosObtenidos;
            
        } catch (error) {
            ocultarPantallaCarga();
            mostrarPantallaError(error);
            return err;
        }

    }

}

export async function buscarReporteVariablesAnno(){

    let mediador = new mediadorVariablesAnno();

    mediador.limpiarTabla();

    mediador.ocultarTabla();

    let anno = mediador.obtenerFecha();

    if(anno == err) return;

    let reporte = await mediador.obtenerReporte(anno);

    if(reporte == err) return;

    mediador.dibujarTabla(reporte);

    mediador.mostrarTabla();

}