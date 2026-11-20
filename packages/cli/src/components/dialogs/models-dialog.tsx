import { useCallback } from 'react';
import { useDialog } from '../../providers/dialog';
import { DialogSearchList } from '../dialog-search-list';
import type { SupportedChatModelId } from '../../../../shared/src/models';

type ModelsDialogueContentProps = {
    models: (SupportedChatModelId | string)[];
    onSelectModel: (modelId: SupportedChatModelId | string) => void;
};

export const ModelsDialogContent = ({
    models, 
    onSelectModel
}: ModelsDialogueContentProps) => {
    const dialog = useDialog();

  const handleSelect = useCallback((modelId: SupportedChatModelId | string) => {
    onSelectModel(modelId);
    dialog.close();
}, [onSelectModel, dialog]);

return (
    <DialogSearchList 
    items={models}
    onSelect={handleSelect}
    filterFn={(modelId, query) => modelId.toLowerCase().includes(query.toLowerCase())}
    renderItem={(modelId, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
           {modelId}
        </text>
    )}
    getKey={(modelId) => modelId}
    placeholder='Search models'
    emptyText='No matching models'
    />
);
};