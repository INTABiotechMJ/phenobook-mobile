db = window.openDatabase("phenobook", "1.0", "phenobook", 200000);
var INFORMATIVE_TYPE = 12;
var options = [];
var phenobook = localStorage.getItem('phenobook');
var phenobook_name = localStorage.getItem('phenobook_name');
$("#phenobook_name").html(phenobook_name);
db.transaction(
	function(tx) {
		// all variables for fieldtype except informative
		var sql = "SELECT id, name, fieldType FROM Variable WHERE id IN (SELECT variable FROM PhenobookVariable WHERE phenobook = '" + phenobook + "') AND NOT isInformative";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				i = 0;
				for (; i < len; i = i + 1) {
					var item = results.rows.item(i);
					$("#variable").append("<option value='" + item.id + "' data-fieldtype='" + item.fieldType + "'>" +  item.name + "</option>");
					var sql = "SELECT * FROM Category WHERE variable = '" + item.id + "'";
					tx.executeSql(sql, [],
						function(tx, results) {
							var len = results.rows.length;
							for (var i=0; i<len; i++){
								var option = results.rows.item(i);
								options.push(option);
							}
						}
					);
				}
				var fieldType = $('#variable option:selected').data("fieldtype");
				$(".value").removeClass("selected");
				$("*[data-fieldtype='" + fieldType + "']").removeClass("hide");
				$("*[data-fieldtype='" + fieldType + "']").addClass("selected");
				updateValue();
			}
		);
	}, txErrorHandler
);

//fill in exp units
var exp_units = localStorage.getItem("exp_units");
for (var i = 1; i <= exp_units; i++) {
	$("#exp_unit").append("<option value='" + i + "'>" +  i + "</option>");
}

//prev and next buttons
$("#next-par").click(function(){
	save(function (){
		$('#exp_unit option:selected').next().prop('selected', true);
		updateValue();
	});
	return false;
});
$("#prev-par").click(function(){
	save(function (){
		$('#exp_unit option:selected').prev().prop('selected', true);
		updateValue();
	});
	return false;
});

$("#next-var").click(function(){
	save(function (){
		$('#variable option:selected').next().prop('selected', true);
		var fieldtype = $('#variable option:selected').data("fieldtype");
		$(".photo").addClass("hide");
		$(".value").addClass("hide");
		$(".value").removeClass("selected");
		$("*[data-fieldtype='" + fieldtype + "']").removeClass("hide");
		$("*[data-fieldtype='" + fieldtype + "']").addClass("selected");
		updateValue();
	});
	return false;
});

$("#prev-var").click(function(){
	save(function (){
		$('#variable option:selected').prev().prop('selected', true);
		var fieldtype = $('#variable option:selected').data("fieldtype");
		$(".photo").addClass("hide");
		$(".value").addClass("hide");
		$(".audio").addClass("hide");
		$(".value").removeClass("selected");
		$("*[data-fieldtype='" + fieldtype + "']").removeClass("hide");
		$("*[data-fieldtype='" + fieldtype + "']").addClass("selected");
		updateValue();
	});
	return false;
});

$("#variable").change(function(){
	save(function (){
		var fieldtype = $('#variable option:selected').data("fieldtype");
		$(".photo").addClass("hide");
		$(".value").addClass("hide");
		$(".audio").addClass("hide");
		$(".value").removeClass("selected");
		$("*[data-fieldtype='" + fieldtype + "']").removeClass("hide");
		$("*[data-fieldtype='" + fieldtype + "']").addClass("selected");
		updateValue();
	});
	return false;
});

$("#exp_unit").change(function(){
	save(function (){
		updateValue();
	});
	return false;
});

