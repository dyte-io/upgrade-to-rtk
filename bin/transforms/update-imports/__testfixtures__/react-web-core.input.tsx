// @ts-nocheck
import Meeting from './components/Meeting';
import { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';

function App() {
    const [meeting, initMeeting] = useDyteClient();

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
    

    <DyteProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </DyteProvider>
}