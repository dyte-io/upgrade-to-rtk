import RealtimeKitClient from '@cloudflare/realtimekit';
import { RTKParticipant, RTKPlugin, RTKPermissionsPreset } from '@cloudflare/realtimekit';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import React, { useEffect, useState } from 'react';

export default function DestructuringPatterns() {
  const { meeting } = useRealtimeKitMeeting();
  
  // Destructuring methods and properties
  const { join, leave } = meeting;
  
  // Destructuring with renaming
  const { join: joinFn, leave: leaveFn } = meeting;
  
  // With participant object
  const participant = {} as RTKParticipant;
  const { customParticipantId } = participant;
  
  // Plugin destructuring
  const plugin = {} as RTKPlugin;
  const { activateForSelf, deactivateForSelf } = plugin;
  
  // Permissions destructuring
  const permissions = {} as RTKPermissionsPreset;
  const { 
    acceptStageRequests,
    canChangeParticipantPermissions,
    canProduceScreenshare,
    canProduceAudio,
    canProduceVideo
  } = permissions;
  
  // Using destructured properties
  useEffect(() => {
    join();
    leave();
    
    joinFn();
    leaveFn();
    
    console.log(customParticipantId);
    
    activateForSelf();
    deactivateForSelf();
    
    console.log(acceptStageRequests);
    console.log(canChangeParticipantPermissions);
    console.log(canProduceScreenshare);
    console.log(canProduceAudio);
    console.log(canProduceVideo);
  }, []);
  
  // Using in functional component props
  return (
    <div>
      <ChildComponent 
        joinRoom={join}
        leaveRoom={leave}
        clientId={customParticipantId}
        enablePlugin={activateForSelf}
        disablePlugin={deactivateForSelf}
        canProduce={{
          audio: canProduceAudio,
          video: canProduceVideo,
          screen: canProduceScreenshare
        }}
        acceptPresentRequests={acceptStageRequests}
        canChangeRole={canChangeParticipantPermissions}
      />
    </div>
  );
}

// Helper component to show props usage
const ChildComponent = (props) => <div>{JSON.stringify(props)}</div>;
