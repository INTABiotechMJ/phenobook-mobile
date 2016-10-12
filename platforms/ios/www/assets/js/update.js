db = window.openDatabase("phenobook", "1.0", "phenobook", 200000);

var __URL = localStorage.getItem('phenobook_url')+"files/php/scripts/app/";

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
      "updated INTEGER, " +
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
            dataType: "json",
            url: __URL + "import.php",
            data: {data: JSON.stringify(items),email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') }
          })
          .done(function( data ) {
            if(data.status == "auth_error"){
              log("Authentication error. Please check your credentials and try again.");
              return false;
            }
            if(data.status == "error"){
              log("Import error: " + data.msg);
              return false;
            }
            localStorage.setItem('last_update',data.msg);
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
    }
  );
  initDB(exporting);
}
function exporting(){

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
    updateOptions(data, function(){});
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
    url: __URL + "export-userGroups.php",
    data: {email: localStorage.getItem("last_email"), pass: localStorage.getItem('last_pass') },
  })
  .done(function( data ) {
    updateUserGroups(data, function(){});
  });
}
function initDB(callback){
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
      sql = "DROP TABLE IF EXISTS FieldOption";
      tx.executeSql(sql);
      sql = "DROP TABLE IF EXISTS UserGroup";
      tx.executeSql(sql);


      sql = "CREATE TABLE IF NOT EXISTS User ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "name VARCHAR(100), userGroup INTEGER, pass VARCHAR(300), email VARCHAR(300)) ";
      tx.executeSql(sql);

      sql = "CREATE TABLE IF NOT EXISTS Phenobook ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "name VARCHAR(100), " +
      "variableGroup INTEGER, " +
      "userGroup INTEGER, " +
      "experimental_units_number VARCHAR(100), " +
      "description VARCHAR(50)) ";
      tx.executeSql(sql);

      sql = "CREATE TABLE IF NOT EXISTS Variable ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "variableGroup INTEGER, " +
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
      "updated INTEGER, " +
      "mobile INTEGER, " +
      "fixed INTEGER, " +
      "value TEXT, " +
      "latitude VARCHAR(100), " +
      "longitude VARCHAR(100)) "
      tx.executeSql(sql);
      sql = "CREATE TABLE IF NOT EXISTS UserGroup ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "name INTEGER) "
      tx.executeSql(sql);

      sql = "CREATE TABLE IF NOT EXISTS VariableGroup ( " +
      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
      "name INTEGER, " +
      "userGroup INTEGER) "

      tx.executeSql(sql);


    }, txErrorHandler,function(tx,sql) {
      callback();
    });
  }


  function updateUsers(items, callback) {
    db.transaction(
      function(tx) {
        var l = items.length;
        log("Downloading " + l + " users ");
        tx.executeSql("DELETE FROM User");
        var sql = "INSERT OR REPLACE INTO User (id, name, pass, email, userGroup) " +
        " VALUES (?,?,?,?,?) ";
        var e;
        for (var i = 0; i < l; i++) {
          e = items[i];
          var params = [e.id, e.name,e.pass, e.email, e.userGroup.id];
          tx.executeSql(sql, params);
        }
      },
      txErrorHandler,
      function(tx,sql) {
        callback();
      });
    }

    function updatePhenobooks(items, callback) {
      db.transaction(
        function(tx) {
          var l = items.length;
          log("Downloading " + l + " phenobooks/s");
          var sql = " INSERT OR REPLACE INTO Phenobook " +
          " (id, name, experimental_units_number, description, userGroup, variableGroup) " +
          " VALUES (?,?,?,?,?,?) ";
          var e;
          for (var i = 0; i < l; i++) {
            e = items[i];
            var params = [e.id, e.name, e.experimental_units_number, e.description, e.userGroup.id, e.variableGroup.id];
            tx.executeSql(sql, params);
          }
        },
        txErrorHandler,
        function(tx,sql) {
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
          " VALUES (?, ?, ?, ?, ?, ?, ?) ";
          var e;
          for (var i = 0; i < l; i++) {
            e = items[i];
            var params = [e.id, e.name, e.variableGroup.id, e.defaultValue, e.required, e.description, e.fieldType.type];
            tx.executeSql(sql, params);
          }
        },
        txErrorHandler,
        function(tx,sql) {
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
            var params = [e.id,e.localStamp, e.user.id, e.stamp,e.experimental_unit_number, e.status,e.value,  e.phenobook.id, e.variable.id, e.fixed, e.mobile];
            tx.executeSql(sql, params);
          }
        },
        txErrorHandler,
        function(tx,sql) {
          callback();
        }
      );
    }

    function updateOptions(items, callback) {
      db.transaction(
        function(tx) {
          var l = items.length;
          log("Downloading " + l + " option/s");
          var sql = " INSERT OR REPLACE INTO FieldOption " +
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
        function(tx,sql) {
          callback();
        }
      );
    }
    function updateVariableGroups(items, callback) {
      db.transaction(
        function(tx) {
          var l = items.length;
          log("Downloading " + l + " variable group/s");
          var sql = " INSERT OR REPLACE INTO VariableGroup " +
          " (id, name, userGroup) " +
          " VALUES (?, ?, ?) ";
          var e;
          for (var i = 0; i < l; i++) {
            e = items[i];
            var params = [e.id, e.name, e.userGroup.id];
            tx.executeSql(sql, params);
          }
        },
        txErrorHandler,
        function(tx,sql) {
          callback();
        }
      );
    }
    function updateUserGroups(items, callback) {
      db.transaction(
        function(tx) {
          var l = items.length;
          log("Downloading " + l + " user group/s");
          var sql = " INSERT OR REPLACE INTO UserGroup " +
          " (id, name) " +
          " VALUES (?, ?) ";
          var e;
          for (var i = 0; i < l; i++) {
            e = items[i];
            var params = [e.id, e.name];
            tx.executeSql(sql, params);
          }
        },
        txErrorHandler,
        function(tx,sql) {
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
      if (countDone == 8){
        $(".update-log").html("<b>Synced successful</b><br/>" + $(".update-log").html() );
      }
    }
