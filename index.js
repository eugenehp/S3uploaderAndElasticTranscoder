var AWS = require('aws-sdk');
var config = require('./config.json');
AWS.config.loadFromPath('./credentials.json');
var elastictranscoder = new AWS.ElasticTranscoder({apiVersion: '2012-09-25'});

console.log(config);

var original = "demo.flv";
var filename = original.split('.')[0];

var params = {
	"Input":{
      "Key":original,
      "FrameRate":"auto",
      "Resolution":"auto",
      "AspectRatio":"auto",
      "Interlaced":"auto",
      "Container":"mp4"
   },
   "OutputKeyPrefix":filename+"/",
   "Outputs":[
      {
         "Key":"iphone/"+filename+"-2M",
         "ThumbnailPattern":"iphone/th2M/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":config.HLS['2M'].PresetId,
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-1.5M",
         "ThumbnailPattern":"iphone/th1.5M/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":config.HLS['1.5M'].PresetId,
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-1M",
         "ThumbnailPattern":"iphone/th1M/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":config.HLS['1M'].PresetId,
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-600k",
         "ThumbnailPattern":"iphone/th600k/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":config.HLS['600k'].PresetId,
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-400k",
         "ThumbnailPattern":"iphone/th400k/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":config.HLS['400k'].PresetId,
         "SegmentDuration":"5"
      },
      {
      	"Key":"webm/"+filename+".webm",
      	"ThumbnailPattern":"webm/"+filename+"-{count}",
      	"Rotate":"0",
      	"PresetId":config.WebM.PresetId
      },
      {
      	"Key":"web/"+filename+".mp4",
      	"ThumbnailPattern":"web/"+filename+"-{count}",
      	"Rotate":"0",
      	"PresetId":config.Web.PresetId
      }
   ],
   "Playlists": [
      {
         "Format": "HLSv3",
         "Name": "playlist-iPhone-"+filename,
         "OutputKeys": [
            "iphone/"+filename+"-2M",
            "iphone/"+filename+"-1.5M",
            "iphone/"+filename+"-1M",
            "iphone/"+filename+"-600k",
            "iphone/"+filename+"-400k"
         ]
      }
   ],
   "PipelineId":config.PipelineId
};
var callback = function(err, data){
	if(err)
		console.log(err);
	else
		console.log(data);
}

// elastictranscoder.createJob(params, callback);
// elastictranscoder.listPipelines({},callback);
// elastictranscoder.readJob({Id:"1391012229363-mokb38"},callback);