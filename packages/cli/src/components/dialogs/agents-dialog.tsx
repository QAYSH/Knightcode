 import { useCallback } from 'react';
import { useDialog } from '../../providers/dialog';
import { DialogSearchList } from '../dialog-search-list';
import { Mode } from '../../../../shared/src/schemas';
import { type ModeType } from '../../../../shared/src/schemas';


const AVAILABLE_MODES: ModeType[] = [Mode.BUILD, Mode.PLAN];

type AgentDialogueContentProps = {
    currentMode: ModeType;
    onSelectMode: (mode: ModeType) => void;
};

function getModeLabel(mode: ModeType) {
    return mode === Mode.PLAN ? "Plan" : "Build";
}

export const AgentsDialogContent = ({
    currentMode, 
    onSelectMode
}: AgentDialogueContentProps) => {
    const dialog = useDialog();



  const handleSelect = useCallback((nextMode: ModeType) => {
    onSelectMode(nextMode);
    dialog.close();
    
},[onSelectMode, dialog])

return (
    <DialogSearchList 
    items={AVAILABLE_MODES}
    onSelect={handleSelect}
    filterFn={(item, query) => getModeLabel(item).toLowerCase().includes(query.toLowerCase())}
    renderItem={(item, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
            {item === currentMode ? "." : "  "}
            {getModeLabel(item)}
        </text>
    )}
    getKey={(item) => item}
    placeholder='Search modes'
    emptyText='No matching agent'
    />
);
};