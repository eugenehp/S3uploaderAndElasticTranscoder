var AWS = require('aws-sdk');
var fs = require('fs');
var config = require(__dirname+'/config.json');
AWS.config.loadFromPath(__dirname+'/credentials.json');
var ElasticTranscoder = require(__dirname+'/elastictranscoder.js');

var s3 = new AWS.S3();

var originalFilename = "demo.flv";

if(process.argv.length>=3)
   originalFilename = process.argv[2];

fs.readFile(__dirname+'/'+originalFilename, function(err,data){
   if (err) { throw err; }
   
   s3.client.headObject({
      Bucket: config.S3.input,
      Key: originalFilename
   },function(err,response){
      if(!err && response['ContentLength']){
         console.log('looks like file exists already',response);
         uploadFile(new Date().getTime() + "-" + originalFilename,data);
      }else{
         uploadFile(originalFilename,data);
      }
   })
});

function uploadFile(filename,data){
   console.log("Trying to upload file",filename,data.length,'bytes');
   s3.client.putObject({
      Bucket: config.S3.input,
      Key: filename,
      Body: data
   },function (err,data) {
      if(!err){
         console.log('Successfully uploaded package.\n',data);
         new ElasticTranscoder(AWS,config,filename);
      }else
         throw err;
   });
}