var cradle = require('cradle');
var dbName = 'sensordata';
var connection;
var db;

function initConnection(url,cb){
  var cloudantHost;
  var cloudantUser;
  var cloudantPassword;
  // parse user, pass and hostname since cradle can't handle full url
  var re1 = /^https:\/\/(.*):(.*)@(.*)/;
  var result = re1.exec(url);
  if(result){
      cloudantUser = result[1];
      cloudantPassword = result[2];
      cloudantHost = result[3];
  }
  connection = new(cradle.Connection)(cloudantHost, {
      port : 443,
      cache: true,
			secure: true,
			raw: false,
	  	auth: { username: cloudantUser, password: cloudantPassword }
  });
	db = connection.database(dbName);
	db.exists(function(err,exists){
				if(err){
					console.log('Error accessing db' + err );
					cb(err,null);
				}else if(exists){
						console.log('db ' + dbName + ' exists');
						cb(null,'ok');
				}else{
					  console.log('db ' + dbName + ' will be created');
						db.create();
						cb(null,'ok');
				}
    });
}

function closeConnection(cb){
  if(connection){
    // get a bug
    //connection.close();
    connection = null;
    cb(null,"Connection closed")
  }
  else {
    cb("Trying to close empty Connection",null);
  }
}



function createViews(cb){
	db.save('_design/mutants', {
      all: {
          map: function (doc) {
              if (doc.name) emit(doc.name, doc);
          }
      },
  },function (err, res) {
		if(err){
			cb(err,null);
		}
		else{
			cb(null,'views created');
		}
	});
}
function createDoc(doc, cb){
	db.save(doc, function (err, res) {
      if(err){
				cb(err,null);
			}
			else {
			  cb(null,'doc saved');
			}
	});
}



function getMutants(cb){
  var result = '';
  db.view('mutants/all', function (err, res) {
    if(err){
        cb(err, null);
    }
    else{
      res.forEach(function (key, row, id) {
          result += row.name + '\\n';
      });
      cb(null,res);
    }
  });
}

module.exports = {
	initConnection: initConnection,
  closeConnection: closeConnection,
  createDoc: createDoc,
	createViews: createViews,
  getMutants:getMutants
};
