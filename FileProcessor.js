var AWS = require('aws-sdk');
var fs = require('fs');
var config = require(__dirname+'/config.json');
AWS.config.loadFromPath(__dirname+'/credentials.json');
var ElasticTranscoder = require(__dirname+'/elastictranscoder.js');
var winston = require('winston');
var filerotatedate = require('winston-filerotatedate');

var s3 = new AWS.S3();

winston.add(winston.transports.FileRotateDate, {
    filename: "main.log"
    , dirname: "logs"
});

function processFile(fullFilename,cb){
   fs.readFile(fullFilename, function(err,data){
      if (err) { throw err; }
      
      var originalFilename = fullFilename.split('/').pop();
      winston.info('originalFilename',originalFilename);

      s3.client.headObject({
         Bucket: config.S3.input,
         Key: originalFilename
      },function(err,response){
         if(!err && response['ContentLength']){
            winston.info('looks like file exists already',response);
            uploadFile(fullFilename,new Date().getTime() + "-" + originalFilename,data,cb);
         }else{
            uploadFile(fullFilename,originalFilename,data,cb);
         }
      })
   });
}

function uploadFile(fullFilename,filename,data,cb){
   fs.unlink(fullFilename, function (err) {
      if (err) throw err;
      winston.info('successfully deleted',fullFilename);
   });
   winston.info("Trying to upload file",filename,data.length,'bytes');
   s3.client.putObject({
      Bucket: config.S3.input,
      Key: filename,
      Metadata: {
         'Content-Disposition':'attachment',
         'Content-Type':'application/octet-stream'
         // 'Content-Type':'video/mp4'
      },
      Body: data
   },function (err,data) {
      if(!err){
         winston.info('Successfully uploaded package.\n',data);
         new ElasticTranscoder(AWS,config,filename,cb);
      }else
         cb(err);
   });
}

function test(test){
   console.log(test);
}

module.exports.processFile = processFile;
