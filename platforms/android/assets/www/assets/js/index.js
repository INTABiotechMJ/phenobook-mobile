db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

var pass = {};
var id = {};
var last_email = localStorage.getItem('last_email');

if(last_email){
	$("#email").val(last_email);
}

db.transaction(
	function(tx) {
		var sql = "SELECT email, pass, id FROM User WHERE 1";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				for (var i = 0; i < len; i++) {
					var item = results.rows.item(i);
					pass[item.email] = item.pass;
					id[item.email] = item.id;
				}
			});
	});

function txErrorHandler(tx) {
	console.log(tx.message);
}

$(".login").click(function(){
	if(localStorage.getItem('url') == "" || localStorage.getItem('url') == undefined){
		$(".alert").html("Please specify an application URL in settings.");
		return;
	}
	if($("#remember").is(':checked')){
		localStorage.setItem('remember_password', true);
		localStorage.setItem('remembered_password', $("#pass").val());
	}else{
		localStorage.setItem('remember_password', false);
		localStorage.setItem('remembered_password', "");
	}
	var email = $("#email").val();
	localStorage.setItem('last_email', email);
	if(md5($("#pass").val()) == pass[email]){
		localStorage.setItem('user', id[email]);
		window.location.href = "tpl/ensayos.html";
	}else{
		$(".login").attr("disabled", "disabled");
		$(".login").addClass("disabled");
		$(".alert").html("Invalid credentials");
		setTimeout(function(){
			$(".login").attr("disabled", false);
			$(".login").removeClass("disabled");
		}, 3000)
	}
});

function md5(string){
	return string;
}

$(".exit").click(function(){
	navigator.app.exitApp();
});

$("#update-btn").click(function(){
	if(localStorage.getItem('url') == "" || localStorage.getItem('url') == undefined){
		$(".alert").html("Please specify an application URL in settings.");
		return;
	}
	if($("#remember").is(':checked')){
		localStorage.setItem('remember_password', true);
		localStorage.setItem('remembered_password', $("#pass").val());
	}else{
		localStorage.setItem('remember_password', false);
		localStorage.setItem('remembered_password', "");
	}
	$(".alert").html();
	var email = $("#email").val();
	var pass = $("#pass").val();
	if(email == "" || pass == ""){
		$(".alert").html("Email and password are requierd");
		return false;
	}
	localStorage.setItem('last_email', email);
	localStorage.setItem('last_pass', pass);
	window.location.href = "tpl/update.html";
	return false;
});

var remember_password = localStorage.getItem("remember_password");
if(remember_password == "true"){
	$("#remember").prop('checked', true);
}

var remembered_password = localStorage.getItem("remembered_password");
if(remembered_password){
	$("#pass").val(remembered_password);
}
