// @ts-nocheck
import RealtimeKitClient from '@cloudflare/realtimekit';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';

export default function App() {
    const {meeting} = useRealtimeKitMeeting();
    
    useEffect(() => {
        const joinRoom = meeting.join;
        const leaveRoom = meeting.leave;
        
        meeting.join();
        meeting.leave();

        meeting?.join();
		meeting?.leave();
        
        joinRoom();
        leaveRoom();
        foo(meeting)
    }, [])
    
    function foo(meeting: RealtimeKitClient) {
        meeting.join();
        meeting.leave();
    }
}