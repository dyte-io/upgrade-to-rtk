import RealtimeKitClient from '@cloudflare/realtimekit';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';

export default function App() {
	const {meeting} = useRealtimeKitMeeting();
	
	useEffect(() => {		
		const joinRoom = meeting.joinRoom;
		const leaveRoom = meeting.leaveRoom;
		
		meeting.joinRoom();
		meeting.leaveRoom();

		meeting?.joinRoom();
		meeting?.leaveRoom();
		
		joinRoom();
		leaveRoom();
		foo(meeting)
	}, [])
	
	function foo(meeting: RealtimeKitClient) {
		meeting.joinRoom();
		meeting.leaveRoom();
	}
}