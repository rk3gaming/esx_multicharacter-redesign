import { MantineProvider } from '@mantine/core';
import { CharacterSelection } from './components/CharacterSelection/CharacterSelection';
import { useState, useEffect } from 'react';

export function App() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'showUI') {
                setIsVisible(true);
                setFocus(true);
            } else if (event.data.type === 'hideUI') {
                setIsVisible(false);
                setFocus(false);
            }
        };

        const setFocus = (focus: boolean) => {
            fetch(`https://${GetParentResourceName()}/setFocus`, {
                method: 'POST',
                body: JSON.stringify({ focus })
            });
        };

        const handleFocus = () => {
            // Re-apply focus if UI should be visible
            if (isVisible) {
                console.log('[Focus] Window regained focus, restoring NUI focus...');
                setFocus(true);
            }
        };

        window.addEventListener('message', handleMessage);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('message', handleMessage);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isVisible]); // Track changes to isVisible

    return (
        <MantineProvider>
            <div style={{ 
                width: '100vw', 
                height: '100vh',
                background: 'transparent',
                position: 'relative',
                display: isVisible ? 'block' : 'none',
                overflow: 'hidden'
            }}>
                <CharacterSelection />
            </div>
        </MantineProvider>
    );
}
