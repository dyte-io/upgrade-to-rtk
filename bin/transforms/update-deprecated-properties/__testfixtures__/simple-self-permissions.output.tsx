// @ts-nocheck
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting();

    meeting.self.permissions.acceptStageRequests;
    meeting.self.permissions.canChangeParticipantPermissions;
    meeting.self.permissions.canProduceScreenshare;
    meeting.self.permissions.canProduceAudio;
    meeting.self.permissions.canProduceVideo;
}