var changed = false;
var tout;
function save(callback){
	if(!changed){
		callback();
		changed = false;
		return false;
	}
	changed = false;
	$(".save").addClass("disabled");
	var variable = $('#variable option:selected').val();
	if($('.value.selected').hasClass("isCheckbox")){
		if($(".value.selected").prop('checked')){
			var value = 1;
		}else{
			var value = 0;
		}
	}else{
		var value = $(".value.selected").val();
	}

	var exp_unit = $('#exp_unit option:selected').val();
	var variable_name = $('#variable option:selected').html();

	db.transaction(
		function(tx) {
			var sql = " UPDATE Registry SET" +
			" status = '0' " +
			" WHERE experimental_unit_number = ? AND variable = ? AND phenobook = ?";
			var params = [exp_unit, variable, phenobook];
			tx.executeSql(sql, params);

			var sql = " INSERT INTO Registry " +
			" (phenobook, user, value, experimental_unit_number, variable, status, updated, localStamp, latitude, longitude) " +
			" VALUES (?, ?, ?, ?,?, '1', '0', DATETIME('now'), ?, ?) ";
			var params = [localStorage.getItem('phenobook'),localStorage.getItem('user'), value, exp_unit, variable, localStorage.getItem('latitude'), localStorage.getItem('longitude')];
			tx.executeSql(sql, params);

			$(".update-container").html("Updated");
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

function updateValue(){
	var exp_unit = $('#exp_unit option:selected').val();
	var variable = $('#variable option:selected').val();
	if($(".value.selected").hasClass("isSelect")){
		$(".value.selected").html("<option value='-1'>Sel.</option>")
		options.forEach(function(option, index, array){
			if(option.variable == variable){
				$(".value.selected").append("<option value='" + option.id + "'>" +  option.name + "</option>")
			}
		});
	}
	$(".preview").attr("src", "");
	db.transaction(
		function(tx) {
			var sql = "SELECT Registry.fixed, Registry.value, Registry.updated, Variable.fieldType FROM Registry, Variable WHERE Registry.status = '1' AND Registry.variable = Variable.id AND experimental_unit_number = '" + exp_unit + "' AND variable = '" + variable + "' AND phenobook = '" + phenobook + "'";

			tx.executeSql(sql, [],
				function(tx, results) {
					var count = results.rows.length;
					$(".value.selected").prop('checked', false);
					$(".value.selected").attr("disabled",false);
					$(".takephoto").attr("disabled",false);
					if(count > 0){
						var value = results.rows.item(0).value;
						var fixed = results.rows.item(0).fixed;
						var updated = results.rows.item(0).updated;
						var fieldType = results.rows.item(0).fieldType;
						if(fieldType == 3){
							//is checkbox
							if(value == 1){
								$(".value.selected").prop('checked', true);
							}
						}
						else if (fieldType == 6) {
							//is foto
							$(".preview").attr("src", "data:image/jpeg;base64," + value);
						}else{
							if($(".value.selected").hasClass("isSelect") && (value == "" || value == -1)){
								$(".value.selected").val("-1");
							}else{
								$(".value.selected").val(value);
							}
						}
						if(fixed){
							$(".takephoto").attr("disabled","disabled");
							$(".value.selected").attr("disabled","disabled");
						}
					}else{
						$(".preview").attr("src", "");
						if($(".value.selected").hasClass("isSelect")){
							$(".value.selected").val("-1");
						}else{
							$(".value.selected").val("");
						}
					}
				}
			);
			var sql = "SELECT Registry.value, Registry.updated, Variable.fieldType, Variable.name FROM Registry, Variable WHERE Registry.phenobook = '" + phenobook + "' AND Registry.status = '1' AND Registry.variable = Variable.id AND experimental_unit_number = '" + exp_unit + "' AND isInformative";
			var items = new Array();
			tx.executeSql(sql, [],
				function(tx, results) {
					var len = results.rows.length;
					str = "";
					for (var i=0; i<len; i++){
						var res = results.rows.item(i);
						str += "<b>" + res.name + ": </b>" + res.value + " - ";
					}
					$(".info-win").html(str);

				});
			}, txErrorHandler);
		}


		$("body").on("change",".value.selected", function(){
			changed = true;
			$(".save").removeClass("disabled");
		});
		$("body").on("keydown",".value.selected", function(){
			changed = true;
			$(".save").removeClass("disabled");
		});


		function txErrorHandler(tx) {
			console.log(tx.message);
		}


		$("body").on("click", ".takephoto", function(){
			navigator.camera.getPicture(function(imageData) {
				$(".value.selected").val(imageData);
				$(".preview").attr("src", "data:image/jpeg;base64," + imageData);
				changed = true;
				$(".save").removeClass("disabled");
			}, function(err) {
				log("Error accessing camera");
			},
			{
				quality: 65,
				targetWidth: 320,
				targetHeight: 320,
				saveToPhotoAlbum: false,
				destinationType: Camera.DestinationType.DATA_URL
			});

		});

		$(".save").click(function(){
			save(function(){

			});
			return false;
		});




		$('.pickadate').pickadate(
			{
				format: "yyyy/mm/dd",
				editable: true
			});


			$(".pickatime").pickatime({
				clear: ""
			});

			$(".pickadate").mask("9999-99-99");
			var $input = $('.pickadate').pickadate();
