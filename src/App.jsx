import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import { MeetingSessionConfiguration } from 'amazon-chime-sdk-js';


function App() {
  const apiEndpoint = 
    "https://80ug8xcwk5.execute-api.us-east-1.amazonaws.com/videomeet";
  const meetingManager = useMeetingManager();

  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const response = await fetch('/my-server');
    const data = await response.json();

    // Initialize the `MeetingSessionConfiguration`
    const meetingSessionConfiguration = new MeetingSessionConfiguration(data.Meeting, data.Attendee);

    // Create a `MeetingSession` using `join()` function with the `MeetingSessionConfiguration`
    await meetingManager.join(meetingSessionConfiguration);

    // At this point you could let users setup their devices, or by default
    // the SDK will select the first device in the list for the kind indicated
    // by `deviceLabels` (the default value is DeviceLabels.AudioAndVideo)
    // ...

    // Start the `MeetingSession` to join the meeting
    await meetingManager.start();
  };

  return <button onClick={joinMeeting}>Join</button>;
}

export default App
