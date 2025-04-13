import { Box, Button, Group, Paper, Stack, Text, Modal, TextInput } from '@mantine/core';
import { IconUser, IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { Character } from '../../types/character';

interface CharacterSlotProps {
    character: Character | null;
    onPlay?: (character: Character) => void;
    onDelete?: (character: Character) => void;
    onCreate?: () => void;
    isSelected?: boolean;
    canDelete?: boolean;
}

export function CharacterSlot({ character, onPlay, onDelete, onCreate, isSelected, canDelete }: CharacterSlotProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');

    const SLOT_WIDTH = 380;

    const buttonStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            transform: 'translateY(0)'
        }
    };

    const actionButtonStyle = {
        ...buttonStyle,
        height: '42px',
        fontSize: '14px',
        fontWeight: 500
    };

    const boxStyle = {
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: '#1f1f1f',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)'
        }
    };

    const textStyle = {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
        letterSpacing: '0.3px',
        fontSize: '16px'
    };

    const iconBoxStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        }
    };

    const blueButtonStyle = {
        backgroundColor: 'rgba(30, 58, 138, 0.7)',
        border: '1px solid rgba(37, 99, 235, 0.7)',
        '&:hover': {
            backgroundColor: 'rgba(29, 78, 216, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.6)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            transform: 'translateY(0)'
        }
    };

    const deleteButtonStyle = {
        backgroundColor: 'rgba(127, 29, 29, 0.7)',
        border: '1px solid rgba(220, 38, 38, 0.7)',
        '&:hover': {
            backgroundColor: 'rgba(153, 27, 27, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            transform: 'translateY(-2px)'
        },
        '&:active': {
            transform: 'translateY(0)'
        }
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (character && deleteConfirmName === character.name) {
            onDelete?.(character);
            setDeleteModalOpen(false);
            setDeleteConfirmName('');
        }
    };

    if (!character) {
        return (
            <Stack align="center" gap="sm">
                <Paper
                    p="md"
                    w={SLOT_WIDTH}
                    style={boxStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Group justify="flex-start" align="center" wrap="nowrap" gap="lg">
                        <Box
                            w={50}
                            h={50}
                            style={iconBoxStyle}
                        >
                            <IconPlus 
                                size={24} 
                                color="white" 
                                style={{ 
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isHovered ? 'scale(1.1) rotate(180deg)' : 'scale(1) rotate(0deg)',
                                    opacity: isHovered ? 0.9 : 0.7
                                }} 
                            />
                        </Box>
                        <Text 
                            c="white" 
                            size="lg" 
                            style={{
                                ...textStyle,
                                opacity: isHovered ? 1 : 0.9,
                                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Create Character
                        </Text>
                    </Group>
                </Paper>
                <Button
                    variant="filled"
                    onClick={onCreate}
                    w={SLOT_WIDTH}
                    styles={{
                        root: {
                            ...actionButtonStyle,
                            ...blueButtonStyle
                        },
                        label: textStyle
                    }}
                >
                    Create
                </Button>
            </Stack>
        );
    }

    return (
        <Stack align="center" gap="sm">
            <Paper
                p="md"
                w={SLOT_WIDTH}
                style={{
                    ...boxStyle,
                    border: isSelected ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
                    transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Group justify="flex-start" align="center" wrap="nowrap" gap="lg">
                    <Box
                        w={50}
                        h={50}
                        style={{
                            ...iconBoxStyle,
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : iconBoxStyle.backgroundColor
                        }}
                    >
                        {character.disabled ? (
                            <IconX 
                                size={24} 
                                color="rgba(239, 68, 68, 0.9)" 
                                style={{ 
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    opacity: isHovered ? 1 : 0.9
                                }} 
                            />
                        ) : (
                            <IconUser 
                                size={24} 
                                color="white" 
                                style={{ 
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    opacity: isHovered ? 0.9 : 0.7
                                }} 
                            />
                        )}
                    </Box>
                    <Text 
                        c="white"
                        size="lg" 
                        style={{
                            ...textStyle,
                            opacity: isHovered ? 1 : 0.9,
                            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {character.name}
                    </Text>
                </Group>
            </Paper>
            {!isSelected ? (
                <Button
                    variant="filled"
                    w={SLOT_WIDTH}
                    onClick={() => onPlay?.(character)}
                    styles={{
                        root: {
                            ...actionButtonStyle,
                            ...boxStyle,
                            '&:hover': {
                                ...boxStyle['&:hover'],
                                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                            }
                        },
                        label: textStyle
                    }}
                >
                    Select
                </Button>
            ) : (
                <Group w={SLOT_WIDTH} grow>
                    <Button
                        variant="filled"
                        onClick={() => onPlay?.(character)}
                        disabled={character.disabled}
                        styles={{
                            root: {
                                ...actionButtonStyle,
                                ...blueButtonStyle,
                                '&:disabled': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.4)'
                                }
                            },
                            label: textStyle
                        }}
                    >
                        Play
                    </Button>
                    <Button
                        variant="filled"
                        onClick={handleDeleteClick}
                        disabled={!canDelete}
                        styles={{
                            root: {
                                ...actionButtonStyle,
                                ...deleteButtonStyle,
                                '&:disabled': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                    border: '1px solid rgba(239, 68, 68, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.4)'
                                }
                            },
                            label: textStyle
                        }}
                    >
                        Delete
                    </Button>
                </Group>
            )}

            <Modal
                opened={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteConfirmName('');
                }}
                title="Confirm Character Deletion"
                centered
                styles={{
                    title: {
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        color: 'white'
                    },
                    body: {
                        padding: '20px'
                    },
                    header: {
                        padding: '20px',
                        marginBottom: 0,
                        backgroundColor: '#1a1a1a',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    },
                    content: {
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    },
                    close: {
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }}
            >
                <Stack gap="md">
                    <Text size="sm" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(255, 255, 255, 0.7)' }}>
                        To delete this character, please type their name below:
                    </Text>
                    <TextInput
                        placeholder={character?.name}
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                        styles={{
                            input: {
                                fontFamily: 'Poppins, sans-serif',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                '&:focus': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)'
                                }
                            },
                            wrapper: {
                                '&:has(input:focus)': {
                                    borderColor: 'rgba(255, 255, 255, 0.2)'
                                }
                            }
                        }}
                    />
                    <Button
                        color="red"
                        onClick={handleConfirmDelete}
                        disabled={deleteConfirmName !== character?.name}
                        fullWidth
                        styles={{
                            root: {
                                ...actionButtonStyle,
                                backgroundColor: deleteConfirmName === character?.name ? 'rgba(239, 68, 68, 0.51)' : 'rgba(239, 68, 68, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.72)',
                                '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.64)',
                                    border: '1px solid rgba(239, 68, 68, 0.62)',
                                    transform: deleteConfirmName === character?.name ? 'translateY(-2px)' : 'none'
                                },
                                '&:disabled': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                    border: '1px solid rgba(239, 68, 68, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.4)'
                                }
                            },
                            label: textStyle
                        }}
                    >
                        Delete Character
                    </Button>
                </Stack>
            </Modal>
        </Stack>
    );
} 
