/*global document, console */


import { setTipoPago } from "./controlesEfectuarPago.js";
import { asignarValueInput, borrarElementoHTML, cambiarTextContent, consultarInputText, limpiarInputText, mostrarBlock, mostrarPantalla, obtenerElementoHTML, obtenerTextContent, ocultar, ocultarHTML } from "./funcionesHTML.js";
import { generarImagen } from "./impresion.js";
import { mostrarPantallaCarga, mostrarPantallaError, ocultarPantallaCarga } from "./modal.js";
import {annoEnCurso, obtenerPreciosPreinscripcion, 
        precioDolar, 
        precioPreinscripcionBachillerato, 
        precioPreinscripcionPreescolar, 
        precioPreinscripcionPrimaria } from "./obtenerPrecios.js";
import { conexionBDpreinscripcion, representantePreinscripcionDatos } from "./preinscripcion.js";
import {numberAformatoMontos, 
        productoPrecision2, 
        sumaDecimal,
        eliminarCaracterEnIndice,
        insertarCaracterEnIndice,
        eliminarTodasLasOcurrenciasDeUnCaracter,
        verSiEsUnaLetraOCaracterEspecial,
        formatearCadenaNumerosMilesYDecimales,
        extraerNumerosPuntosComasDeUnaCadena, 
        formatoMontosAnumber,
        eliminarOcurrenciasElementoArray,
        contarOcurrenciasArray} from "./utilidades.js";
import { crearCeldaConInput, crearCeldaConTexto, crearTRconCeldasApendadas, limpiarFilasTabla } from "./utilidadesTablas.js";

class formulariosPreinscripcion{

    constructor(){

        this.arrayListaPaginas = ["preinscribirPG1", "preinscribirPG2"];
        this.paginaActual = 0; //A CERO PARA QUE VAYA A LA PAR DEL ARRAY
        this.cursorImprimirFormulario = 0; //LO MISMO, A ESTE SE LE SUMA 1 AL COMENZAR LA CONSULTA DE IMPRESION, PARA QUE VAYA A LA PAR DEL ARRAY DE ESTUDIANTES

    }

    limpiarInterfaz(){

        mostrarBlock("preinscribirPG1");
        ocultar("preinscribirPG2");

        if(this.arrayListaPaginas.length > 2){

            let elemento;

            //A ELIMINAR LAS PAGINAS EXTRAS SI LAS HUBIERAN

            let contenedor = document.getElementById("contenedorPreinscripcion");

            for(let i = 2; i <= this.arrayListaPaginas.length - 1; i++){

                elemento = obtenerElementoHTML(this.arrayListaPaginas[i]);
                contenedor.removeChild(elemento);

            }

        }

        this.arrayListaPaginas = ["preinscribirPG1", "preinscribirPG2"];
        this.paginaActual = 0;
        this.cursorImprimirFormulario = 0;

        //A LIMPIAR AHORA LA PRIMERA PAGINA DE FORMULARIO

        let primeraPagina = document.getElementById("preinscribirPG1").children[1].children[1];

        primeraPagina.children[0].value = ""; //NOMBRES 
        primeraPagina.children[1].value = ""; //APELLIDOS
        primeraPagina.children[2].value = ""; //CEDULA
        primeraPagina.children[3].value = ""; //TELEFONO
        primeraPagina.children[4].selectedIndex = 0; //TIPO REPRESENTANTE
        primeraPagina.children[5].value = ""; //DIRECCION
        primeraPagina.children[6].value = ""; //NOMBRE PADRE
        primeraPagina.children[7].value = ""; //CEDULA PADRE
        primeraPagina.children[8].value = ""; //NOMBRE MADRE
        primeraPagina.children[9].value = ""; //CEDULA MADRE

        //A LIMPIAR LA SEGUNDA PAGINA DEL FORMULARIO

        let segundaPagina = obtenerElementoHTML("preinscribirPG2").children[1].children[1];

        segundaPagina.children[0].value = ""; //NOMBRES
        segundaPagina.children[1].value = ""; //APELLIDOS
        segundaPagina.children[2].value = ""; //CEDULA
        segundaPagina.children[3].selectedIndex = 0; //SEXO
        segundaPagina.children[4].selectedIndex = 0; //GRADO 
        segundaPagina.children[5].selectedIndex = 0; //CURSO

        for(let i = 1; i <= segundaPagina.children[5].children.length - 1; i++){

            segundaPagina.children[5].children[i].style.display = "none";

            //ESTO OCULTA LOS DEMAS CURSOS, Y DEJA SOLO LA PRIMERA OPCION QUE DICE "CURSO"

        }

        segundaPagina.children[6].selectedIndex = 0; //SECCION
        segundaPagina.children[7].value = ""; //FECHA DE NACIMIENTO
        segundaPagina.children[8].value = ""; //LUGAR DE NACIMIENTO
        segundaPagina.children[9].selectedIndex = 0; //ESTADO
        segundaPagina.children[10].value = ""; //DIRECCION        


        //PARA QUE EL CODIGO DE OCULTAR EL OTRO CONCEPTO SOLO DEPENDA DEL
        //CURSOR DEL PANEL INFERIOR, PROCEDO A REINICIAR EL PANEL INFERIOR
        //Y LUEGO LLAMO AL METODO QUE OCULTA EL OTRO CONCEPTO

        this.reiniciarPanelInferior(); 

    }

