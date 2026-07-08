export type ThemeColors = {
    primary: string;
    planMode: string;
    selection: string;
    thinking: string;
    success: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    dialogSurface: string;
    thinkingBorder: string;
    dimSeperator: string;

}

export type Theme ={
    name: string;
    colors: ThemeColors;
}
export const THEMES: Theme[] = [
    {
        name: "Knightfox",
        colors: {
            primary: "#00E5FF",      // Cyan neon
            planMode: "#B388FF",     // Deep purple
            selection: "#00E676",    // Bright green
            thinking: "#B388FF",
            success: "#00E676",
            error: "#FF5252",
            info: "#00E5FF",
            background: "#0D0D12",
            surface: "#1A1A24",
            dialogSurface: "#0A0A10",
            thinkingBorder: "#34344A",
            dimSeperator: "#4E4E66"
        },
    },
    {
        name: "Catppuccin Mocha",
        colors: {
            primary: "#F5E0DC",      // Warm rosewater
            planMode: "#CBA6F7",     // Mauve
            selection: "#A6E3A1",    // Green
            thinking: "#CBA6F7",
            success: "#A6E3A1",
            error: "#F38BA8",
            info: "#89DCEB",
            background: "#11111B",
            surface: "#1E1E2E",
            dialogSurface: "#13131D",
            thinkingBorder: "#45475A",
            dimSeperator: "#585B70"
        },
    },
    {
        name: "Dracula",
        colors: {
            primary: "#8BE9FD",      // Bright Cyan
            planMode: "#FF79C6",     // Pink
            selection: "#50FA7B",    // Neon Green
            thinking: "#FF79C6",
            success: "#50FA7B",
            error: "#FF5555",
            info: "#8BE9FD",
            background: "#282A36",
            surface: "#343746",
            dialogSurface: "#F5E9E2", // Yes, Dracula terminal has a light pop-up base! 
            thinkingBorder: "#D9C9B6",
            dimSeperator: "#C5B7A8"
        },  
    },
    {
        name: "Moonlight",
        colors: {
            primary: "#89B4FA",      // Soft Blue
            planMode: "#C099FF",     // Purple
            selection: "#A6E3A1",    // Mint Green
            thinking: "#C099FF",
            success: "#A6E3A1",
            error: "#F38BA8",
            info: "#89B4FA",
            background: "#1E1E2E",
            surface: "#2E2E3E",
            dialogSurface: "#13131D",
            thinkingBorder: "#45475A",
            dimSeperator: "#585B70"
        },
    },
    {
        name: "Nordic Frost",
        colors: {
            primary: "#88C0D0",      // Ice Blue
            planMode: "#B48EAD",     // Lavender
            selection: "#A3BE8C",    // Mint
            thinking: "#B48EAD",
            success: "#A3BE8C",
            error: "#BF616A",
            info: "#88C0D0",
            background: "#2E3440",
            surface: "#3B4252",
            dialogSurface: "#1A1E27",
            thinkingBorder: "#4C566A",
            dimSeperator: "#616E88"
        },
    },
    {
        name: "Solarized Dark",
        colors: {
            primary: "#268BD2",      // Sky Blue
            planMode: "#D33682",     // Magenta
            selection: "#2AA198",    // Cyan
            thinking: "#D33682",
            success: "#859900",
            error: "#DC322F",
            info: "#268BD2",
            background: "#002B36",
            surface: "#073642",
            dialogSurface: "#00161D",
            thinkingBorder: "#586E75",
            dimSeperator: "#657B83"
        },
    },
    {
        name: "Tokyo Night",
        colors: {
            primary: "#7AA2F7",      // Bright Blue
            planMode: "#BB9AF7",     // Violet
            selection: "#9ECE6A",    // Lime Green
            thinking: "#BB9AF7",
            success: "#9ECE6A",
            error: "#F7768E",
            info: "#7DCFFF",
            background: "#1A1B26",
            surface: "#24283B",
            dialogSurface: "#0F0F1A",
            thinkingBorder: "#414868",
            dimSeperator: "#565F89"
        },
    },
    {
        name: "Gruvbox Dark",
        colors: {
            primary: "#83A598",      // Muted Blue
            planMode: "#D3869B",     // Muted Purple
            selection: "#B8BB26",    // Acid Green
            thinking: "#D3869B",
            success: "#B8BB26",
            error: "#FB4934",
            info: "#83A598",
            background: "#282828",
            surface: "#3C3836",
            dialogSurface: "#1D2021",
            thinkingBorder: "#504945",
            dimSeperator: "#665C54"
        },
    },
    {
        name: "Cyberpunk Neon",
        colors: {
            primary: "#00F0FF",      // Electric Cyan
            planMode: "#FF00FF",     // Hot Magenta
            selection: "#39FF14",    // Toxic Green
            thinking: "#FF00FF",
            success: "#39FF14",
            error: "#FF003C",
            info: "#00F0FF",
            background: "#0A0A0F",
            surface: "#141420",
            dialogSurface: "#050508",
            thinkingBorder: "#2A2A40",
            dimSeperator: "#3D3D60"
        },
    },
    {
        name: "Warm Sunset",
        colors: {
            primary: "#FF9F68",      // Salmon
            planMode: "#C77DFF",     // Bright Violet
            selection: "#FF6B6B",    // Coral Red
            thinking: "#C77DFF",
            success: "#51CF66",
            error: "#FF4757",
            info: "#4DABF7",
            background: "#1A0E0E",
            surface: "#2A1818",
            dialogSurface: "#0F0808",
            thinkingBorder: "#3D2828",
            dimSeperator: "#5A3D3D"
        },
    },
    {
        name: "Forest Canopy",
        colors: {
            primary: "#55C595",      // Neo-Mint
            planMode: "#A78BFA",     // Purple
            selection: "#34D399",    // Emerald
            thinking: "#A78BFA",
            success: "#4ADE80",
            error: "#F87171",
            info: "#60A5FA",
            background: "#0A120E",
            surface: "#141C16",
            dialogSurface: "#060A08",
            thinkingBorder: "#2A3A2E",
            dimSeperator: "#3D523E"
        },
    },
    {
        name: "Midnight Galaxy",
        colors: {
            primary: "#7C6BFC",      // Indigo
            planMode: "#A78BFA",     // Purple
            selection: "#34D399",    // Emerald Green
            thinking: "#A78BFA",
            success: "#34D399",
            error: "#F43F5E",
            info: "#38BDF8",
            background: "#05050A",
            surface: "#0F0F1A",
            dialogSurface: "#030308",
            thinkingBorder: "#252540",
            dimSeperator: "#3A3A5A"
        },
    },
    {
        name: "Retro Beige",
        colors: {
            primary: "#D4A373",      // Leather
            planMode: "#B5838D",     // Muted Rose
            selection: "#2A9D8F",    // Teal pop
            thinking: "#B5838D",
            success: "#4CAF50",
            error: "#E63946",
            info: "#457B9D",
            background: "#F4F1DE",
            surface: "#E0D9C8",
            dialogSurface: "#FFFDF5",
            thinkingBorder: "#D3C9B3",
            dimSeperator: "#B5A990"
        },
    },
    {
        name: "Ocean Deep",
        colors: {
            primary: "#48C9B0",      // Turquoise
            planMode: "#7F8CD4",     // Soft Blue
            selection: "#5DADE2",    // Strong Blue
            thinking: "#7F8CD4",
            success: "#58D68D",
            error: "#E74C5E",
            info: "#5DADE2",
            background: "#0C141F",
            surface: "#18263A",
            dialogSurface: "#060C14",
            thinkingBorder: "#2A3F5A",
            dimSeperator: "#3D5A7A"
        },
    },
    {
        name: "Terminal Green",
        colors: {
            primary: "#33FF33",      // Classic Matrix Green
            planMode: "#FF6B9D",     // Hot Pink
            selection: "#FFD700",    // Gold
            thinking: "#FF6B9D",
            success: "#00FF7F",
            error: "#FF1744",
            info: "#00BFFF",
            background: "#0C0C0C",
            surface: "#1A1A1A",
            dialogSurface: "#050505",
            thinkingBorder: "#2A2A2A",
            dimSeperator: "#3D3D3D"
        },
    },
    {
        name: "Amber Glow",
        colors: {
            primary: "#FFB000",      // Vivid Orange
            planMode: "#FF6B8A",     // Rose
            selection: "#C0FF00",    // Lime
            thinking: "#FF6B8A",
            success: "#C0FF00",
            error: "#FF4500",
            info: "#4FC3F7",
            background: "#1A1008",
            surface: "#2A1A0A",
            dialogSurface: "#0F0804",
            thinkingBorder: "#3D2A14",
            dimSeperator: "#5A3D20"
        },
    },
    {
        name: "Matrix Code",
        colors: {
            primary: "#00FF41",      // Vivid Green
            planMode: "#00BFFF",     // Bright Blue
            selection: "#FFD700",    // Gold hint
            thinking: "#00BFFF",
            success: "#7FFF00",
            error: "#FF0040",
            info: "#00FA9A",
            background: "#001000",
            surface: "#001A00",
            dialogSurface: "#000800",
            thinkingBorder: "#003300",
            dimSeperator: "#004D00"
        },
    },
    {
        name: "Monochrome Pro",
        colors: {
            primary: "#E0E0E0",      // White
            planMode: "#B0B0B0",     // Silver
            selection: "#FFFFFF",    // Pure White
            thinking: "#B0B0B0",
            success: "#A8A8A8",
            error: "#6A6A6A",
            info: "#C0C0C0",
            background: "#0D0D0D",
            surface: "#1A1A1A",
            dialogSurface: "#080808",
            thinkingBorder: "#2D2D2D",
            dimSeperator: "#404040"
        },
    },
    {
        name: "Cobalt Flux",
        colors: {
            primary: "#4DABF7",      // Sky Blue
            planMode: "#DA77F2",     // Pink
            selection: "#69DB7C",    // Neon Green
            thinking: "#DA77F2",
            success: "#69DB7C",
            error: "#FF6B6B",
            info: "#4DABF7",
            background: "#0A0E1A",
            surface: "#141A2A",
            dialogSurface: "#060810",
            thinkingBorder: "#2A3450",
            dimSeperator: "#3D4D70"
        },
    },
    {
        name: "Vintage Paper",
        colors: {
            primary: "#D3A17E",      // Muted Gold
            planMode: "#B8860B",     // Dark Gold
            selection: "#2E8B57",    // Sea Green
            thinking: "#B8860B",
            success: "#2E8B57",
            error: "#8B4513",
            info: "#4A6FA5",
            background: "#FAF0E6",
            surface: "#F5DEB3",
            dialogSurface: "#FFF8F0",
            thinkingBorder: "#E5D0B0",
            dimSeperator: "#C0B090"
        },
    },
    {
        name: "Synthwave 84",
        colors: {
            primary: "#FF6AD5",      // Hot Pink
            planMode: "#00E5FF",     // Cyan
            selection: "#FFB000",    // Amber
            thinking: "#00E5FF",
            success: "#39FF14",
            error: "#FF004D",
            info: "#7B2FBE",
            background: "#0A0015",
            surface: "#15002A",
            dialogSurface: "#05000A",
            thinkingBorder: "#2A0045",
            dimSeperator: "#400066"
        },
    },
];


export const DEFAULT_THEME = THEMES.find((t) => t.name === "Knightfox")! || THEMES[0];