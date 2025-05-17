// @ts-nocheck
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
  meeting.joinRoom();
  client.joinRoom();
  namespaceClient.joinRoom();
  
  meeting.leaveRoom();
  client.leaveRoom();
  namespaceClient.leaveRoom();
  
  // Accessing through variables
  const joinRoomFn = meeting.joinRoom;
  const leaveRoomFn = meeting.leaveRoom;
  
  joinRoomFn();
  leaveRoomFn();
  
  // Using optional chaining
  meeting?.joinRoom();
  meeting?.leaveRoom();
  
  // Using within function parameters
  callFunction(meeting.joinRoom, meeting.leaveRoom);
  
  // With participant objects
  const participant: RTKParticipant = {} as any;
  console.log(participant.clientSpecificId);
  
  // Using with generics
  const typedParticipant = getParticipant<RTKParticipant>();
  console.log(typedParticipant.clientSpecificId);
  
  // Participants map
  meeting.participants.active;
  
  // Plugin usage
  const plugin: RTKPlugin = {} as RTKPlugin;
  plugin.activateForSelf();
  plugin.deactivateForSelf();
  
  // Using with permissions
  const permissions: RTKPermissionsPreset = {} as RTKPermissionsPreset;
  console.log(permissions.acceptPresentRequests);
  console.log(permissions.canChangeParticipantRole);
  console.log(permissions.produceScreenshare);
  console.log(permissions.produceAudio);
  console.log(permissions.produceVideo);
  
  // With namespace import
  const rtcParticipant: RTK.RTKParticipant = {} as any;
  console.log(rtcParticipant.clientSpecificId);
  
  const rtcPermissions: RTK.RTKPermissionsPreset = {} as any;
  console.log(rtcPermissions.produceVideo);
}

// Helper functions for type checking
function callFunction(join: Function, leave: Function) {
  join();
  leave();
}

function getParticipant<T>(): T {
  return {} as T;
}