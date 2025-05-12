// @ts-nocheck
import { useEffect } from 'react';
import {
  RealtimeKitProvider as YoloProvider,
  useRealtimeKitClient as useYoloClient,
  useRealtimeKitMeeting as useYoloMeeting,
} from '@cloudflare/realtimekit-react';
import { RtkDialogManager as YoloDialogManager, RtkUiProvider as YoloUiProvider } from '@cloudflare/realtimekit-react-ui';
import InMeeting from './in-meeting';
import {
  RtkEndedScreen as YoloEndedScreen,
  RtkIdleScreen as YoloIdleScreen,
  RtkSetupScreen as YoloSetupScreen,
  RtkWaitingScreen as YoloWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
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
        onRtkStatesUpdate={(e) => {
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
