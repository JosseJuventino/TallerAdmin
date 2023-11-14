
let BotonConvertir = document.getElementById("BotonConvertir");
let arrayPersonas = [];

let jsConfetti = new JSConfetti();


let contenedorPage = document.getElementById("contenedor");
let buttonDownloadSection = document.getElementById("buttonDownload"); 

let InsertsDownloadButton = document.getElementById("InsertsDownload");
let UsersDownloadButton = document.getElementById("UsersDownload");
let restoreDownloadButton = document.getElementById("restoreDownload");
let returnButton = document.getElementById("returnButton");

BotonConvertir.addEventListener("click", function () {
    /** Acá se ejecuta cuando se da click a ejecutar */
    LeerArchivo();
    contenedorPage.style.display = "none";
    buttonDownloadSection.style.display = "block";
});

function LeerArchivo() {
    let archivo = document.getElementById("file").files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.readAsText(archivo, "UTF-8");
        reader.onload = function (evt) {
            let contenido = evt.target.result;
            CrearObjetoPersona(contenido);
        };
        reader.onerror = function (evt) {
            console.log("Ocurrio un error al leer el archivo :/");
        };
    } else {
        alert("Por favor seleccione un archivo >:v");
    }
}

function CrearObjetoPersona(content) {
    textDepurado = content.replace(/\r\n/g, "\n");
    let lineas = textDepurado.split("\n");

    for (let i = 0; i < lineas.length; i++) {
        if (lineas[i]) {
            let campos = lineas[i].split(";");

            //Convirtiendo en un array de objetos
            let persona = {
                nombre: campos[0],
                tipo: campos[1],
                carnet: campos[2],
                correo: campos[3],
            };

            //Agregando al array de personas
            arrayPersonas = [...arrayPersonas, persona];
        }
    }

    //Una vez se tiene el array de personas separadas por linea y por puntos y comas, 
    //se procede a crear el archivo SQL
    CreandoSentenciaSQL(arrayPersonas);
}

function CreandoSentenciaSQL(array) {
    // Variables que almacenan la consulta SQL
    let sqlSentence = "";
    let sqlUser = "";
    let sqlDeleteUser = "";

    //Recorriendo el archivo
    for (let i = 0; i < array.length; i++) {
        if (array[i].tipo == "Estudiante") {
            sqlUser += `CREATE USER U_${array[i].carnet} IDENTIFIED BY ${generarContrasena(10)} DEFAULT TABLESPACE t_estudiantes TEMPORARY TABLESPACE temp QUOTA UNLIMITED ON t_estudiantes;\n`;
            sqlSentence += `INSERT INTO ESTUDIANTE (nombre, carnet, correo) VALUES ('${array[i].nombre}', '${array[i].carnet}', '${array[i].correo}');\n`;
            sqlDeleteUser += `DROP USER U_${array[i].carnet};\n`;
        } else if (array[i].tipo == "Docente") {
            sqlUser += `CREATE USER U_${array[i].carnet} IDENTIFIED BY ${generarContrasena(10)} DEFAULT TABLESPACE t_empleados TEMPORARY TABLESPACE temp QUOTA UNLIMITED ON t_empleados;\n`;
            sqlSentence += `INSERT INTO EMPLEADO (nombre, id_tipo_empleado, carnet, correo) VALUES ('${array[i].nombre}', 2 , '${array[i].carnet}', '${array[i].correo}');\n`;
            sqlDeleteUser += `DROP USER U_${array[i].carnet};\n`;
        } else if (array[i].tipo == "Administrativo") {
            sqlUser += `CREATE USER U_${array[i].carnet} IDENTIFIED BY ${generarContrasena(10)} DEFAULT TABLESPACE t_empleados TEMPORARY TABLESPACE temp QUOTA UNLIMITED ON t_empleados;\n`;
            sqlSentence += `INSERT INTO EMPLEADO (nombre, id_tipo_empleado, carnet, correo) VALUES ('${array[i].nombre}', 0 , '${array[i].carnet}', '${array[i].correo}');\n`;
            sqlDeleteUser += `DROP USER U_${array[i].carnet};\n`;
        } else if (array[i].tipo == "Coordinador") {
            sqlUser += `CREATE USER U_${array[i].carnet} IDENTIFIED BY ${generarContrasena(10)} DEFAULT TABLESPACE t_empleados TEMPORARY TABLESPACE temp QUOTA UNLIMITED ON t_empleados;\n`;
            sqlSentence += `INSERT INTO EMPLEADO (nombre, id_tipo_empleado, carnet, correo) VALUES ('${array[i].nombre}', 1 , '${array[i].carnet}', '${array[i].correo}');\n`;
            sqlDeleteUser += `DROP USER U_${array[i].carnet};\n`;
        }
    }
    

    InsertsDownloadButton.addEventListener("click", function () {
        CrearAchivoSQL(sqlSentence, "Inserts.sql");
    });
    
    UsersDownloadButton.addEventListener("click", function () {
        CrearAchivoSQL(sqlUser, "Users.sql");
    });
    
    restoreDownloadButton.addEventListener("click", function () {
        CrearAchivoSQL(sqlDeleteUser, "restore.sql");
    });

  
    jsConfetti.addConfetti({
        emojis: ['🥵','🔥'],
     })
}



returnButton.addEventListener("click", function () {
    contenedorPage.style.display = "block";
    buttonDownloadSection.style.display = "none";
});

function CrearAchivoSQL(sqlSentence, nombreArchivo) {
    let texto = new Blob([sqlSentence], { type: "text/sql" });
    let archivo = document.createElement("a");
    archivo.download = nombreArchivo;
    archivo.href = URL.createObjectURL(texto);
    archivo.click();
}

function generarContrasena(longitud) {
    const caracteres =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let contrasena = "";

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indice);
    }

    return contrasena;
}
