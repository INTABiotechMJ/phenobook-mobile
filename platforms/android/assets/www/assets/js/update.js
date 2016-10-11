db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

var __URL = localStorage.getItem('url')+"files/php/scripts/app/";

local = false;
if(!local){
  var isOffline = 'onLine' in navigator && !navigator.onLine;
  if (isOffline) {
    log("There's no Internet conection")
    throw new Error("No connection");
  }
}


function upload(callback){

  db.transaction(
    function(tx) {
      sql = "CREATE TABLE IF NOT EXISTS Variable ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "variableGroup VARCHAR(100), " +
      "name VARCHAR(100), " +
      "defaultValue VARCHAR(100), " +
      "required INTEGER, " +
      "description VARCHAR(100), " +
      "fieldType INTEGER)"
      tx.executeSql(sql);

      sql = "CREATE TABLE IF NOT EXISTS Registry ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "user INTEGER, " +
      "localStamp DATETIME, " +
      "stamp DATETIME, " +
      "experimental_unit_number INTEGER, " +
      "variable INTEGER, " +
      "status INTEGER, " +
      "phenobook INTEGER, " +
      "mobile INTEGER, " +
      "fixed INTEGER, " +
      "value TEXT, " +
      "latitude VARCHAR(100), " +
      "longitude VARCHAR(100)) "
      tx.executeSql(sql);

      var sql = "SELECT Registry.*, Variable.fieldType FROM Registry, Variable WHERE Registry.variable = Variable.id AND updated = '0' AND status = '1'";
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
            url: __URL + "import.php",
            data: {data: JSON.stringify(items),email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') }
          })
          .done(function( data ) {
            if(data == "error"){
              log("Authentication server error. Please check your credentials and try again.");
              return false;
            }
            localStorage.setItem('last_update',data);
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
      var sql = "UPDATE Registry SET updated = '1'";
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
      url: __URL + "export-phenobooks.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updatePhenobooks(data, function(){});
    });

    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-variableGroups.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateVariableGroups(data, function(){});
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
      url: __URL + "export-options.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateOoptions(data, function(){});
    });

    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-registries.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateRegistries(data, function(){});
    });


    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-userPhenobooks.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateUserPhenobooks(data, function(){});
    });
    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-groups.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateGroups(data, function(){});
    });

    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-groupPhenobooks.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateGroupPhenobooks(data, function(){});
    });

    $.ajax({
      dataType: "json",
      type: "POST",
      url: __URL + "export-userGroups.php",
      data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
    })
    .done(function( data ) {
      updateUserGroups(data, function(){});
    });


  }
  function initDB(){
    db.transaction(
      function(tx) {
        var sql = "DROP TABLE IF EXISTS User";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS Phenobook";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS VariableGroup";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS Variable";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS Registry";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS Option";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS UserUserGroup";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS UserGroup";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS PhenobookUser";
        tx.executeSql(sql);
        sql = "DROP TABLE IF EXISTS PhenobookUserGroup";
        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS User ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(100), pass VARCHAR(300), email VARCHAR(300)) ";
        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS Phenobook ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(100), " +
        "experimental_units_number VARCHAR(100), " +
        "description VARCHAR(50)) ";
        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS Variable ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "variableGroup VARCHAR(100), " +
        "name VARCHAR(100), " +
        "defaultValue VARCHAR(100), " +
        "required INTEGER, " +
        "description VARCHAR(100), " +
        "fieldType INTEGER)"

        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS FieldOption ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name VARCHAR(100), " +
        "variable INTEGER, " +
        "defaultValue INTEGER) "
        tx.executeSql(sql);


        sql = "CREATE TABLE IF NOT EXISTS Registry ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "user INTEGER, " +
        "localStamp DATETIME, " +
        "stamp DATETIME, " +
        "experimental_unit_number INTEGER, " +
        "variable INTEGER, " +
        "status INTEGER, " +
        "phenobook INTEGER, " +
        "mobile INTEGER, " +
        "fixed INTEGER, " +
        "value TEXT, " +
        "latitude VARCHAR(100), " +
        "longitude VARCHAR(100)) "
        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS PhenobookUser ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "user INTEGER, " +
        "phenobook INTEGER) "
        tx.executeSql(sql);


        sql = "CREATE TABLE IF NOT EXISTS PhenobookUserGroup ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "userGroup INTEGER, " +
        "phenobook INTEGER) "
        tx.executeSql(sql);

        sql = "CREATE TABLE IF NOT EXISTS UserGroup ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "name INTEGER) "
        tx.executeSql(sql);


        sql = "CREATE TABLE IF NOT EXISTS UserUserGroup ( " +
        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "user INTEGER, " +
        "userGroup INTEGER) "
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

      function updatePhenobooks(items, callback) {
        db.transaction(
          function(tx) {
            var l = items.length;
            log("Downloading " + l + " phenobooks/s");
            var sql = " INSERT OR REPLACE INTO Phenobook " +
            " (id, name, experimental_units_number, description) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
              e = items[i];
              var params = [e.id, e.name, e.experimental_units_number, e.description];
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
            " (id, name, variableGroup, defaultValue, required, description, fieldType) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
              e = items[i];
              var params = [e.id, e.name, e.variableGroup, e.defaultValue, e.required, e.description, e.fieldType.type];
              tx.executeSql(sql, params);
            }
          },
          txErrorHandler,
          function(tx) {
            callback();
          }
        );
      }


      function updateRegistries(items, callback) {
        db.transaction(
          function(tx) {
            var l = items.length;
            log("Downloading " + l + " registries/s");
            var sql = " INSERT OR REPLACE INTO Registry " +
            " (id,localStamp,  user, stamp,experimental_unit_number, status, value, phenobook, variable,fixed,mobile,updated) " +
            " VALUES (?, ?, ?, ?, ?,?, ?,?,?,?,?, '1') ";
            var e;
            for (var i = 0; i < l; i++) {
              e = items[i];
              var params = [e.id,e.localStamp, e.user.id, e.stamp,e.experimental_unit_number, e.status,  e.phenobook.id, e.variable.id, e.fixed];
              tx.executeSql(sql, params);
            }
          },
          txErrorHandler,
          function(tx) {
            callback();
          }
        );
      }

      function updateFieldOptions(items, callback) {
        db.transaction(
          function(tx) {
            var l = items.length;
            log("Downloading " + l + " option/s");
            var sql = " INSERT OR REPLACE INTO Opcion " +
            " (id, name, variable, defaultValue) " +
            " VALUES (?, ?, ?, ?) ";
            var e;
            for (var i = 0; i < l; i++) {
              e = items[i];
              var params = [e.id, e.name, e.variable.id, e.defaultValue];
              tx.executeSql(sql, params);
            }
          },
          txErrorHandler,
          function(tx) {
            callback();
          }
        );
      }

      function updateUserPhenobook(items, callback) {
        db.transaction(
          function(tx) {
            var l = items.length;
            log("Downloading " + l + " user values");
            var sql = " INSERT OR REPLACE INTO UserPhenobook " +
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
        if (countDone == 11){
          $(".update-log").html("<b>Synced successful</b><br/>" + $(".update-log").html() );
        }
      }
