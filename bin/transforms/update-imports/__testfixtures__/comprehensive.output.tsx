// @ts-nocheck
import * as Dyte from '@cloudflare/realtimekit-react-ui';
import { RtkButton, RtkSpinner } from '@cloudflare/realtimekit-react-ui';
import { RealtimeKitMeeting, RealtimeKitParticipant } from '@cloudflare/realtimekit-react';
import type { RTKParticipantMap, RTKPlugin } from '@cloudflare/realtimekit';
import { RtkUIKit } from '@cloudflare/realtimekit-ui';
import type { HTMLRtkControlBarButton } from '@cloudflare/realtimekit-ui/dist/types/components';

// Test namespace imports usage
const MyComponent = () => {
  const button = <Dyte.RtkButton>Click me</Dyte.RtkButton>;
  return button;
};

// Test named imports usage
const AnotherComponent = () => {
  return (
    <div>
      <RtkButton size="sm" variant="primary" />
      <RtkSpinner />
    </div>
  );
};

// Test type annotations and generics
type MyComponentProps = {
  meeting: RealtimeKitMeeting;
  participant: RealtimeKitParticipant;
  plugins: RTKPlugin[];
  participantMap: RTKParticipantMap;
  controlButton?: HTMLRtkControlBarButton;
};

// Test React hooks with type parameters
const UseMeetingComponent: React.FC<{ meeting: RealtimeKitMeeting }> = ({ meeting }) => {
  const [participant, setParticipant] = useState<RealtimeKitParticipant | null>(null);
  const [plugins] = useState<RTKPlugin[]>([]);

  // Test event handlers with Dyte prefix
  const onDyteStateUpdate = () => {
    console.log('State updated');
  };

  // Test utility types
  type ButtonProps = Omit<HTMLRtkControlBarButton, 'size'>;

  return (
    <RtkUIKit
      meeting={meeting}
      onRtkUpdate={onDyteStateUpdate}
      config={{
        participant: participant,
        plugins: plugins,
      }}
    />
  );
};

// Test class component with Dyte types
class MeetingRoom extends React.Component<MyComponentProps> {
  private meeting: RealtimeKitMeeting;

  constructor(props: MyComponentProps) {
    super(props);
    this.meeting = props.meeting;
  }

  render() {
    const { participant, plugins, participantMap } = this.props;

    return (
      <div>
        <h1>Meeting Room</h1>
        <RtkButton onClick={() => this.meeting.joinRoom()}>Join Room</RtkButton>
        <RtkButton onClick={() => this.meeting.leaveRoom()}>Leave Room</RtkButton>
      </div>
    );
  }
}

export default MeetingRoom;
