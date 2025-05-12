// @ts-nocheck
import type DyteClient from '@cloudflare/realtimekit';
import { CustomStates, SetStates } from '../types';
import './custom-dyte-grid.css';
import { useState } from 'react';
import { RealtimeKitParticipant, RealtimeKitSelf } from '@cloudflare/realtimekit';

function CustomDyteGridScreenshareFocused({
    meeting,
    states,
    setStates,
}: { meeting: DyteClient, states: CustomStates, setStates: SetStates}) {
    
    const [size] = useState({ height: '120px', width: '120px' });

    const [selectedSharedScreenParticipant, setSelectedSharedScreenParticipant] = useState<RealtimeKitSelf | RealtimeKitParticipant | null>(null);

    const [selectedParticipant, setSelectedParticipant] = useState<RealtimeKitSelf | RealtimeKitParticipant | null>(meeting.self);
};