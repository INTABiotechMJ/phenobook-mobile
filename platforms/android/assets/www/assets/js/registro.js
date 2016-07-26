
db = window.openDatabase("FieldBook1", "1.0", "FieldBook", 200000);

//fill in options
var opciones = [];
db.transaction(
	function(tx) {
		var sql = "SELECT id, nombre, tipoCampo, nombreOriginal FROM Variable WHERE libroCampo = '" + localStorage.getItem('ensayo') + "'";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				i = 0;
				for (; i < len; i = i + 1) {
					var item = results.rows.item(i);
					$("#variable").append("<option value='" + item.id + "' data-tipocampo='" + item.tipoCampo + "'>" +  item.nombreOriginal + "</option>");
					//if(item.tipoCampo == "2"){
						//OPCIONES
						//TODO OPCIONES EN ARRAY
						var sql = "SELECT * FROM Opcion WHERE variable = '" + item.id + "'";
						tx.executeSql(sql, [],
							function(tx, results) {
								var len = results.rows.length;
								//$("select.valor").html("");
								//$("select.valor").append("<option value='-1'>Seleccionar</option>")
								for (var i=0; i<len; i++){
									var opcion = results.rows.item(i);
									opciones.push(opcion);

								//	$("select.valor").append("<option value='" + opcion.id + "'>" +  opcion.nombre + "</option>")
								//	if(opcion.opcionDefecto == "1"){
							//			$('select.valor option:last').attr('selected', 'selected');
							//		}
						}
					});
					//}
				}
				var tipoCampo = $('#variable option:selected').data("tipocampo");
				$(".valor").removeClass("selected");
				$("*[data-tipocampo='" + tipoCampo + "']").removeClass("hide");
				$("*[data-tipocampo='" + tipoCampo + "']").addClass("selected");
				loadParcelas();
			});



}, txErrorHandler
);


function loadParcelas(){
	db.transaction(
		function(tx) {
			sql = "SELECT id, numero FROM Parcela WHERE libroCampo = '" + localStorage.getItem('ensayo') + "'";
			tx.executeSql(sql, [],
				function(tx, results) {
					var len = results.rows.length;
					i = 0;
					for (; i < len; i = i + 1) {
						var item = results.rows.item(i);
						$("#parcela").append("<option value='" + item.id + "'>" +  item.numero + "</option>");
					}
					updateValor();
				});
		});
}


var changed = false;

$("body").on("change",".valor.selected", function(){
	changed = true;
	$(".save").removeClass("disabled");
});
$("body").on("keydown",".valor.selected", function(){
	changed = true;
	$(".save").removeClass("disabled");
});

$("#next-par").click(function(){
	save(function (){
		$('#parcela option:selected').next().prop('selected', true);
		updateValor();
	});
	return false;
});
$("#prev-par").click(function(){
	save(function (){
		$('#parcela option:selected').prev().prop('selected', true);
		updateValor();
	});
	return false;
});

$("#next-var").click(function(){
	save(function (){
		$('#variable option:selected').next().prop('selected', true);
		var tipoCampo = $('#variable option:selected').data("tipocampo");
		$(".photo").addClass("hide");
		$(".valor").addClass("hide");
		$(".valor").removeClass("selected");
		$("*[data-tipocampo='" + tipoCampo + "']").removeClass("hide");
		$("*[data-tipocampo='" + tipoCampo + "']").addClass("selected");
		updateValor();
	});
	return false;
});

$("#prev-var").click(function(){

	save(function (){
		$('#variable option:selected').prev().prop('selected', true);
		var tipoCampo = $('#variable option:selected').data("tipocampo");
		$(".photo").addClass("hide");
		$(".valor").addClass("hide");
		$(".audio").addClass("hide");
		$(".valor").removeClass("selected");
		$("*[data-tipocampo='" + tipoCampo + "']").removeClass("hide");
		$("*[data-tipocampo='" + tipoCampo + "']").addClass("selected");
		updateValor();
	});
	return false;
});

$("#variable").change(function(){
	save(function (){
		var tipoCampo = $('#variable option:selected').data("tipocampo");
		$(".valor").addClass("hide");
		$(".photo").addClass("hide");
		$(".audio").addClass("hide");
		$(".valor").removeClass("selected");
		$("*[data-tipocampo='" + tipoCampo + "']").removeClass("hide");
		$("*[data-tipocampo='" + tipoCampo + "']").addClass("selected");
		updateValor();
	});
	return false;
});

$("#parcela").change(function(){
	save(function (){
		updateValor();
	});
});



$(".save").click(function(){
	save(function(){

	});
	return false;
});

