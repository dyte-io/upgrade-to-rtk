// @ts-nocheck
import { useEffect } from 'react';
import {
  DyteProvider as YoloProvider,
  useDyteClient as useYoloClient,
  useDyteMeeting as useYoloMeeting,
} from '@dytesdk/react-web-core';
import { DyteDialogManager as YoloDialogManager, DyteUiProvider as YoloUiProvider } from '@dytesdk/react-ui-kit';
import InMeeting from './in-meeting';
import {
  DyteEndedScreen as YoloEndedScreen,
  DyteIdleScreen as YoloIdleScreen,
  DyteSetupScreen as YoloSetupScreen,
  DyteWaitingScreen as YoloWaitingScreen,
} from '@dytesdk/react-ui-kit';
import { useCustomStatesStore, useStatesStore } from '../store';
import SetupScreen from './setup-screen';

function CustomDyteMeeting() {
  const states = useStatesStore((s) => s.states);
  const customStates = useCustomStatesStore((s) => s.states);
  console.log(states, customStates);

  switch (states.meeting) {
    case 'idle':
      return <YoloIdleScreen />;
    case 'setup':
      return <SetupScreen />;
    case 'waiting':
      return <YoloWaitingScreen />;
    case 'ended':
      return <YoloEndedScreen />;
    case 'joined':
    default:
      return <InMeeting />;
  }
}


function Meeting() {
  const { meeting } = useYoloMeeting();

  useEffect(() => {
    if (meeting) {
      Object.assign(window, {
        meeting,
      });
    }
  }, [meeting]);

  return <CustomDyteMeeting />;
}

function App() {
  const [meeting, initMeeting] = useYoloClient();
  const setStates = useStatesStore((s) => s.setStates);

  useEffect(() => {
    async function initalizeMeeting() {
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken');

      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }

      initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
      });
    }

    if (!meeting) {
      initalizeMeeting();
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <YoloProvider value={meeting}>
      <YoloUiProvider
        meeting={meeting}
        onDyteStatesUpdate={(e) => {
          setStates(e.detail);
        }}
        showSetupScreen
        style={{ height: '100%', width: '100%', display: 'block' }}
      >
        <Meeting />
        <YoloDialogManager />
      </YoloUiProvider>
    </YoloProvider>
  );
}

export default App;
