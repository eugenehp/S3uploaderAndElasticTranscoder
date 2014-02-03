var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');
var ElasticTranscoder = require(__dirname+'/elastictranscoder.js');
var config = require(__dirname+'/config.json');
AWS.config.loadFromPath(__dirname+'/credentials.json');


var s3 = new AWS.S3().client;

var COUNT = 0;

function test(err,data){
	if(data['Contents']){
		if(util.isArray(data['Contents'])){
			var array = data['Contents'];
			if(array.length>0){
				processArray(array);
				var last = array.pop();
				var time = last['LastModified'];
				var name = last['Key'];

				COUNT += array.length;
				console.log('\n=======\n',COUNT,name,'\n=======\n');
				recursive(name);
			}
		}
	}
}

function recursive(Marker){
	var params = {
		Bucket:"celebvm-video",
		MaxKeys:1000
	};
	if(Marker)
		params['Marker'] = Marker;
	s3.listObjects(params,test);	
}

function processArray(array){
	for(var i in array){
		var file = array[i];
		processFile(file);
	}
}

function processFile(file){
	var filename = file['Key'];
	if(filename.toLowerCase().indexOf('.mp4')!=-1){
		console.log(filename);
		async.waterfall([
			function(callback){
				copyFile(file,function(err,data){
					if(!err)console.log('copied')
					callback(err,file);
				});
			},
			function(file,callback){
				deleteFile(file,function(err,data){
					if(!err)console.log('deleted')
					callback(err,file);
				});
			}
		],function(err,results){
			if(!err){
				new ElasticTranscoder(AWS,config,filename,function(err,data){
					console.log('ElasticTranscoder finished');
					console.log(err);
					console.log(data);
				});
			}else{
				console.log('Erorrs durind',file['Key'],'transcoding');
				console.log(err);
				console.log(results);
			}
		});
	}
}

function copyFile(file,cb){
	var filename = file['Key'];
	var basename = filename.split('.')[0];
	var sourceFilename = config.input+'/'+filename;

	var params = {
		CopySource:sourceFilename,
		ACL:"public-read",
		Bucket:config.output,
		Key:filename,
	};

	s3.copyObject(params,cb);
}

function deleteFile(file,cb){
	var params = {
		Bucket:config.input,
		Key:file['Key'],
	};

	s3.deleteObject(params,cb);
}

recursive();