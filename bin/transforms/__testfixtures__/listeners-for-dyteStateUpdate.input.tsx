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
    document.body.addEventListener('dyteStateUpdate', handleDyteStateUpdate);
    document.body.on('dyteStateUpdate', handleDyteStateUpdate);

    return () => {
        document.body.removeEventListener('dyteStateUpdate', handleDyteStateUpdate);
        document.body.off('dyteStateUpdate', handleDyteStateUpdate);
    };
}