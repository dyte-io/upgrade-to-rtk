// @ts-nocheck
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting();

    meeting.self.permissions.acceptPresentRequests;
    meeting.self.permissions.canChangeParticipantRole;
    meeting.self.permissions.produceScreenshare;
    meeting.self.permissions.produceAudio;
    meeting.self.permissions.produceVideo;
}