var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');
var ElasticTranscoder = require(__dirname+'/elastictranscoder.js');
var config = require(__dirname+'/config.json');
AWS.config.loadFromPath(__dirname+'/credentials.json');


var s3 = new AWS.S3().client;

var COUNT = 0;
var MP4 = 0;

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

var Bucket = "celebvm-output-video";
function recursive(Marker){
	var params = {
		Bucket:Bucket,
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
	var extension = filename.split('.').pop();
	if(extension.toLowerCase()=='mp4'){
		copyFile(file,function(err,data){
			MP4++;
			console.log(MP4,filename,'finished processing',err);
		});
	}
}


function copyFile(file,cb){
	var filename = file['Key'];
	var basename = filename.split('.')[0];
	var sourceFilename = Bucket+'/'+filename;

	var params = {
		CopySource:sourceFilename,
		ACL:"public-read",
		Bucket:Bucket,
		MetadataDirective:'REPLACE',
		Metadata: {
			'Content-Disposition':'attachment',
			// 'Content-Type':'application/octet-stream'
			'Content-Type':'video/mp4'
		},
		Key:filename,
	};

	s3.copyObject(params,cb);
}

recursive();
// function init(){
// 	console.log('=============================');
// 	console.log(new Date());
// 	console.log('=============================');
// 	recursive();
// 	setTimeout(init,10*1000);
// }
// init();
