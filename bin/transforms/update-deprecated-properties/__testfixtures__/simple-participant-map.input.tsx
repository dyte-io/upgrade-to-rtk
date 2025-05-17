import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting();

    meeting.participants.active 
    meeting.participants.disableAudio('participantId') 
    meeting.participants.disableVideo('participantId') 
    meeting.participants.kick('participantId')
}