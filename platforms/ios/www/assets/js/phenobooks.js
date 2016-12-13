db = window.openDatabase("phenobook", "1.0", "phenobook", 200000);

db.transaction(
	function(tx) {
		var user_id = localStorage.getItem('user');
		var userGroup_id = localStorage.getItem('userGroup');
		var sql = "SELECT Phenobook.id, Phenobook.name,experimental_units_number FROM Phenobook WHERE Phenobook.userGroup = '" + userGroup_id  + "' ";
		console.log(sql)
		tx.executeSql(sql, [],
			function(tx, results) {
				var len = results.rows.length;
				i = 0;
				$(".phenobook-table").append("<tr><th>Phenobook</th><th class='text-center' colspan='2'>Options</th></tr>");
				for (; i < len; i = i + 1) {
					var item = results.rows.item(i);
					$(".phenobook-table").append("<tr><td>" + item.name  + "</td><td><a data-phenobook_name='" + item.name + "' data-id='" + item.id + "' data-exp_units='" + item.experimental_units_number + "' href='#' class='btn btn-default load-data btn-sm'>Load data</a></td><td><a class='btn btn-default see-table btn-sm' data-id='" + item.id + "'  data-exp_units='" + item.experimental_units_number + "' data-phenobook_name='" + item.name + "' href='#'>See table</a></td></tr>");
				}
				if(i==0){
					$(".phenobook-table-container").html("No phenobooks found");
				}
			});
	});
function txErrorHandler(tx) {
	console.log(tx.message);
}

$(document).on("click", ".load-data", function(){
	localStorage.setItem('phenobook', $(this).data("id"));
	localStorage.setItem('phenobook_name', $(this).data("phenobook_name"));
	localStorage.setItem('exp_units', $(this).data("exp_units"));
	window.location.href = "registry.html";
});

$(document).on("click", ".see-table", function(){
	localStorage.setItem('phenobook', $(this).data("id"));
	localStorage.setItem('phenobook_name', $(this).data("phenobook_name"));
	localStorage.setItem('exp_units', $(this).data("exp_units"));
	window.location.href = "table.html";
});
