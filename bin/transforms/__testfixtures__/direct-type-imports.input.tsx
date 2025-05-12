// @ts-nocheck
import { DyteSidebarView } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar-ui/dyte-sidebar-ui";
import { DyteSidebarSection } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar/dyte-sidebar";
import { useState } from 'react';
import type { DyteParticipant, DytePlugin, DyteSelf } from '@dytesdk/web-core';

function SidebarWithCustomUI() {
    const [tabs, setTabs] = useState([
        { id: 'chat', name: 'chat' },
        { id: 'polls', name: 'polls' },
        { id: 'participants', name: 'participants' },
        { id: 'plugins', name: 'plugins' },
        { id: 'warnings', name: 'warnings' }
    ]);
    const [view, setView] = useState<DyteSidebarView>('sidebar');
    const [section, setSection] = useState<DyteSidebarSection>();
    const pluginsRef = useRef<DytePlugin[]>([]);
    const screensharesRef = useRef<(DyteParticipant | DyteSelf)[]>([]);
}
