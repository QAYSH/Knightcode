import { useRef, useState, useMemo, type RefObject  } from "react";
import { ScrollBoxRenderable } from "@opentui/core";
import { getFilteredCommands } from "./filter-commands";
import { useKeyboard } from "@opentui/react";
import type { Command } from "./types";
import { useKeyboardLayer } from "../../providers/keyboard-layer";

type UseCommandMenuReturn = {
    showCommandMenu: boolean;
    commandQuery: string;
    selectedIndex: number;
    scrollRef: RefObject<ScrollBoxRenderable | null>;
    handleContentChange: (text: string) => void;
    resolveCommand: (index: number ) => Command | undefined;
    setSelectedIndex: (Index: number)=> void;
};


export function useCommandMenu(): UseCommandMenuReturn{
    const [textValue, setTextValue] = useState("");
    const [selectedIndex, setSelectedIndex ] = useState(0);
    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const scrollRef = useRef<ScrollBoxRenderable>(null);
    const {push, pop, isTopLayer, setResponder} = useKeyboardLayer();

    const commandQuery = showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";
    const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

    const close = () => {
        setShowCommandMenu(false);
        pop("command");
    };

    const handleContentChange = (text: string) => {
        setTextValue(text);
        setSelectedIndex(0);

        const scrollbox = scrollRef.current;
        if (scrollbox) {
            scrollbox.scrollTo(0);
        }
        const prefix = text.startsWith("/") ? text.slice(1) : null;
        if (prefix !== null && !prefix.includes(" ")) {
            setShowCommandMenu(true);
            push("command", () => {
               close();
                return true;
            });
        } else {
            close()
        }
    };

    const resolveCommand = (index: number): Command | undefined => {
        const command = filteredCommands[index];
        if (command) {
            close();
        }
        return command;
    };

    useKeyboard((key) => {
        if (!showCommandMenu || !isTopLayer("command")) return;

        if (key.name === "escape"){
            key.preventDefault();
            close();
        } else if (key.name === "up") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                const newIndex = Math.max(0, i - 1);
                const scrollbox = scrollRef.current;
                if (scrollbox && newIndex < scrollbox.scrollTop) {
                    scrollbox.scrollTo(newIndex);
                }
                return newIndex;
            });
        } else if (key.name === "down") {
            key.preventDefault();
            setSelectedIndex((i: number) => {
                if (filteredCommands.length === 0) {return 0;};

                const newIndex = Math.min(filteredCommands.length - 1, i + 1);
                const scrollbox = scrollRef.current;
                if (scrollbox) {
                    const viewportHeight = scrollbox.viewport.height;
                    const visibleEnd = scrollbox.scrollTop  + viewportHeight -1;
                    if ( newIndex > visibleEnd ){
                        scrollbox.scrollTo(newIndex - viewportHeight + 1);
                    }
                }
                return newIndex;
            });
        };
    });

    return { 
        showCommandMenu,
        commandQuery,
        selectedIndex,
        scrollRef,
        handleContentChange,
        resolveCommand,
        setSelectedIndex,

    };
}