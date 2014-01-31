# S3uploaderAndElasticTranscoder

AWS SDK based file S3 uploader and Elastic Transcoder Creator

## Installation

`npm install`

## Usage

Please make sure first you have created the `credentials.json` with all needed data like<br>
```
{ "accessKeyId": "YOUR_KEY", "secretAccessKey": "YOUR_SECRET", "region": "us-east-1" }
```
<br>
And run with the `node index.js` modifications!

### ForEachFile.js
This one goes thru hardcoded path and call the funtion for each MP4 files (without _ in name and 'backup' word in it)
Used to process the old backup of video files

### FYI

Always make sure you have proper `PresetId` for your availability zone, the same rule for `PipelineId` and zone.

## License

MIT
