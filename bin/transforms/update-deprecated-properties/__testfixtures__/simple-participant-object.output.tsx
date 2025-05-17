import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting();

    meeting.participants.joined.toArray()[0].customParticipantId
}