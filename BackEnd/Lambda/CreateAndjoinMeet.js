import { ChimeSDKMeetings } from '@aws-sdk/client-chime-sdk-meetings';

const chimeSDKMeetings = new ChimeSDKMeetings({ region: 'us-east-1' });

// Create a unique id
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const handler = async (event, context, callback) => {
  event.body = {
    "attendeeName": "Ahmed"
  }
  
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
    body: '',
    isBase64Encoded: false,
  };
  
  console.log(event.body)
  
  const { attendeeName, region = 'us-east-1', ns_es } = event.body;

  if (!attendeeName) {
    response['statusCode'] = 400;
    response['body'] = 'Must provide a name';
    callback(null, response);
    return;
  }

  const request = {
    ClientRequestToken: uuid(),
    MediaRegion: region,
    ExternalMeetingId: "Meet Id.",
    MeetingFeatures: ns_es === 'true' ? 
      { Audio: { EchoReduction: 'AVAILABLE' } } : 
      undefined,
  };

  console.info(
    'Creating new meeting before joining: ' + JSON.stringify(request));

  let meetingInfo = await chimeSDKMeetings.createMeeting(request);


  console.info('Adding new attendee');
  const attendeeInfo = await chimeSDKMeetings.createAttendee({
    MeetingId: meetingInfo.Meeting.MeetingId,
    ExternalUserId: uuid(),
  });

  const joinInfo = {
    JoinInfo: {
      Meeting: meetingInfo.Meeting,
      Attendee: attendeeInfo.Attendee,
    },
  };

  response.body = JSON.stringify(joinInfo, '', 2);
  return response;
};


/*

Error i had:

{
  "errorType": "AccessDeniedException",
  "errorMessage": "User: arn:aws:sts::850071827025:assumed-role/LambdaToChimeSDK/LamdaFunToChime is not authorized to perform: chime:CreateMeeting on resource: arn:aws:chime:us-east-1:850071827025:meeting/* with an explicit deny in a service control policy",
  "trace": [
    "AccessDeniedException: User: arn:aws:sts::850071827025:assumed-role/LambdaToChimeSDK/LamdaFunToChime is not authorized to perform: chime:CreateMeeting on resource: arn:aws:chime:us-east-1:850071827025:meeting/* with an explicit deny in a service control policy",
    "    at throwDefaultError (/var/runtime/node_modules/@aws-sdk/node_modules/@smithy/smithy-client/dist-cjs/default-error-handler.js:8:22)",
    "    at /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/smithy-client/dist-cjs/default-error-handler.js:18:39",
    "    at de_CreateMeetingCommandError (/var/runtime/node_modules/@aws-sdk/client-chime-sdk-meetings/dist-cjs/protocols/Aws_restJson1.js:602:20)",
    "    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
    "    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24",
    "    at async /var/runtime/node_modules/@aws-sdk/middleware-signing/dist-cjs/awsAuthMiddleware.js:30:20",
    "    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/retryMiddleware.js:27:46",
    "    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:7:26",
    "    at async Runtime.handler (file:///var/task/index.mjs:54:21)"
  ]
}

*/

