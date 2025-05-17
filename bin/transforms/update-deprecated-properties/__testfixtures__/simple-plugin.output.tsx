import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

function Test( props: { t: any } ) {
    return (<></>);
}

export default function App() {
    const {meeting} = useRealtimeKitMeeting();
    
    meeting.plugins.all.toArray()[0].activateForSelf()
    meeting.plugins.all.toArray()[0].deactivateForSelf()
    return (
        <>
            <Test t={meeting.plugins.all.toArray()[0].activateForSelf() } />
            <Test t={meeting.plugins.all.toArray()[0].deactivateForSelf() } />
        </>
    )
}
    