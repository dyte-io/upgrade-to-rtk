import RealtimeKitClient from '@cloudflare/realtimekit';
import { RTKParticipant, RTKParticipants, RTKPlugin, RTKPermissionsPreset } from '@cloudflare/realtimekit';
import * as RTK from '@cloudflare/realtimekit';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

// Different import and usage patterns
export default function App() {
  // Using hook
  const { meeting } = useRealtimeKitMeeting();
  
  // Direct import and instantiation
  const client = {} as RealtimeKitClient;
  
  // Namespace import usage
  const namespaceClient = {} as RTK.default;
  
  // Using the clients with different property access patterns
  meeting.join();
  client.join();
  namespaceClient.join();
  
  meeting.leave();
  client.leave();
  namespaceClient.leave();
  
  // Accessing through variables
  const joinRoomFn = meeting.join;
  const leaveRoomFn = meeting.leave;
  
  joinRoomFn();
  leaveRoomFn();
  
  // Using optional chaining
  meeting?.join();
  meeting?.leave();
  
  // Using within function parameters
  callFunction(meeting.join, meeting.leave);
  
  // With participant objects
  const participant: RTKParticipant = {} as any;
  console.log(participant.customParticipantId);
  
  // Using with generics
  const typedParticipant = getParticipant<RTKParticipant>();
  console.log(typedParticipant.customParticipantId);
  
  // Participants map
  meeting.participants.videoSubscribed;
  
  // Plugin usage
  const plugin: RTKPlugin = {} as RTKPlugin;
  plugin.activateForSelf();
  plugin.deactivateForSelf();
  
  // Using with permissions
  const permissions: RTKPermissionsPreset = {} as RTKPermissionsPreset;
  console.log(permissions.acceptStageRequests);
  console.log(permissions.canChangeParticipantPermissions);
  console.log(permissions.canProduceScreenshare);
  console.log(permissions.canProduceAudio);
  console.log(permissions.canProduceVideo);
  
  // With namespace import
  const rtcParticipant: RTK.RTKParticipant = {} as any;
  console.log(rtcParticipant.customParticipantId);
  
  const rtcPermissions: RTK.RTKPermissionsPreset = {} as any;
  console.log(rtcPermissions.canProduceVideo);
}

// Helper functions for type checking
function callFunction(join: Function, leave: Function) {
  join();
  leave();
}

function getParticipant<T>(): T {
  return {} as T;
}
