db = window.openDatabase("phenobook", "1.0", "phenobook", 200000);

var userGroup = {};
var pass = {};
var id = {};
var last_email = localStorage.getItem('last_email');
var last_update = localStorage.getItem('last_update');

if(last_email){
	$("#email").val(last_email);
}
if(localStorage.getItem('phenobook_url') == undefined){
	localStorage.setItem('phenobook_url','http://getphenobook.com/');
}

if(last_update){
	var last_update_str = "Last update: " + last_update + " (" + timeSince(last_update) + " ago)";
	$(".alert").html(last_update_str);
	$(".login").attr("disabled",false);
}else{
	$(".alert").html("Last update: Never. <br>Since this is the first time you access you need to run an update before loggin in");
	$(".login").attr("disabled","disabled");
}

db.transaction(
	function(tx) {
		var sql = "SELECT email, pass, id, userGroup FROM User WHERE 1";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				for (var i = 0; i < len; i++) {
					var item = results.rows.item(i);
					pass[item.email] = item.pass;
					userGroup[item.email] = item.userGroup;
					id[item.email] = item.id;
				}
			}
		);
	}
);

$("#remember").change(function(){
	if($(this).is(':checked')){
		localStorage.setItem('remember_password', true);
		localStorage.setItem('remembered_password', $("#pass").val());
	}else{
		localStorage.setItem('remember_password', false);
		localStorage.setItem('remembered_password', "");
	}
});

function txErrorHandler(tx) {
	console.log(tx.message);
}

$(".login").click(function(){
	if(localStorage.getItem('url') == ""){
		$(".alert").html("Please specify a sever URL in settings.");
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
		localStorage.setItem('userGroup', userGroup[email]);
		window.location.href = "tpl/phenobooks.html";
	}else{
		$(".login").attr("disabled", "disabled");
		$(".login").addClass("disabled");
		$(".alert").html("Invalid credentials");
		setTimeout(function(){
			$(".login").attr("disabled", false);
			$(".login").removeClass("disabled");
		}, 3000)
	}
	return false;
});

function md5(string){
	return string;
}

$(".exit").click(function(){
	navigator.app.exitApp();
});

$("#update-btn").click(function(){
	if(localStorage.getItem('url') == ""){
		$(".alert").html("Please specify a server URL in settings.");
		return false;
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



function timeSince(correctStart) {
	var date = new Date(correctStart);
	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}
