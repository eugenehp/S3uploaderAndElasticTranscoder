var AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
var elastictranscoder = new AWS.ElasticTranscoder({apiVersion: '2012-09-25'});

var original = "BigBuckBunny_320x180.mp4";
var filename = new Buffer(original).toString('base64');

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
         "PresetId":"1351620000001-200010",
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-1.5M",
         "ThumbnailPattern":"iphone/th1.5M/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":"1351620000001-200020",
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-1M",
         "ThumbnailPattern":"iphone/th1M/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":"1351620000001-200030",
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-600k",
         "ThumbnailPattern":"iphone/th600k/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":"1351620000001-200040",
         "SegmentDuration":"5"
      },
      {
         "Key":"iphone/"+filename+"-400k",
         "ThumbnailPattern":"iphone/th400k/"+filename+"-{count}",
         "Rotate":"0",
         "PresetId":"1351620000001-200050",
         "SegmentDuration":"5"
      },
      {
      	"Key":"webm/"+filename,
      	"ThumbnailPattern":"webm/"+filename+"-{count}",
      	"Rotate":"0",
      	"PresetId":"1390965036083-imf6bl"
      },
      {
      	"Key":"web/"+filename,
      	"ThumbnailPattern":"web/"+filename+"-{count}",
      	"Rotate":"0",
      	"PresetId":"1351620000001-100070"
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
   "PipelineId":"1390957473527-0bnqqi"
};
var callback = function(err, data){
	if(err)
		console.log(err);
	else
		console.log(data);
}

elastictranscoder.createJob(params, callback);
// elastictranscoder.listPipelines({},callback);
// elastictranscoder.readJob({Id:"1391012229363-mokb38"},callback);