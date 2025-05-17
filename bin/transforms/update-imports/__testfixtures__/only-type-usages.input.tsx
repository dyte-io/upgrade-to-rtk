// @ts-nocheck
import type DyteClient from '@dytesdk/web-core';
import { CustomStates, SetStates } from '../types';
import './custom-dyte-grid.css';
import { useState } from 'react';
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core';

function CustomDyteGridScreenshareFocused({
    meeting,
    states,
    setStates,
}: { meeting: DyteClient, states: CustomStates, setStates: SetStates}) {
    
    const [size] = useState({ height: '120px', width: '120px' });

    const [selectedSharedScreenParticipant, setSelectedSharedScreenParticipant] = useState<DyteSelf | DyteParticipant | null>(null);

    const [selectedParticipant, setSelectedParticipant] = useState<DyteSelf | DyteParticipant | null>(meeting.self);
};