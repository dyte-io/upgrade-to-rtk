// @ts-nocheck
function App() {
    const handleDyteStateUpdate = ({detail}: any) => {
        if (detail.activeSidebar) {
            // setActiveSidebar(true);
        } else {
            // setActiveSidebar(false);
        }
    }

    // Don't do this in prod lol
    document.body.addEventListener('rtkStateUpdate', handleDyteStateUpdate);
    document.body.on('rtkStateUpdate', handleDyteStateUpdate);

    return () => {
        document.body.removeEventListener('rtkStateUpdate', handleDyteStateUpdate);
        document.body.off('rtkStateUpdate', handleDyteStateUpdate);
    };
}