    reiniciarPanelInferior(){

        cambiarTextContent("PgListaPreinscribir", "1");
        
        document.getElementById("preinscribirAtras").style.visibility = "hidden";

        document.getElementById("preinscribirSiguiente").style.display = "flex";
        document.getElementById("preinscribirAgregar").style.display = "none";

    }

    eliminarPagina(elementoHTML){ //ESTO RECIBE NO EL ID, SINO EL ELEMENTO MISMO

        let paginaActual = obtenerTextContent("PgListaPreinscribir");
        
        let numeroContador = parseInt(paginaActual);

        ocultarHTML(elementoHTML); //ESTA ES LA PAGINA

        mostrarBlock(this.arrayListaPaginas[this.paginaActual - 1]); // -1 PORQUE AUN NO HE BORRADO LA PAGINA

        this.arrayListaPaginas = eliminarOcurrenciasElementoArray(this.arrayListaPaginas, 
                                                                  elementoHTML.id);

        cambiarTextContent("PgListaPreinscribir", numeroContador - 1);

        borrarElementoHTML(elementoHTML);

        this.paginaActual = this.paginaActual - 1; 
        this.determinarBotonesNavegacion();

        console.log(this.arrayListaPaginas);

    }

    agregarPagina(){

        let paginaActual = obtenerTextContent("PgListaPreinscribir");
        
        let numeroContador = parseInt(paginaActual);

        let copiaArrayListaPaginas = [...this.arrayListaPaginas];

        let numeroIdPag = extraerNumerosPuntosComasDeUnaCadena(this.arrayListaPaginas[numeroContador - 1]);

        let numeroPagActual = parseInt(numeroIdPag);

        let numeroPagSiguiente = numeroPagActual + 1;

        let cadenaSiguienteElemento = "preinscribirPG" + numeroPagSiguiente;

        copiaArrayListaPaginas.push(cadenaSiguienteElemento);

        this.arrayListaPaginas = [...copiaArrayListaPaginas];

        let nuevaPagina = document.createElement("div");
        
        let contenedorDiv = document.createElement("div");
        
        let botonBorrar = document.createElement("img");
        botonBorrar.src = "rsrcs/delete.png";
        botonBorrar.className = "icono";
        botonBorrar.addEventListener("click", eliminarPagina); //PONER LA LLAMADA DE FUNCION POR FAVOR AAAAAAAAAAA

        let h1 = document.createElement("h1");
        h1.classList.add("centradoNoFlex");
        h1.textContent = "Datos Estudiante";
        let cajaContenedora = document.createElement("div");
            
        let sexoArray = ["Sexo", 
                         "Masculino", 
                         "Femenino"];

        let gradoArray = ["Grado de Instrucción", 
                          "Preescolar", 
                          "Primaria", 
                          "Bachillerato"];

        let cursoArray = ["Curso", 
                          "Primer Nivel", 
                          "Segundo Nivel", 
                          "Tercer Nivel", 
                          "Primer Grado", 
                          "Segundo Grado", 
                          "Tercer Grado", 
                          "Cuarto Grado", 
                          "Quinto Grado", 
                          "Sexto Grado", 
                          "Primer Año", 
                          "Segundo Año", 
                          "Tercer Año", 
                          "Cuarto Año", 
                          "Quinto Año"];
        
        let seccionArray = ["Sección", 
                            "Sección A", 
                            "Sección B"];
        
        let estadoArray = ["Estado", 
                           "Amazonas", 
                           "Anzoátegui", 
                           "Apure", 
                           "Aragua", 
                           "Barinas", 
                           "Bolívar", 
                           "Carabobo", 
                           "Cojedes", 
                           "Delta Amacuro",
                           "Dependencias Federales",  
                           "Distrito Federal", 
                           "Falcón", 
                           "Guárico", 
                           "Lara", 
                           "Mérida", 
                           "Miranda", 
                           "Monagas", 
                           "Nueva Esparta", 
                           "Portuguesa", 
                           "Sucre", 
                           "Táchira", 
                           "Trujillo", 
                           "Vargas", 
                           "Yaracuy", 
                           "Zulia"];
        
        
        let labelNombres = document.createElement("label");
        let labelApellidos = document.createElement("label");
        let labelCedula = document.createElement("label");
        let labelSexo = document.createElement("label");
        let labelGrado = document.createElement("label");
        let labelCurso = document.createElement("label");
        let labelSeccion = document.createElement("label");
        let labelFechaNacimiento= document.createElement("label");
        let labelLugarNacimiento= document.createElement("label");
        let labelEstado = document.createElement("label");
        let labelDirecion = document.createElement("label");
        labelNombres.textContent = "Nombres: ";
        labelApellidos.textContent = "Apellidos: ";
        labelCedula.textContent = "Cédula de Identidad: ";
        labelSexo.textContent = "Sexo: ";
        labelGrado.textContent = "Grado de Instrucción: ";
        labelCurso.textContent = "Curso: ";
        labelSeccion.textContent = "Sección: ";
        labelFechaNacimiento.textContent = "Fecha de Nacimiento: ";
        labelLugarNacimiento.textContent = "Lugar de Nacimiento: ";
        labelEstado.textContent = "Estado: ";
        labelDirecion.textContent = "Dirección: ";

        
        let inputNombres = document.createElement("input");
        let inputApellidos = document.createElement("input");
        let inputCedula = document.createElement("input");
        let selectSexo = document.createElement("select");
        let selectGrado = document.createElement("select");
        let selectCurso = document.createElement("select");
        let selectSeccion = document.createElement("select");
        let inputFechaNacimiento = document.createElement("input");
        let inputLugarNacimiento = document.createElement("input");
        let selectEstado = document.createElement("select");
        let inputDireccion = document.createElement("input");

        inputNombres.type = "text";
        inputNombres.placeholder = "Nombres";
        
        inputApellidos.type = "text";
        inputApellidos.placeholder = "Apellidos";
        
        inputCedula.type = "text";
        inputCedula.placeholder = "Cédula de Identidad";

        for(let i = 0; i <= 2; i++) selectSexo.appendChild(document.createElement("option"));
        for(let i = 0; i <= 2; i++) selectSexo.children[i].textContent = sexoArray[i];

        for(let i = 0; i <= 3; i++) selectGrado.appendChild(document.createElement("option"));
        for(let i = 0; i <= 3; i++) selectGrado.children[i].textContent = gradoArray[i];

        selectGrado.addEventListener("change", cambiarSelectCursosGradoInstruccion);

        for(let i = 0; i <= 14; i++) selectCurso.appendChild(document.createElement("option"));
        for(let i = 0; i <= 14; i++) selectCurso.children[i].textContent = cursoArray[i]; 
        for(let i = 1; i <= 14; i++) selectCurso.children[i].style.display = "none";

        for(let i = 0; i <= 2; i++) selectSeccion.appendChild(document.createElement("option"));
        for(let i = 0; i <= 2; i++) selectSeccion.children[i].textContent = seccionArray[i]; 

        for(let i = 0; i <= 25; i++) selectEstado.appendChild(document.createElement("option"));
        for(let i = 0; i <= 25; i++) selectEstado.children[i].textContent = estadoArray[i]; 

        inputFechaNacimiento.type = "date";

        inputLugarNacimiento.type = "text";
        inputLugarNacimiento.placeholder = "Lugar de Nacimiento";

        inputDireccion.type = "text";
        inputDireccion.placeholder = "Dirección"; 

        let cajaLabels = document.createElement("div");
        let cajaInputs = document.createElement("div");
        cajaLabels.classList.add("subcajaFormularioPreinscripcion");
        cajaInputs.classList.add("subcajaFormularioPreinscripcionDerecha");

        cajaLabels.appendChild(labelNombres);
        cajaLabels.appendChild(labelApellidos);
        cajaLabels.appendChild(labelCedula);
        cajaLabels.appendChild(labelSexo);
        cajaLabels.appendChild(labelGrado);
        cajaLabels.appendChild(labelCurso);
        cajaLabels.appendChild(labelSeccion);
        cajaLabels.appendChild(labelFechaNacimiento);
        cajaLabels.appendChild(labelLugarNacimiento);
        cajaLabels.appendChild(labelEstado);
        cajaLabels.appendChild(labelDirecion);

        
        cajaInputs.appendChild(inputNombres);
        cajaInputs.appendChild(inputApellidos);
        cajaInputs.appendChild(inputCedula);
        cajaInputs.appendChild(selectSexo);
        cajaInputs.appendChild(selectGrado);
        cajaInputs.appendChild(selectCurso);
        cajaInputs.appendChild(selectSeccion);
        cajaInputs.appendChild(inputFechaNacimiento);
        cajaInputs.appendChild(inputLugarNacimiento);
        cajaInputs.appendChild(selectEstado);
        cajaInputs.appendChild(inputDireccion);


        nuevaPagina.id = cadenaSiguienteElemento;
        cajaContenedora.classList.add("cajaFormularioInscripcion");
        cajaContenedora.appendChild(cajaLabels);
        cajaContenedora.appendChild(cajaInputs);
        contenedorDiv.appendChild(h1);
        contenedorDiv.appendChild(botonBorrar);
        contenedorDiv.style.display = "flex";
        contenedorDiv.style.flexDirection = "row";
        contenedorDiv.style.justifyContent = "space-between";
        nuevaPagina.appendChild(contenedorDiv);
        nuevaPagina.appendChild(cajaContenedora);
        document.getElementById("preinscribirPG" + numeroPagActual).style.display = "none";
        document.getElementById("contenedorPreinscripcion").insertBefore(nuevaPagina, document.getElementById("contenedorPreinscripcion").children[document.getElementById("contenedorPreinscripcion").children.length - 1]);

        this.paginaSiguiente();

    }

