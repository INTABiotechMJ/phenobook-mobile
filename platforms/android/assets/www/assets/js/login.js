
db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

var pass = "";

db.transaction(
	function(tx) {
		var user_id = localStorage.getItem('user');
		var sql = "SELECT pass FROM User WHERE ";
		sql += " id = '" + user_id + "'";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				var item = results.rows.item(0);
				pass = item.pass;
			});
	});
function txErrorHandler(tx) {
	console.log(tx.message);
}
$(".login").click(function(){
	if(localStorage.getItem('url') == "" || localStorage.getItem('url') == undefined){
		$(".alert").html("Please specify an application URL in settings.");
	}
	if(md5($("#pass").val()) == pass){
		window.location.href = "ensayos.html";
	}else{
		$(".login").attr("disabled", "disabled");
		$(".login").addClass("disabled");
		$(".alert").html("Invalid password");
		setTimeout(function(){
			$(".login").attr("disabled", false);
			$(".login").removeClass("disabled");
		}, 3000)
	}
});

function md5(string){
	return string;
}
