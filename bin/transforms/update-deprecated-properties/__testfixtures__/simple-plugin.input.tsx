import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

function Test( props: { t: any } ) {
    return (<></>);
}

export default function App() {
    const {meeting} = useRealtimeKitMeeting();

    meeting.plugins.all.toArray()[0].enable()
    meeting.plugins.all.toArray()[0].disable()
    return (
        <>
            <Test t={meeting.plugins.all.toArray()[0].enable() } />
            <Test t={meeting.plugins.all.toArray()[0].disable() } />
        </>
    )
}