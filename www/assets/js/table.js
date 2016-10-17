db = window.openDatabase("phenobook", "1.0", "phenobook", 200000);
var INFORMATIVE_TYPE = 12;
var PHOTO_TYPE = 6;
var OPTION_TYPE = 2;
var CHECK_TYPE = 3;

var phenobook = localStorage.getItem('phenobook');
var exp_units = localStorage.getItem('exp_units');
var phenobook_name = localStorage.getItem('phenobook_name');
$("#phenobook_name").html(phenobook_name);
var vars = [];
var opts = {};
var vars_name = [];
var vars_type = [];
var regs = {};
db.transaction(
	function(tx) {
		var sql = "SELECT Variable.id, Variable.name, Variable.fieldType FROM Variable WHERE id IN (SELECT variable FROM PhenobookVariable WHERE phenobook = '" + phenobook + "') AND isInformative";
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				for (var i=0; i<len; i++){
					var res = results.rows.item(i);
					vars.push(res.id);
					vars_name.push(res.name);
					vars_type.push(res.fieldType);
				}

				var sql = "SELECT id, name, variable FROM Category";
				tx.executeSql(sql, [],
					function(tx, results) {
						var len = results.rows.length;
						for (var i=0; i<len; i++){
							var res = results.rows.item(i);
							opts[res.variable + "_" + res.id] = res.name
						}

						var sql = "SELECT Variable.id, Variable.name, Variable.fieldType FROM Variable WHERE id IN (SELECT variable FROM PhenobookVariable WHERE phenobook = '" + phenobook + "') AND NOT isInformative";
						tx.executeSql(sql, [],
							function(tx, results) {
								var len = results.rows.length;
								for (var i=0; i<len; i++){
									var res = results.rows.item(i);
									vars.push(res.id);
									vars_name.push(res.name);
									vars_type.push(res.fieldType);
								}

								for (var i = 0; i < vars.length; i++) {
									var curr_var = vars[i];
									for (var eu = 1; eu <= exp_units ; eu++) {
										var sql = "SELECT Registry.value, Registry.experimental_unit_number, Registry.variable FROM Registry WHERE Registry.phenobook = '" + phenobook + "' AND Registry.status = '1' AND variable = '" + curr_var + "' AND experimental_unit_number = '" + eu + "'";
										tx.executeSql(sql, [],
											function(tx, results) {
												var len = results.rows.length;
												for (var j=0; j<len; j++){
													var res = results.rows.item(j);
													regs[res.experimental_unit_number + "_" + res.variable] = res.value;
												}
												updateTable();
											}
										);
									}
								}
							}
						);
					}
				);
			}
		);
	});
	function updateTable(){
		var table = "<tr>";
		table += "<th>Exp. unit</th>";
		for (var i = 0; i < vars_name.length; i++) {
			table += "<th>" + vars_name[i] + "</th>";
		}
		table += "</tr>";

		for (var eu = 1; eu <= exp_units; eu++) {
			table += "<tr>";
			table += "<td>" + eu + "</td>";

			for (var v = 0; v < vars.length; v++) {
				if(regs[eu + "_" + vars[v] ] != undefined){
					if (vars_type[v] == PHOTO_TYPE){
						table += "<td><img class='mini-img' src=data:image/png;base64," + regs[eu + "_" + vars[v] ] + "></td>";
					}else if (vars_type[v] == OPTION_TYPE) {
						table += "<td>" + opts[vars[v] + "_" + regs[eu + "_" + vars[v]]] + "</td>";
					}else if (vars_type[v] == CHECK_TYPE) {
						if(regs[eu + "_" + vars[v] ]  == 1){
							table += "<td>yes</td>";
						}else{
							table += "<td></td>";
						}
					}else if (true) {
						table += "<td>" + regs[eu + "_" + vars[v] ] + "</td>";
					}
				}else{
					table += "<td></td>";
				}
			}

			table += "</tr>";
		}
		$(".table").html(table);
	}
