// @ts-nocheck
import Meeting from './components/Meeting';
import { useEffect } from 'react';
import { RealtimeKitProvider, useRealtimeKitClient } from '@cloudflare/realtimekit-react';

function App() {
    const [meeting, initMeeting] = useRealtimeKitClient();

    useEffect(() => {
        initMeeting({
          authToken: '',
          defaults: {
            audio: false,
            video: false,
          },
        }).then((meeting) => {
          Object.assign(window, { meeting });
        });
    }, []);
    

    <RealtimeKitProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </RealtimeKitProvider>
}