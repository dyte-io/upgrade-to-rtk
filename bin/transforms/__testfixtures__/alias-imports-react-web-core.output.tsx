// @ts-nocheck
import Meeting from './components/Meeting';
import { useEffect } from 'react';
import { RealtimeKitProvider as YoloProvider, useRealtimeKitClient as useYoloClient } from '@cloudflare/realtimekit-react';

function App() {
    const [meeting, initMeeting] = useYoloClient();

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
    

    <YoloProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </YoloProvider>
}