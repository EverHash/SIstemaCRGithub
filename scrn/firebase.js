            export {
                    Base,
                    app};
            import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
            import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

            export { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

            export{
              getFirestore, collection, deleteField, getDoc, getDocs, setDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, where, orderBy, limit
            } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

            const firebaseConfig = {
              apiKey: "AIzaSyCQOLDz0EgMpW_PF7Rr2S9Bqyy_gS8sGlk",
              authDomain: "sistema-administrativo-cr.firebaseapp.com",
              projectId: "sistema-administrativo-cr",
              storageBucket: "sistema-administrativo-cr.appspot.com",
              messagingSenderId: "995513279993",
              appId: "1:995513279993:web:52f20e399fee7e48b5c928"
            };
          
            const app = initializeApp(firebaseConfig);
            const Base = getFirestore(app);
          
            function verSiEsFloat(cadena){
              let verificador = false;
              if(cadena == ""){
                  return 1;
              }
              for(let k = cadena.length - 1; k >= 0; k--){
                  if(cadena[k] === "0" 
                  || cadena[k] === "1"
                  || cadena[k] === "2"
                  || cadena[k] === "3"
                  || cadena[k] === "4"
                  || cadena[k] === "5"
                  || cadena[k] === "6"
                  || cadena[k] === "7"
                  || cadena[k] === "8"
                  || cadena[k] === "9"
                  || cadena[k] === "."){verificador = true;}
                  else{return 1;}
                  if(k == 0 && verificador == true){
                      return 0;
                  }
                }
          }           
          

            function extraerTodosLosCaracteresExceptoNumeros(cadena){
              let resultado = "";
              for(let i = 0; i <= cadena.length - 1; i++){
                if(cadena[i] === "0") continue;
                if(cadena[i] === "1") continue;
                if(cadena[i] === "2") continue;
                if(cadena[i] === "3") continue;
                if(cadena[i] === "4") continue;
                if(cadena[i] === "5") continue;
                if(cadena[i] === "6") continue;
                if(cadena[i] === "7") continue;
                if(cadena[i] === "8") continue;
                if(cadena[i] === "9") continue;
                resultado += cadena[i];
              }
              return resultado;
            }

            function extraerSoloNumerosDeLaCadena(cadena){
              let resultado = "";
              for(let i = 0; i <= cadena.length - 1; i++){
                if(cadena[i] === "0") resultado += cadena[i];
                if(cadena[i] === "1") resultado += cadena[i];
                if(cadena[i] === "2") resultado += cadena[i];
                if(cadena[i] === "3") resultado += cadena[i];
                if(cadena[i] === "4") resultado += cadena[i];
                if(cadena[i] === "5") resultado += cadena[i];
                if(cadena[i] === "6") resultado += cadena[i];
                if(cadena[i] === "7") resultado += cadena[i];
                if(cadena[i] === "8") resultado += cadena[i];
                if(cadena[i] === "9") resultado += cadena[i];
              }
              return resultado;
            }


            /*ERROR AL PAGAR:  ReferenceError: propiedad is not defined
    at escribirDocumentodePagoMensualidad (InternalProcedures.js:1029:100)
    at efectuarPagoIndividual (firebase.js:1282:17)*/
            /*
            document.getElementById("buscarRepresentanteReinscribir").addEventListener("click", buscarRepresentanteReinscribir);*/