    paginaSiguiente(){

        debugger;

        let paginaActual = document.getElementById(this.arrayListaPaginas[this.paginaActual]);

        let paginaSiguiente = document.getElementById(this.arrayListaPaginas[this.paginaActual + 1]);

        paginaActual.style.display = "none";
        paginaSiguiente.style.display = "block";

        this.paginaActual = this.paginaActual + 1;

        let numeroPagInterfaz = obtenerTextContent("PgListaPreinscribir");

        numeroPagInterfaz = parseInt(numeroPagInterfaz);

        cambiarTextContent("PgListaPreinscribir", numeroPagInterfaz + 1);

        this.determinarBotonesNavegacion();

    }

    paginaAnterior(){

        let paginaActual = document.getElementById(this.arrayListaPaginas[this.paginaActual]);

        let paginaAnterior = document.getElementById(this.arrayListaPaginas[this.paginaActual - 1]);

        paginaActual.style.display = "none";
        paginaAnterior.style.display = "block";

        let numeroPagInterfaz = obtenerTextContent("PgListaPreinscribir");
        numeroPagInterfaz = parseInt(numeroPagInterfaz);
        cambiarTextContent("PgListaPreinscribir", numeroPagInterfaz - 1);

        this.paginaActual = this.paginaActual - 1;
        this.determinarBotonesNavegacion();

    }


