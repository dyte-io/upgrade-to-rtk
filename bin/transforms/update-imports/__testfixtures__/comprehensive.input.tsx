// @ts-nocheck
import * as Dyte from '@dytesdk/react-ui-kit';
import { DyteButton, DyteSpinner } from '@dytesdk/react-ui-kit';
import { DyteMeeting, DyteParticipant } from '@dytesdk/react-web-core';
import type { DyteParticipantMap, DytePlugin } from '@dytesdk/web-core';
import { DyteUIKit } from '@dytesdk/ui-kit';
import type { HTMLDyteControlBarButton } from '@dytesdk/ui-kit/dist/types/components';

// Test namespace imports usage
const MyComponent = () => {
  const button = <Dyte.DyteButton>Click me</Dyte.DyteButton>;
  return button;
};

// Test named imports usage
const AnotherComponent = () => {
  return (
    <div>
      <DyteButton size="sm" variant="primary" />
      <DyteSpinner />
    </div>
  );
};

// Test type annotations and generics
type MyComponentProps = {
  meeting: DyteMeeting;
  participant: DyteParticipant;
  plugins: DytePlugin[];
  participantMap: DyteParticipantMap;
  controlButton?: HTMLDyteControlBarButton;
};

// Test React hooks with type parameters
const UseMeetingComponent: React.FC<{ meeting: DyteMeeting }> = ({ meeting }) => {
  const [participant, setParticipant] = useState<DyteParticipant | null>(null);
  const [plugins] = useState<DytePlugin[]>([]);

  // Test event handlers with Dyte prefix
  const onDyteStateUpdate = () => {
    console.log('State updated');
  };

  // Test utility types
  type ButtonProps = Omit<HTMLDyteControlBarButton, 'size'>;

  return (
    <DyteUIKit
      meeting={meeting}
      onDyteUpdate={onDyteStateUpdate}
      config={{
        participant: participant,
        plugins: plugins,
      }}
    />
  );
};

// Test class component with Dyte types
class MeetingRoom extends React.Component<MyComponentProps> {
  private meeting: DyteMeeting;

  constructor(props: MyComponentProps) {
    super(props);
    this.meeting = props.meeting;
  }

  render() {
    const { participant, plugins, participantMap } = this.props;

    return (
      <div>
        <h1>Meeting Room</h1>
        <DyteButton onClick={() => this.meeting.joinRoom()}>Join Room</DyteButton>
        <DyteButton onClick={() => this.meeting.leaveRoom()}>Leave Room</DyteButton>
      </div>
    );
  }
}

export default MeetingRoom;
