const AWS = require('aws-sdk');
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

exports.handler = async event => {
  try {
    const body = JSON.parse(event.body);
    const { title, name } = body;

    if (!title || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing title or name' }),
      };
    }

    const requestToken = title;

    let meeting;
    try {
      meeting = await chime
        .createMeeting({
          ClientRequestToken: requestToken,
          MediaRegion: 'ap-southeast-2',
        })
        .promise();
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error creating meeting', detail: err.message }),
      };
    }

    let attendee;
    try {
      attendee = await chime
        .createAttendee({
          MeetingId: meeting.Meeting.MeetingId,
          ExternalUserId: name,
        })
        .promise();
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error creating attendee', detail: err.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        JoinInfo: {
          Meeting: meeting.Meeting,
          Attendee: attendee.Attendee,
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', detail: err.message }),
    };
  }
};
