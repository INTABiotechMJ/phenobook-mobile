
db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

db.transaction(
	function(tx) {
		var user_id = localStorage.getItem('user');
		var sql = "SELECT LibroCampo.id, LibroCampo.nombre, LibroCampo.campo_numero FROM LibroCampo, UserLibroCampo WHERE ";
		sql += " LibroCampo.id = UserLibroCampo.libroCampo AND ";
		sql += " UserLibroCampo.user = '" + user_id + "'";
		console.log(sql);
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				i = 0;
				for (; i < len; i = i + 1) {

					var item = results.rows.item(i);
					$(".ensayos-list").append("<a class='item-link h3' data-id='" + item.id + "'  data-camponumero='" + item.campo_numero + "' href='#'><li class='list-group-item'>" + item.nombre  + "</li></a>");
				}
			});
	});
function txErrorHandler(tx) {
	console.log(tx.message);
}

$(document).on("click", ".item-link", function(){
	localStorage.setItem('ensayo', $(this).data("id"));
	localStorage.setItem('campo_numero', $(this).data("camponumero"));
	console.log($(this).data("camponumero"))
	window.location.href = "registro.html";
});
