// @ts-nocheck
import Meeting from './components/Meeting';
import { useEffect } from 'react';
import * as DyteCore from '@dytesdk/react-web-core';

function App() {
    const [meeting, initMeeting] = DyteCore.useDyteClient();

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
    

    <DyteCore.DyteProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </DyteCore.DyteProvider>
}