    determinarBotonesNavegacion(){

        let pagMax = this.arrayListaPaginas.length - 1;

        let botonAgregar = obtenerElementoHTML("preinscribirAgregar");
        let botonSiguiente = obtenerElementoHTML("preinscribirSiguiente");
        let botonAtras = obtenerElementoHTML("preinscribirAtras");

        if(this.paginaActual == 0 && this.paginaActual == pagMax){ //ES LA PRIMERA Y SOLO HAY UNA

            botonAtras.style.visibility = "hidden";
            botonSiguiente.style.display = "none";
            botonAgregar.style.display = "flex";
            return;

        }

        if(this.paginaActual == 0 && this.paginaActual != pagMax){ //ES LA PRIMERA Y HAY MAS

            botonAtras.style.visibility = "hidden";
            botonSiguiente.style.display = "flex";
            botonAgregar.style.display = "none";
            return;

        }

        if(this.paginaActual != 0 && this.paginaActual != pagMax){ //NO ES LA PRIMERA Y HAY MAS

            botonAtras.style.visibility = "visible";
            botonSiguiente.style.display = "flex";
            botonAgregar.style.display = "none";
            return;   

        }

        if(this.paginaActual != 0 && this.paginaActual == pagMax){ //ES LA ULTIMA Y HAY MAS ATRAS

            botonAtras.style.visibility = "visible";
            botonSiguiente.style.display = "none";
            botonAgregar.style.display = "flex";
            return;   

        }
 
        

    }

    llenarFormularioRepresentante(datos){

        let contenedor = obtenerElementoHTML("preinscribirPG1");

        let formulario = contenedor.children[1].children[1];

        let indice = 1;

        if(datos.tipoRepresentante != "Regular") indice = 2;


        formulario.children[0].value = datos.nombres;
        formulario.children[1].value = datos.apellidos;
        formulario.children[2].value = datos.cedula;
        formulario.children[3].value = datos.telefono;
        formulario.children[4].selectedIndex = indice;
        formulario.children[5].value = datos.direccionRepresentante;
        formulario.children[6].value = datos.nombrePadre;
        formulario.children[7].value = datos.cedulaPadre;
        formulario.children[8].value = datos.nombreMadre;
        formulario.children[9].value = datos.cedulaMadre;

    }

    cambiarSelectCursos(){

        let formulario = obtenerElementoHTML(this.arrayListaPaginas[this.paginaActual]);

        let cajaInputs = formulario.children[1].children[1];

        let selectGrado = cajaInputs.children[4];

        let selectCurso = cajaInputs.children[5];

        let arrayCadenasVerificacion = ["Nivel", "Grado", "Año"];

        let curso;

        let gradoSeleccionado = selectGrado.selectedIndex - 1;

        selectCurso.selectedIndex = 0;

        for(let i = 1; i <= selectCurso.children.length - 1; i++){ //AQUI SE OCULTA TODO

            selectCurso.children[i].style.display = "none";

        }

        if(selectGrado.selectedIndex == 0) return; //QUE NO HAGA NADA, SOLO OCULTE

        for(let i = 1; i <= selectCurso.children.length - 1; i++){ //AQUI SE MUESTRAN LOS QUE TIENEN QUE SALIR

            curso = selectCurso.children[i];

            if(curso.textContent.includes(arrayCadenasVerificacion[gradoSeleccionado])){

                curso.style.display = "block";

            }

        }

    }

