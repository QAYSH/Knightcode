import { Outlet } from "react-router";
import { ToastProvider } from '../providers/toast/index';
import { DialogProvider } from '../providers/dialog';
import { KeyboardLayerProvider } from '../providers/keyboard-layer/index';
import { ThemeProvider } from '../providers/theme/index';
import { ThemedRoot } from './themed-root';
import { PromptConfigProvider } from "../providers/prompt-config";


export function RootLayout(){
    return (
        <ThemeProvider>
            <ToastProvider>
                <KeyboardLayerProvider>
                    <DialogProvider>
                        <PromptConfigProvider>
                            <ThemedRoot>
                                <Outlet />
                            </ThemedRoot>
                        </PromptConfigProvider>
                    </DialogProvider>
                </KeyboardLayerProvider>
            </ToastProvider>
        </ThemeProvider>
    )
}