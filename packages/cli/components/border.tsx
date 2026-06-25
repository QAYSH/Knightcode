export const EmptyBorder =  {
    topLeft: "",
    topRight: "",
    bottomLeft: "",
    bottomRight: "",
    horizontal: "",
    vertical: "",
    bottomT: "",
    topT: "",
    leftT: "",
    rightT: "",
    cross: "",
}

export const SplitBorder =  {
    border: ["left" as const, "right" as const],
    customBorderChars:{
        ...EmptyBorder,
        vertical: "│",
    },
}