    determinarSiguientePantallaFormularioImprimir(){

        //ESTE METODO DETERMINA SI SE MUESTRA LA OPCION DE IMPRIMIR EL FORMULARIO
        //DE OTRO ESTUDIANTE O SI YA TE PASA A LA PANTALLA DEL RECIBO

        //SI SE ACABAN LOS ESTUDIANTES TE PASA LA PANTALLA DEL RECIBO, DE LO CONTRARIO
        //MUESTRA AL SIGUIENTE ESTUDIANTE HASTA QUE SE ACABEN

        if(this.cursorImprimirFormulario == this.arrayListaPaginas.length - 1){

            //LIMPIAR LOS FORMULARIOS
            //MOSTRAR LA PANTALLA DONDE SE SELECCIONA EL TIPO DE PROCESO
            
            this.limpiarInterfaz();

            ocultar("PantallaPreguntaImprimirFormularioPreinscripcion");

            mostrarPantalla("main-container-GestionEstudiantes");

            //LO PASA A LA PANTALLA DE INICIO PARA REINICIAR LAS VARIABLES DESDE LA INTERFAZ

            return;

        }

        //EL CURSOR EMPIEZA EN 0 PARA QUE SOLO SE USE UNA SOLA FUNCION QUE HAGA ESTE PROCEDIMIENTO

        let idSpan = "mensajePreguntaImprimirFormularioPreinscripcion";

        this.cursorImprimirFormulario = this.cursorImprimirFormulario + 1;

        let estudiante = this.obtenerInformacionFormulario(this.cursorImprimirFormulario);

        let cadenaTextContent = "Imprimir formulario para " + estudiante.nombres + " " + estudiante.apellidos;

        cadenaTextContent += " (estudiante " + this.cursorImprimirFormulario + ")";

        cambiarTextContent(idSpan, cadenaTextContent);

    }

    async imprimirFormularioEstudiante(){

        let nombreCompletoRepresentante = representantePreinscripcionDatos.nombres + " " + representantePreinscripcionDatos.apellidos;

        let estudiante = this.obtenerInformacionFormulario(this.cursorImprimirFormulario);

        let anno = consultarInputText("annoEscolarPreinscripcion");

        await generarImagen(estudiante.nombres, 
                            estudiante.apellidos,
                            estudiante.cedula,
                            estudiante.sexo,
                            estudiante.fechaNacimiento,
                            estudiante.lugarNacimiento,
                            estudiante.estado,
                            estudiante.direccion,
                            nombreCompletoRepresentante,
                            representantePreinscripcionDatos.cedula,
                            representantePreinscripcionDatos.direccionRepresentante,
                            representantePreinscripcionDatos.telefono,
                            representantePreinscripcionDatos.nombrePadre,
                            representantePreinscripcionDatos.cedulaPadre,
                            representantePreinscripcionDatos.nombreMadre,
                            representantePreinscripcionDatos.cedulaMadre,
                            estudiante.curso,
                            " ",
                            " ",
                            anno);

        this.determinarSiguientePantallaFormularioImprimir();

    }

    noImprimirFormularioEstudiante(){

        this.determinarSiguientePantallaFormularioImprimir();

    }

    obtenerInformacionFormulario(indice){

        let pagina = obtenerElementoHTML(this.arrayListaPaginas[indice]);

        let formulario = pagina.children[1].children[1];

        let objetoFormulario = {

            nombres: formulario.children[0].value,
            apellidos: formulario.children[1].value,
            cedula: formulario.children[2].value,
            sexo: formulario.children[3].options[formulario.children[3].selectedIndex].textContent,
            grado: formulario.children[4].options[formulario.children[4].selectedIndex].textContent,
            curso: formulario.children[5].options[formulario.children[5].selectedIndex].textContent,
            seccion: formulario.children[6].options[formulario.children[6].selectedIndex].textContent,
            fechaNacimiento: formulario.children[7].value,
            lugarNacimiento: formulario.children[8].value,
            estado: formulario.children[9].options[formulario.children[9].selectedIndex].textContent,
            direccion: formulario.children[10].value

        };

        return objetoFormulario;


    }

