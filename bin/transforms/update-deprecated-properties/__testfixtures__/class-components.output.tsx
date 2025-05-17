// @ts-nocheck
import RealtimeKitClient from '@cloudflare/realtimekit';
import { RTKParticipant, RTKPlugin, RTKPermissionsPreset } from '@cloudflare/realtimekit';
import React, { Component } from 'react';

interface Props {
  meeting?: RealtimeKitClient;
  participant: RTKParticipant;
  plugin?: RTKPlugin;
  permissions?: RTKPermissionsPreset;
}

interface State {
  isJoined: boolean;
  hasPermission: boolean;
  participantId: string;
}

// Using deprecated properties in class components
class RTKClassComponent extends Component<Props, State> {
  private meeting?: RealtimeKitClient;
  private participant: RTKParticipant;
  private plugin: RTKPlugin;
  private permissions: RTKPermissionsPreset;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      isJoined: false,
      hasPermission: false,
      participantId: '',
    };
    
    // Initialize with props or create new instances
    this.meeting = props.meeting;
    this.participant = props.participant;
    this.plugin = props.plugin || ({} as RTKPlugin);
    this.permissions = props.permissions || ({} as RTKPermissionsPreset);
    
    // Bind methods
    this.handleJoin = this.handleJoin.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.togglePlugin = this.togglePlugin.bind(this);
  }
  
  componentDidMount() {
    // Access properties via class instance
    this.meeting?.join();
    console.log(this.participant.customParticipantId);
    console.log(this.meeting?.participants.videoSubscribed);
  }
  
  componentWillUnmount() {
    this.meeting?.leave();
  }
  
  handleJoin() {
    // Using as method
    this.meeting?.join();
    this.setState({ isJoined: true });
  }
  
  handleLeave() {
    this.meeting?.leave();
    this.setState({ isJoined: false });
  }
  
  togglePlugin(enabled: boolean) {
    if (enabled) {
      this.plugin.activateForSelf();
    } else {
      this.plugin.deactivateForSelf();
    }
  }
  
  checkPermissions() {
    const canProduce = 
      this.permissions.canProduceAudio && 
      this.permissions.canProduceVideo && 
      this.permissions.canProduceScreenshare;
    
    const canModerate = 
      this.permissions.acceptStageRequests && 
      this.permissions.canChangeParticipantPermissions;
    
    return { canProduce, canModerate };
  }
  
  // Using in render method
  render() {
    const { isJoined } = this.state;
    const { canProduce, canModerate } = this.checkPermissions();
    {this.participant.customParticipantId}
    return (
      <div className="rtk-class-component">
        <h1>RTK Class Component</h1>
        
        <div>
          <button onClick={this.handleJoin} disabled={isJoined}>
            Join Room
          </button>
          <button onClick={this.handleLeave} disabled={!isJoined}>
            Leave Room
          </button>
        </div>
        
        <div>
          <p>Client ID: {this.participant.customParticipantId}</p>
          <p>Is Active: {String(this.meeting?.participants.videoSubscribed)}</p>
          <p>Can Produce: {String(canProduce)}</p>
          <p>Can Moderate: {String(canModerate)}</p>
        </div>
        
        <div>
          <button onClick={() => this.togglePlugin(true)}>Enable Plugin</button>
          <button onClick={() => this.togglePlugin(false)}>Disable Plugin</button>
        </div>
      </div>
    );
  }
}

export default RTKClassComponent;
