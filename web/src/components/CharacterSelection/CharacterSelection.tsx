import { Group, Stack, Box } from '@mantine/core';
import { CharacterSlot } from '../CharacterSlot/CharacterSlot';
import { Character } from '../../types/character';
import { useState, useRef, useEffect } from 'react';

export function CharacterSelection() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
    const [canDelete, setCanDelete] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef<number>(0);
    const scrollStartLeft = useRef<number>(0);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;

            if (data.type === 'showUI' && data.characters) {
                const newCharacters = data.characters.map((char: any) => {
                    if (char.new) return null;
                    return {
                        id: char.value,
                        name: char.title,
                        disabled: char.disabled
                    };
                });
                setCharacters(newCharacters);
                setSelectedCharacter(data.selectedCharacter || null);
                setCanDelete(data.canDelete || false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
        scrollStartLeft.current = scrollContainerRef.current?.scrollLeft || 0;
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();

        const deltaX = e.clientX - dragStartX.current;
        const trackWidth = scrollContainerRef.current.clientWidth - 40;
        const scrollableWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
        
        const moveRatio = (deltaX / trackWidth) * 2;
        const newScrollLeft = scrollStartLeft.current + (scrollableWidth * moveRatio);
        
        scrollContainerRef.current.scrollLeft = Math.max(0, Math.min(scrollableWidth, newScrollLeft));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    const handlePlay = (character: Character) => {
        if (selectedCharacter === null) {
            setSelectedCharacter(characters.findIndex(c => c?.id === character.id));
            fetch(`https://${GetParentResourceName()}/previewCharacter`, {
                method: 'POST',
                body: JSON.stringify({
                    characterId: character.id
                })
            });
        } else if (selectedCharacter === characters.findIndex(c => c?.id === character.id)) {
            fetch(`https://${GetParentResourceName()}/selectCharacter`, {
                method: 'POST',
                body: JSON.stringify({
                    characterId: character.id
                })
            });
        } else {
            setSelectedCharacter(characters.findIndex(c => c?.id === character.id));
            fetch(`https://${GetParentResourceName()}/previewCharacter`, {
                method: 'POST',
                body: JSON.stringify({
                    characterId: character.id
                })
            });
        }
    };

    const handleDelete = (character: Character) => {
        fetch(`https://${GetParentResourceName()}/deleteCharacter`, {
            method: 'POST',
            body: JSON.stringify({
                characterId: character.id
            })
        }).then(() => {
            setSelectedCharacter(null);
            fetch(`https://${GetParentResourceName()}/getCharacters`, {
                method: 'POST'
            });
        });
    };

    const handleCreate = () => {
        fetch(`https://${GetParentResourceName()}/createCharacter`, {
            method: 'POST'
        });
    };

    return (
        <Stack
            justify="flex-end"
            h="100vh"
            p="xl"
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'relative', width: '1200px', margin: '0 auto' }}>
                <Box
                    ref={scrollContainerRef}
                    style={{
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        paddingBottom: '15px',
                        marginBottom: '5px',
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        '&::-webkit-scrollbar-track': {
                            display: 'none'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            display: 'none'
                        }
                    }}
                >
                    <Group 
                        wrap="nowrap"
                        gap="lg"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '0 20px',
                            minWidth: 'min-content'
                        }}
                    >
                        {characters.map((character, index) => (
                            <CharacterSlot
                                key={index}
                                character={character}
                                onPlay={handlePlay}
                                onDelete={handleDelete}
                                onCreate={handleCreate}
                                isSelected={selectedCharacter === index}
                                canDelete={canDelete}
                            />
                        ))}
                    </Group>
                </Box>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '20px',
                        right: '20px',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                    onMouseDown={(e) => {
                        if (scrollContainerRef.current) {
                            const trackRect = e.currentTarget.getBoundingClientRect();
                            const clickPositionRatio = (e.clientX - trackRect.left) / trackRect.width;
                            const scrollableWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
                            scrollContainerRef.current.scrollLeft = scrollableWidth * clickPositionRatio;
                        }
                    }}
                >
                    <div
                        onMouseDown={handleMouseDown}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: '33.33%',
                            background: '#1a1a1a',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                            transform: `translateX(${scrollProgress * ((100 - 33.33) / 100)}%)`,
                            transition: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            cursor: 'grab'
                        }}
                    />
                </div>
            </div>
        </Stack>
    );
} 