## Browser Meeting

This demo shows how to use Conversa to generate suggestions during meetings.

### Prerequisites

To build, test, and run demos from source you will need:

- Node 18 or higher
- npm 8.6.0 or higher
- ngrok dependency

Ensure you have AWS credentials configured in your `~/.aws` folder for a
role with a policy allowing `chime:CreateMeeting`, `chime:DeleteMeeting`, and
`chime:CreateAttendee`.

If you want to use media capture in `meetingV2`, the role policy will also
require `chime:CreateMediaCapturePipeline`, `chime:DeleteMediaCapturePipeline`,
and `s3:GetBucketPolicy`. In addition, ensure that an S3 ARN for a bucket
owned by the same AWS account that your credentials are for should be set in
the `CAPTURE_S3_DESTINATION` environment variable. The S3 bucket should be in
the same AWS region as the meeting and have the following bucket policy:

```
{
    "Version": "2012-10-17",
    "Id":"AWSChimeMediaCaptureBucketPolicy",
    "Statement": [
        {
            "Sid": "AWSChimeMediaCaptureBucketPolicy",
            "Effect": "Allow",
            "Principal": {
                "Service": "chime.amazonaws.com"
            },
            "Action": ["s3:PutObject", "s3:PutObjectAcl"],
            "Resource":"arn:aws:s3:::[bucket name]/*"
        }
    ]
}


### Running Conversa with a local server

1. Navigate to the `demos/browser` folder: `cd demos/browser`

2. Start the demo application: Run `npm install`, after that "npm run build". After that is completed, run "npm run start:all" and click on the http://localhost:8080

3. Open http://localhost:8080 in your browser.

4. On a seperate terminal, run this ngrok command: ngrok http 8080 --host-header=localhost.
This will generate a public endpoint URL that you will be able to send to other participants who can then join the meeting despite your session being run on a local host.

5. Back to your browser on port 8080, enter the meeting ID and Name.

6. Select your microphone and your camera.

7. Begin Conversafying !!!!

8. The panel on the left will generate real time suggestins as you converse.

```
