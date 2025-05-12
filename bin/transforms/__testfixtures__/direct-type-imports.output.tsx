// @ts-nocheck
import { RtkSidebarView } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar-ui/rtk-sidebar-ui';
import { RtkSidebarSection } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar';
import { useState } from 'react';
import type { RTKParticipant, RTKPlugin, RTKSelf } from '@cloudflare/realtimekit';

function SidebarWithCustomUI() {
    const [tabs, setTabs] = useState([
        { id: 'chat', name: 'chat' },
        { id: 'polls', name: 'polls' },
        { id: 'participants', name: 'participants' },
        { id: 'plugins', name: 'plugins' },
        { id: 'warnings', name: 'warnings' }
    ]);
    const [view, setView] = useState<RtkSidebarView>('sidebar');
    const [section, setSection] = useState<RtkSidebarSection>();
    const pluginsRef = useRef<RTKPlugin[]>([]);
    const screensharesRef = useRef<(RTKParticipant | RTKSelf)[]>([]);
}
