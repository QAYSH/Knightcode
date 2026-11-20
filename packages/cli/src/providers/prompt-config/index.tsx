import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { DEFAULT_CHAT_MODEL_ID } from "../../../../shared/src/models";
import { type SupportedChatModelId } from "../../../../shared/src/models";
import { Mode, type ModeType } from "../../../../shared/src/schemas";
import { getDefaultModel } from "../../lib/config";


type PromptConfigContextValue = {
    mode: ModeType;
    toggleMode: () => void;
    setMode: (mode: ModeType) => void;
    model: SupportedChatModelId | string;
    setModel: (model: SupportedChatModelId | string) => void;
};


const PromptConfigContext = createContext<PromptConfigContextValue | null>(null);

export function usePromptConfig() : PromptConfigContextValue {
    const value = useContext(PromptConfigContext);
    if (!value) {
        throw new Error("usePromptingConfig must be Used within a PromptConfigProvider");
    }
    return value;
};

type PromptConfigProviderProps = {
    children: ReactNode;
};

export function PromptConfigProvider({ children}: PromptConfigProviderProps) {
    const [mode, setMode] = useState<ModeType>(Mode.BUILD);
    const [model, setModel] = useState<SupportedChatModelId | string>(
        () => getDefaultModel() || DEFAULT_CHAT_MODEL_ID
    );

    const toggleMode = useCallback(() => {
        setMode((m) => (m === Mode.BUILD ? Mode.PLAN : Mode.BUILD));
    }, []);

    return (
        <PromptConfigContext.Provider value={{
            mode, 
            toggleMode, 
            setMode, 
            model, 
            setModel
            }}>
            {children}
        </PromptConfigContext.Provider>
    )
}
