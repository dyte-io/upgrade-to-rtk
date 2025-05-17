import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react'
import {useEffect} from 'react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting()
    const [activeParticpants, maxScreenShareCount, permissions, self, m] = useRealtimeKitSelector((meeting) => [
        meeting.participants.active,
        meeting.self.permissions.maxScreenShareCount,
        meeting.self.permissions,
        meeting.self,
        meeting
    ])
    
    activeParticpants;
    meeting.participants.active;

    maxScreenShareCount;
    permissions.maxScreenShareCount;
    self.permissions.maxScreenShareCount;
    m.self.permissions.maxScreenShareCount;
    meeting.self.permissions.maxScreenShareCount;
    
    useEffect(() => {
        meeting.joinRoom()
        meeting.leaveRoom().then().catch().finally()
        meeting.participants.disableAudio('participantId')
        meeting.participants.disableVideo('participantId')
        meeting.participants.kick('participantId')
        meeting.plugins.all[0].enable()
        meeting.plugins.all[0].disable()
    }, [])

    return (
        <>
        {meeting.participants.active}
        {meeting.self.permissions.acceptPresentRequests}
        {meeting.self.permissions.maxScreenShareCount}
        {meeting.self.permissions.canChangeParticipantRole}
        {meeting.self.permissions.produceAudio}
        {meeting.self.permissions.produceScreenshare}
        {meeting.self.permissions.produceVideo}
        {meeting.participants.joined[0].clientSpecificId}
        </>
    )
}