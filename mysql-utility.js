var mysql     =    require('mysql');
var pool      =    mysql.createPool({
					     connectionLimit : 2, //important
						 host     : '185.64.106.145',
						 user     : 'emailaut_usr',
						 password : 'No{x@x#mZJ+A',
						 database : 'emailaut_db',
					     debug    :  false
 					});

 var connect_db = function get_connection() {

	return new Promise((resolve, reject) => {

		  pool.getConnection(function(err, connection) {

			if(err) {
				console.log(":::::::::::::::::::err:::::::::::::::::"+err);
				reject(err);
			}
			else {
				resolve(connection);
			}
		});

	});
};

module.exports = { pool , connect_db };
