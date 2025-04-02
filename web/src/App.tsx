import { MantineProvider } from '@mantine/core';
import { CharacterSelection } from './components/CharacterSelection/CharacterSelection';
import { useState, useEffect } from 'react';

export function App() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'showUI') {
                setIsVisible(true);
                fetch(`https://${GetParentResourceName()}/setFocus`, {
                    method: 'POST',
                    body: JSON.stringify({
                        focus: true
                    })
                });
            } else if (event.data.type === 'hideUI') {
                setIsVisible(false);
                fetch(`https://${GetParentResourceName()}/setFocus`, {
                    method: 'POST',
                    body: JSON.stringify({
                        focus: false
                    })
                });
            }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

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