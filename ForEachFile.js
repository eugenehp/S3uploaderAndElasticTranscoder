var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var S3uploaderAndElasticTranscoder = require('./index.js');

var files = fs.readdirSync(__dirname + '/../v/');

async.mapSeries(files,processVideo,function(err,results){
	console.log('async.mapSeries',err,results);
});

function processVideo(videoFile,cb) {
	console.log('processVideo',videoFile);
	var extension = videoFile.split('.').pop();
	var beginsWith_ = videoFile.indexOf('_') == 0;
	var hasBackupInIt = videoFile.indexOf('backup') != -1;
	var isMP4 = extension.toLowerCase() == 'mp4';

	if(isMP4 && !beginsWith_ && !hasBackupInIt){
		console.log('procssing file with the name',videoFile);
		S3uploaderAndElasticTranscoder.processFile(__dirname + '/../v/'+videoFile,cb);
	}else{
		cb(null);
	}
}