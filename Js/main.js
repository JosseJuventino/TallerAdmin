let BotonConvertir = document.getElementById("BotonConvertir");
let arrayPersonas = [];
BotonConvertir.addEventListener("click", function () {
    leerArchivo();
});

function convertir(content) {
    contenidoo = content.replace(/\r\n/g, "\n");
    let lineas = contenidoo.split("\n");
    for (let i = 0; i < lineas.length; i++) {
        if (lineas[i]) {
            let campos = lineas[i].split(";");

            let persona = {
                nombre: campos[0],
                tipo: campos[1],
                carnet: campos[2],
                correo: campos[3],
            };
            arrayPersonas = [...arrayPersonas, persona];
        }
    }

    CreandoSentenciaSQL(arrayPersonas);
}

function leerArchivo() {
    let archivo = document.getElementById("file").files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.readAsText(archivo, "UTF-8");
        reader.onload = function (evt) {
            let contenido = evt.target.result;
            convertir(contenido);
        };
        reader.onerror = function (evt) {
            console.log("error al leer el archivo");
        };
    } else {
        alert("No se ha cargado ningun archivo");
    }
}

function CrearAchivoSQL(sqlSentence,nombreArchivo) {
    let texto = new Blob([sqlSentence], { type: "text/sql" });
    let archivo = document.createElement("a");
    archivo.download = nombreArchivo;
    archivo.href = URL.createObjectURL(texto);
    archivo.click();
}

function CreandoSentenciaSQL(array) {
    let sqlSentence = "";
    let sqlUser = "";
    let sqlDeleteUser="";
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
    CrearAchivoSQL(sqlSentence, "Inserts.sql");
    CrearAchivoSQL(sqlUser, "Users.sql");
    CrearAchivoSQL(sqlDeleteUser, "DeleteUsers.sql");
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