    formulariosInvalidos(){

        let informacion;

        //AQUI SE VERIFICAN LOS CAMPOS

        for(let i = 1; i <= this.arrayListaPaginas.length - 1; i++){

            informacion = this.obtenerInformacionFormulario(i);

            if(informacion.nombres == ""){

                mostrarPantallaError("Introduzca el nombre en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.apellidos == ""){

                mostrarPantallaError("Introduzca el apellido en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.cedula == ""){

                mostrarPantallaError("Introduzca la cédula en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.sexo == "Sexo"){

                mostrarPantallaError("Introduzca el sexo en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.grado == "Grado de Instrucción"){

                mostrarPantallaError("Introduzca el grado de instrucción en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.curso == "Curso"){

                mostrarPantallaError("Introduzca el curso en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.seccion == "Sección"){

                mostrarPantallaError("Introduzca la sección en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.fechaNacimiento == ""){

                mostrarPantallaError("Introduzca la fecha de nacimiento en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.lugarNacimiento == ""){

                mostrarPantallaError("Introduzca el lugar de nacimiento en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.estado == "Estado"){

                mostrarPantallaError("Introduzca el estado en la página " + (i + 1) + ", por favor");
                return true;

            }

            if(informacion.direccion == ""){

                mostrarPantallaError("Introduzca la dirección en la página " + (i + 1) + ", por favor");
                return true;

            }

        }

        //AQUI SE OBTIENE UNA COPIA DE TODAS LAS CEDULAS EN LOS FORMULARIOS

        let arrayCedulas = [];
        let conteo;

        for(let i = 1; i <= this.arrayListaPaginas.length - 1; i++){

            informacion = this.obtenerInformacionFormulario(i);

            arrayCedulas.push(informacion.cedula);

        }

        for(let i = 0; i <= arrayCedulas.length - 1; i++){

            conteo = contarOcurrenciasArray(arrayCedulas, arrayCedulas[i]);

            if(conteo > 1){
                mostrarPantallaError("Hay cédulas repetidas en los formularios de estudiantes");
                return true;
            } 

        }

        return false;

    }

}

export let gestorFormularioPreinscripcion = new formulariosPreinscripcion();


export async function entrarPreinscripcion(){

    mostrarPantallaCarga();

    let resultado = await obtenerPreciosPreinscripcion();

    if(resultado == "ERROR") return;

    ocultar("main-container-GestionEstudiantes");
    mostrarPantalla("mainContainerDatosRepresentantePreinscripcion");

    asignarValueInput("annoEscolarPreinscripcion", annoEnCurso);

    ocultarPantallaCarga();

}

export function atrasPreinscripcion(){ //ESTA LA PANTALLA DE CONSULTA DE DATOS DEL REPRESENTANTE

    ocultar("mainContainerDatosRepresentantePreinscripcion");
    mostrarPantalla("main-container-GestionEstudiantes");

    limpiarInputText("cedulaRepresentantePreinscribir"); 
    limpiarInputText("nombresRepresentantePreinscripcion");
    limpiarInputText("apellidosRepresentantePreinscripcion");
    limpiarInputText("totalAbonadoRepresentantePreinscripcion");


}

function formularioInvalidoConsultaRepresentantePreinscripcion(){

    let inputNombre = consultarInputText("nombresRepresentantePreinscripcion");

    if(inputNombre == "") return true;

    return false;

}

export function entrarFormularioPreinscripcion(){

    if(formularioInvalidoConsultaRepresentantePreinscripcion()){

        mostrarPantallaError("Consulte un representante por cedula por favor");
        return;

    }

    gestorFormularioPreinscripcion.llenarFormularioRepresentante(representantePreinscripcionDatos);

    ocultar("mainContainerDatosRepresentantePreinscripcion");
    mostrarPantalla("mainContainerPreinscribirEstudiante");

}

export function atrasFormularioPreinscripcion(){ //VOLVER A DONDE SE INTRODUCEN LOS DATOS DE REPRESENTANTE

    ocultar("mainContainerPreinscribirEstudiante");
    mostrarPantalla("mainContainerDatosRepresentantePreinscripcion");
    
    gestorFormularioPreinscripcion.limpiarInterfaz(); //SOLO LIMPIA LA INTERFAZ DE LA PANTALLA QUE SE ACABA DE OCULTAR

}

function eliminarPagina(){

    let elemento = this.parentNode.parentNode;

    gestorFormularioPreinscripcion.eliminarPagina(elemento);

}


export function paginaSiguientePreinscribir(){

    gestorFormularioPreinscripcion.paginaSiguiente();

}

export function paginaAnteriorPreinscribir(){

    gestorFormularioPreinscripcion.paginaAnterior();

}

export function agregarPaginaPreinscribir(){

    gestorFormularioPreinscripcion.agregarPagina();

}

export function cambiarSelectCursosGradoInstruccion(){

    gestorFormularioPreinscripcion.cambiarSelectCursos();

}

function formularioInvalido(){

    if(gestorFormularioPreinscripcion.formulariosInvalidos()) return true;

    return false;

}

export async function entrarPantallaConsultaUSDpreinscripcion(){

    mostrarPantallaCarga();

    if(formularioInvalido()){
        ocultarPantallaCarga();
        return;
    } 

    let conexion = new conexionBDpreinscripcion();

    let annoConsultado = consultarInputText("annoEscolarPreinscripcion");

    let infoEstudiante;

    for(let i = 1; i <= gestorFormularioPreinscripcion.arrayListaPaginas.length - 1; i++){

        infoEstudiante = gestorFormularioPreinscripcion.obtenerInformacionFormulario(i);

        let estudianteRepreExiste = await conexion.estudianteRepresentanteExiste(infoEstudiante.cedula ,annoConsultado);
    
        if(estudianteRepreExiste == "ERROR") return;

        if(estudianteRepreExiste){

            ocultarPantallaCarga();
            mostrarPantallaError("La cédula en la pagina " + i + " ya se encuentra registrada para este representante en este año escolar");
            return;

        }

        let estudianteSeccionExiste = await conexion.estudianteYaExisteSeccion(infoEstudiante, annoConsultado);

        if(estudianteSeccionExiste == "ERROR") return;

        if(estudianteSeccionExiste){

            ocultarPantallaCarga();
            mostrarPantallaError("La cédula en la pagina " + i + " ya se encuentra registrada en esa sección");
            return;

        }

    }

    limpiarFilasTabla("tablaEstudiantesPreinscripcionConsulta", 1);

    dibujarTablaPrevioConfirmar();

    ocultarPantallaCarga();

    ocultar("mainContainerPreinscribirEstudiante");
    mostrarPantalla("mainContainerConsultaUSDpreinscripcion");

}

export function entrarPantallaConsultaImprimirFormulario(){

    gestorFormularioPreinscripcion.determinarSiguientePantallaFormularioImprimir();

    //POR LO PRONTO PORQUE ES UNA PRUEBA OCULTA LA PANTALLA DONDE
    //SE INTRODUCEN LOS DATOS DE LA PREINSCRIPCION

    ocultar("mainContainerPreinscribirEstudiante");
    mostrarPantalla("mainContainerPagoPreinscripcionRealizado");

}

export function botonSIimprimirFormularioEstudiantePreinscripcion(){

    gestorFormularioPreinscripcion.imprimirFormularioEstudiante();

}

export function botonNOimprimirFormularioEstudiantePreinscripcion(){

    gestorFormularioPreinscripcion.noImprimirFormularioEstudiante();

}

function dibujarTablaPrevioConfirmar(){

    if(formularioInvalido()){ //LA PANTALLA DE ERROR LA MUESTRA ESTA FUNCION

        return "ERROR";

    }

    let tabla = obtenerElementoHTML("tablaEstudiantesPreinscripcionConsulta");

    let celdaNombreCompleto;
    let celdaCedula;
    let celdaCurso;
    let celdaMontoUSD;
    let celdaPrecioUSD;

    let info;

    let montoUSD;

    let fila;
    let arrayCeldas;

    for(let i = 1; i <= gestorFormularioPreinscripcion.arrayListaPaginas.length - 1; i++){

        arrayCeldas = [];

        info = gestorFormularioPreinscripcion.obtenerInformacionFormulario(i);

        celdaNombreCompleto = crearCeldaConTexto(info.nombres + " " + info.apellidos);
        celdaCedula = crearCeldaConTexto(info.cedula);
        celdaCurso = crearCeldaConTexto(info.curso);
        
        if(info.grado == "Preescolar") montoUSD = numberAformatoMontos(precioPreinscripcionPreescolar);
        if(info.grado == "Primaria") montoUSD = numberAformatoMontos(precioPreinscripcionPrimaria);
        if(info.grado == "Bachillerato") montoUSD = numberAformatoMontos(precioPreinscripcionBachillerato);

        celdaMontoUSD = crearCeldaConInput("text", montoUSD, "");

        celdaMontoUSD.children[0].addEventListener("input", validacionMontoConCorreccionPagoTotalUSDpreinscripcion);

        celdaPrecioUSD = crearCeldaConInput("text", numberAformatoMontos(precioDolar), "validacionMontoEstiloBDV");

        arrayCeldas.push(celdaNombreCompleto);
        arrayCeldas.push(celdaCedula);
        arrayCeldas.push(celdaCurso);
        arrayCeldas.push(celdaMontoUSD);
        arrayCeldas.push(celdaPrecioUSD);

        fila = crearTRconCeldasApendadas(arrayCeldas);

        tabla.appendChild(fila);

    }

    correccionSumaUSDTotalPagarPreinscripcion();

}

function precioDolarYmontoUSDvacio(){

    let tabla = document.getElementById("tablaEstudiantesPreinscripcionConsulta");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[3].children[0].value == "0,00"){

            mostrarPantallaError("El monto a pagar en dólares está en 0,00 en la fila " + i);
            return 1;

        }

        if(tabla.rows[i].cells[4].children[0].value == "0,00"){

            mostrarPantallaError("El precio del dólar está en 0,00 en la fila " + i);
            return 1;

        }

    }

    return 0;

}

export function continuarEntrarConfirmar(){

    if(precioDolarYmontoUSDvacio()) return;

    let tabla = document.getElementById("tablaEstudiantesPreinscripcionConsulta");

    limpiarFilasTabla("tablaPreinscripcionConfirmar", 1);

    for(let indice = 1; indice <= tabla.rows.length - 1; indice++){

        crearFilaEstudianteConfirmarPreinscribir(indice);

    }

    document.getElementById("totalConfirmarPreinscripcionUSD").textContent = document.getElementById("totalPagarPreinscripcionUSDconsulta").textContent;

    correccionSumaBSTotalPagarPreinscripcion();

    entrarConfirmarPreinscripcion();

}

function entrarConfirmarPreinscripcion(){

    ocultar("mainContainerConsultaUSDpreinscripcion");
    mostrarPantalla("mainContainerConfirmarPreinscripcion");

}

function crearFilaEstudianteConfirmarPreinscribir(indice){

    let tabla = document.getElementById("tablaPreinscripcionConfirmar");

    let fila = document.createElement("tr");

    let nombreCompleto = document.createElement("td");

    let curso = document.createElement("td");

    let cedula = document.createElement("td");

    let montoUSD = document.createElement("td");

    let montoBS = document.createElement("td");

    let precioDolar = document.createElement("td");

    let inputBS = document.createElement("input");

    //CONFIGURANDO EL INPUT

    inputBS.type = "text";
    inputBS.addEventListener("input", validacionMontoConCorreccionPagoTotalBSpreinscripcion);

    //PONER AQUI LA LLAMADA A FUNCION DEL EVENT LISTENER

    //COPIANDO DATOS A LOS ELEMENTOS CREADOS

    let tablaOrigen = document.getElementById("tablaEstudiantesPreinscripcionConsulta");

    nombreCompleto.textContent = tablaOrigen.rows[indice].cells[0].textContent;
    
    cedula.textContent = tablaOrigen.rows[indice].cells[1].textContent;

    curso.textContent = tablaOrigen.rows[indice].cells[2].textContent;

    montoUSD.textContent = tablaOrigen.rows[indice].cells[3].children[0].value;

    precioDolar.textContent = tablaOrigen.rows[indice].cells[4].children[0].value;

    inputBS.value = numberAformatoMontos(productoPrecision2(formatoMontosAnumber(montoUSD.textContent), 
                                                                  formatoMontosAnumber(precioDolar.textContent)));

    montoBS.appendChild(inputBS);


    //INSERTANDO Y FINALIZANDO

    fila.appendChild(nombreCompleto);
    fila.appendChild(cedula);
    fila.appendChild(curso);
    fila.appendChild(montoUSD);
    fila.appendChild(montoBS);
    fila.appendChild(precioDolar);

    tabla.appendChild(fila);

}

export function atrasConfirmarPreinscripcion(){

    ocultar("mainContainerConfirmarPreinscripcion");
    mostrarPantalla("mainContainerConsultaUSDpreinscripcion");

}

export function atrasConsultaUSDpreinscripcion(){

    mostrarPantalla("mainContainerPreinscribirEstudiante");
    ocultar("mainContainerConsultaUSDpreinscripcion");

}

function precioBSvacio(){

    let tabla = document.getElementById("tablaPreinscripcionConfirmar");

    for(let i = 1; i <= tabla.rows.length - 1; i++){

        if(tabla.rows[i].cells[4].children[0].value == "0,00"){

            mostrarPantallaError("El monto a pagar en bolívares está en 0,00 en la fila " + i);
            return 1;

        }

    }

    return 0; 

}

export function entrarPantallaPagarPreinscripcion(){

    if(precioBSvacio()) return;

    setTipoPago("Preinscripcion");

    document.getElementById("montoPagarDolares").textContent = document.getElementById("totalConfirmarPreinscripcionUSD").textContent;
    document.getElementById("montoPagarBolivares").textContent = document.getElementById("totalConfirmarPreinscripcionBS").textContent;
    document.getElementById("montoAbonarPantallaPagos").textContent = "N/A";

    ocultar("mainContainerConfirmarPreinscripcion");
    mostrarPantalla("mainContainerPagar");

}

function validacionMontoConCorreccionPagoTotalUSDpreinscripcion(){
  let valor = this.value;
  if(verSiEsUnaLetraOCaracterEspecial(valor[valor.length - 1])) valor = eliminarCaracterEnIndice(valor, valor.length - 1);
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ".");
  if(valor.length == 0){
      this.value = "0,00";
      return 0;
  }
  if(valor.length == 1){
      this.value = "0,0" + valor;
  }
  if((valor[0] === ".")){
      this.value = "0" + valor;
      return 0;
  }
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  if(valor[0] === "," && valor.length == 3) valor = "0" + valor;
  if(valor[0] === "0" && valor[1] != "," && valor.length > 1) valor = eliminarCaracterEnIndice(valor, 0);
  this.value = valor;
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  this.value = extraerNumerosPuntosComasDeUnaCadena(valor);
  this.value = formatearCadenaNumerosMilesYDecimales(valor);
  correccionSumaUSDTotalPagarPreinscripcion();
};

function validacionMontoConCorreccionPagoTotalBSpreinscripcion(){
  let valor = this.value;
  if(verSiEsUnaLetraOCaracterEspecial(valor[valor.length - 1])) valor = eliminarCaracterEnIndice(valor, valor.length - 1);
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ".");
  if(valor.length == 0){
      this.value = "0,00";
      return 0;
  }
  if(valor.length == 1){
      this.value = "0,0" + valor;
  }
  if((valor[0] === ".")){
      this.value = "0" + valor;
      return 0;
  }
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  if(valor[0] === "," && valor.length == 3) valor = "0" + valor;
  if(valor[0] === "0" && valor[1] != "," && valor.length > 1) valor = eliminarCaracterEnIndice(valor, 0);
  this.value = valor;
  valor = eliminarTodasLasOcurrenciasDeUnCaracter(valor, ",");
  valor = insertarCaracterEnIndice(valor, valor.length - 2, ",");
  this.value = extraerNumerosPuntosComasDeUnaCadena(valor);
  this.value = formatearCadenaNumerosMilesYDecimales(valor);
  correccionSumaBSTotalPagarPreinscripcion();
};

function correccionSumaUSDTotalPagarPreinscripcion(){
    let tabla = document.getElementById("tablaEstudiantesPreinscripcionConsulta");
    let precioTotal = 0;
    let inputUSD;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputUSD = tabla.rows[i].cells[3].children[0];
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputUSD.value);
        }
    document.getElementById("totalPagarPreinscripcionUSDconsulta").textContent = numberAformatoMontos(precioTotal);
}

function correccionSumaBSTotalPagarPreinscripcion(){
    let tabla = document.getElementById("tablaPreinscripcionConfirmar");
    let precioTotal = 0;
    let inputBS;
        for(let i = 1; i <= tabla.rows.length - 1; i++){
            inputBS = tabla.rows[i].cells[4].children[0];
            precioTotal = sumaDecimal(numberAformatoMontos(precioTotal), inputBS.value);
        }
    document.getElementById("totalConfirmarPreinscripcionBS").textContent = numberAformatoMontos(precioTotal);
}