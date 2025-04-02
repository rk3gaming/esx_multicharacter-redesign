export interface Character {
    id: number;
    name: string;
    disabled?: boolean;
}

export interface CharacterSlot {
    character: Character | null;
    index: number;
} 