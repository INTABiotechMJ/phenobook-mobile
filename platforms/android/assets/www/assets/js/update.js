db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

//var __URL = "http://159.203.212.59/field/files/php/scripts/app/";
//var __URL = "http://localhost/versioned/software/field/admin/files/php/scripts/app/";

var __URL = localStorage.getItem('url')+"files/php/scripts/app/";

local = false;
if(!local){
    var isOffline = 'onLine' in navigator && !navigator.onLine;
    if (isOffline) {
        log("There's no Internet conection")
        throw new Error("Sin conexión");
    }
}


function upload(callback){
    db.transaction(
        function(tx) {
            sql = "CREATE TABLE IF NOT EXISTS Variable ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "nombre VARCHAR(100), " +
                "nombreOriginal VARCHAR(100), " +
                "valorDefecto VARCHAR(100), " +
                "required INTEGER, " +
                "descripcion VARCHAR(100), " +
                "tipoCampo INTEGER, " +
                "libroCampo INTEGER)"
tx.executeSql(sql);



sql = "CREATE TABLE IF NOT EXISTS Registro ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "user INTEGER, " +
    "localStamp DATETIME, " +
    "stamp DATETIME, " +
    "parcela INTEGER, " +
    "variable INTEGER, " +
    "status INTEGER, " +
    "updated INTEGER, " +
    "valor TEXT, " +
    "latitude VARCHAR(100), " +
    "longitude VARCHAR(100)) "
    tx.executeSql(sql);

    var sql = "SELECT Registro.*, Variable.tipoCampo FROM Registro, Variable WHERE Registro.variable = Variable.id AND updated = '0' AND status = '1'";
    var items = new Array();
    tx.executeSql(sql, [],
        function(tx2, results) {
            var len = results.rows.length;
            log("Uploading " + len + " record/s");
            for (var i=0; i<len; i++){
                items.push(results.rows.item(i));
            }
            $.ajax({
                type: "POST",
                url: __URL + "import-registros.php",
                data: {data: JSON.stringify(items),email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') }
            })
            .done(function( data ) {
                if(data == "error"){
                    log("Authentication server error. Please check your credentials and try again.");
                    return false;
                }
                localStorage.setItem("grupo", data);
                callback();
            });
        }
        );

}, txErrorHandler
);
}


upload(download);

function download(){
    db.transaction(
        function(tx) {
           var sql = "UPDATE Registro SET updated = '1'";
           tx.executeSql(sql);
       });

    initDB();
    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-users.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateUsers(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-ensayos.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateEnsayos(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-parcelas.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateParcelas(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-variables.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateVariables(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-opciones.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateOpciones(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-registros.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateRegistros(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-infoEnsayo.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateInfoEnsayo(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-valorInfoEnsayo.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateValorInfoEnsayo(data, function(){});
    });

    $.ajax({
        dataType: "json",
        type: "POST",
        url: __URL + "export-userEnsayo.php",
        data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
        updateUserLibroCampo(data, function(){});
    });


}
function initDB(){
    db.transaction(
        function(tx) {
            var sql = "DROP TABLE IF EXISTS User";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS LibroCampo";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS Parcela";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS Variable";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS Registro";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS Opcion";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS InfoEnsayo";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS ValorInfoEnsayo";
            tx.executeSql(sql);
            sql = "DROP TABLE IF EXISTS UserLibroCampo";
            tx.executeSql(sql);

            sql = "CREATE TABLE IF NOT EXISTS User ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "name VARCHAR(100), pass VARCHAR(300), email VARCHAR(300)) ";
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS LibroCampo ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre VARCHAR(100), " +
    "campo_numero VARCHAR(100), " +
    "descripcion VARCHAR(50)) ";
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS Parcela ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "libroCampo INTEGER," +
    "numero INTEGER)"
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS Variable ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre VARCHAR(100), " +
    "nombreOriginal VARCHAR(100), " +
    "valorDefecto VARCHAR(100), " +
    "required INTEGER, " +
    "descripcion VARCHAR(100), " +
    "tipoCampo INTEGER, " +
    "libroCampo INTEGER)"
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS Opcion ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre VARCHAR(100), " +
    "variable INTEGET, " +
    "opcionDefecto INTEGER) "
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS Registro ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "user INTEGER, " +
    "localStamp DATETIME, " +
    "stamp DATETIME, " +
    "parcela INTEGER, " +
    "variable INTEGER, " +
    "status INTEGER, " +
    "updated INTEGER, " +
    "valor TEXT, " +
    "latitude VARCHAR(100), " +
    "longitude VARCHAR(100)) "
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS InfoEnsayo ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre INTEGER, " +
    "libroCampo INTEGER)"
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS ValorInfoEnsayo ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "infoEnsayo INTEGER, " +
    "parcela INTEGER, " +
    "valor VARCHAR(200))"
tx.executeSql(sql);

sql = "CREATE TABLE IF NOT EXISTS UserLibroCampo ( " +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "user INTEGER, " +
    "libroCampo INTEGER) "
tx.executeSql(sql);

}, txErrorHandler );
}


function updateUsers(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " users ");
            tx.executeSql("DELETE FROM User");
            var sql = "INSERT OR REPLACE INTO User (id, name, pass, email) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.name,e.pass, e.email];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        });
}

function updateEnsayos(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " trial/s");
            var sql = " INSERT OR REPLACE INTO LibroCampo " +
            " (id, nombre, campo_numero, descripcion) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.nombre, e.campo_numero, e.descripcion];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function updateVariables(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " variable/s");
            var sql = " INSERT OR REPLACE INTO Variable " +
            " (id, nombre, nombreOriginal, valorDefecto, required, descripcion, tipoCampo, libroCampo) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.nombre, e.nombreOriginal, e.valorDefecto, e.required, e.required, e.tipoCampo.tipo, e.libroCampo.id];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function updateParcelas(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " exp. units /s");
            var sql = " INSERT OR REPLACE INTO Parcela " +
            " (id, numero, libroCampo) " +
            " VALUES (?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.numero, e.libroCampo.id];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function updateRegistros(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " record/s");
            var sql = " INSERT OR REPLACE INTO Registro " +
            " (id,localStamp,  user, stamp, status, valor, parcela, variable, updated) " +
            " VALUES (?, ?, ?, ?, ?,?, ?,?, '1') ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id,e.localStamp, e.user.id, e.stamp, e.status,  e.valor, e.parcela.id, e.variable.id];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function updateOpciones(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " option/s");
            var sql = " INSERT OR REPLACE INTO Opcion " +
            " (id, nombre, variable, opcionDefecto) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.nombre, e.variable.id, e.opcionDefecto];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}
function updateInfoEnsayo(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " trial/s information");
            var sql = " INSERT OR REPLACE INTO InfoEnsayo " +
            " (id, nombre, libroCampo) " +
            " VALUES (?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.nombre, e.libroCampo.id];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}
function updateValorInfoEnsayo(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " variable/s value/s");
            var sql = " INSERT OR REPLACE INTO ValorInfoEnsayo " +
            " (id, valor, infoEnsayo, parcela) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                if(e.infoEnsayo){
                    var params = [e.id, e.valor, e.infoEnsayo.id, e.parcela.id];
                    tx.executeSql(sql, params);
                }
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function updateUserLibroCampo(items, callback) {
    db.transaction(
        function(tx) {
            var l = items.length;
            log("Downloading " + l + " user values");
            var sql = " INSERT OR REPLACE INTO UserLibroCampo " +
            " (id, user, libroCampo) " +
            " VALUES (?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
                e = items[i];
                var params = [e.id, e.user.id, e.libroCampo.id];
                tx.executeSql(sql, params);
            }
        },
        txErrorHandler,
        function(tx) {
            callback();
        }
        );
}

function txErrorHandler(tx) {
  console.log(tx);
    $.growl.error({ title: "Info.", message: "Update error" + tx });
}

var countDone = 0;
function log(string){
    $(".update-log").html(string  + "<br/>" + $(".update-log").html() );
    countDone += 1;
    if (countDone == 10){
        $(".update-log").html("<b>Synced group: " + localStorage.getItem("grupo") + " </b><br/>" + $(".update-log").html() );
    }
}