var tout;
function save(callback){
	if(!changed){
		callback();
		changed = false;
		return false;
	}
	changed = false;
	$(".save").addClass("disabled");
	var value = $(".valor.selected").val();

	var variable = $('#variable option:selected').val();
	var parcela = $('#parcela option:selected').val();
	var variable_name = $('#variable option:selected').html();
	var parcela_name = $('#parcela option:selected').html();
	db.transaction(
		function(tx) {
			var sql = " UPDATE Registro SET" +
			" status = '0' " +
			" WHERE parcela = ? AND variable = ? ";
			var params = [parcela, variable];
			tx.executeSql(sql, params);

			var sql = " INSERT INTO Registro " +
			" (user, valor, parcela, variable, status, updated, localStamp, latitude, longitude) " +
			" VALUES (?, ?, ?,?, '1', '0', DATETIME('now'), ?, ?) ";
			var params = [localStorage.getItem('user'), value, parcela, variable, localStorage.getItem('latitude'), localStorage.getItem('longitude')];
			tx.executeSql(sql, params);

			$(".update-container").html("Actualizado");
			clearTimeout(tout)
			tout = setTimeout(function() {
				$(".update-container").html("")
			}, 1300);

		},
		txErrorHandler,
		function(tx) {
			callback();
		}
		);
}

function updateValor(){
	var parcela = $('#parcela option:selected').val();
	var variable = $('#variable option:selected').val();
	if($(".valor.selected").hasClass("isSelect")){
		$(".valor.selected").html("<option value='-1'>Seleccionar</option>")
		opciones.forEach(function(opcion, index, array){
			if(opcion.variable == variable){
				$(".valor.selected").append("<option value='" + opcion.id + "'>" +  opcion.nombre + "</option>")
			}
		});
	}
	$(".preview").attr("src", "");
	db.transaction(
		function(tx) {
			var sql = "SELECT Registro.valor, Registro.updated, Variable.tipoCampo FROM Registro, Variable WHERE Registro.status = '1' AND Registro.variable = Variable.id AND parcela = '" + parcela + "' AND variable = '" + variable + "'";
			tx.executeSql(sql, [],
				function(tx, results) {
					var count = results.rows.length;
					if(count > 0){
						var valor = results.rows.item(0).valor;
						var updated = results.rows.item(0).updated;
						var tipoCampo = results.rows.item(0).tipoCampo;
						if(tipoCampo == 6){
							//is foto
							$(".preview").attr("src", "data:image/jpeg;base64," + valor);
						}else{
							if($(".valor.selected").hasClass("isSelect") && (valor == "" || valor == -1)){
								$(".valor.selected").val("-1");
							}else{
								$(".valor.selected").val(valor);
							}
						}
					}else{
						$(".preview").attr("src", "");
						if($(".valor.selected").hasClass("isSelect")){
							$(".valor.selected").val("-1");
						}else{
							$(".valor.selected").val("");
						}
					}1
				}
				);
			var sql = "SELECT InfoEnsayo.nombre, ValorInfoEnsayo.valor FROM InfoEnsayo, ValorInfoEnsayo WHERE parcela = '" + parcela + "' AND ValorInfoEnsayo.infoEnsayo = InfoEnsayo.id";
			var items = new Array();
			tx.executeSql(sql, [],
				function(tx, results) {
					var len = results.rows.length;
					str = "";
					for (var i=0; i<len; i++){
						var res = results.rows.item(i);
						str += "<b>" + res.nombre + ": </b>" + res.valor + " - ";
					}
					$(".info-ensayo").html(str);

				});

		}, txErrorHandler);



}
function txErrorHandler(tx) {
	console.log(tx.message);
}



$('.pickadate').pickadate(
{
	format: "dd/mm/yyyy",
	editable: true
});


$(".pickatime").pickatime({
	clear: ""
});

$(".pickadate").mask("99/99/9999");
var $input = $('.pickadate').pickadate();

$("body").on("click", ".takephoto", function(){
	navigator.camera.getPicture(function(imageData) {
		$(".valor.selected").val(imageData);
		$(".preview").attr("src", "data:image/jpeg;base64," + imageData);
		changed = true;
		$(".save").removeClass("disabled");
	}, function(err) {
		log("Error al acceder a la cámara");
	},
	{
		quality: 65,
		targetWidth: 320,
		targetHeight: 320,
		saveToPhotoAlbum: false,
		destinationType: Camera.DestinationType.DATA_URL
	});

});


$("body").on("click", ".takeaudio", function(){
	var recorder = new Object;
	recorder.record = function() {
		window.plugins.audioRecorderAPI.record(function(msg) {

			alert('ok: ' + msg);
		}, function(msg) {
			alert('ko: ' + msg);
		}, 30);
	}
});


function log(string){
	$(".update-container").html(string);
	clearTimeout(tout)
	tout = setTimeout(function() {
		$(".update-container").html("")
	}, 1300);
}
$(document).ready(function(){
	$("#exp_unit").html(localStorage.getItem("campo_numero"));
});


var onSuccess = function(position) {
  localStorage.setItem('latitude',position.coords.latitude);
  localStorage.setItem('longitude',position.coords.longitude);
};

function onError(error) {
  console.log("GPS Error: " + error.code + " - " + error.message);
}
navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
