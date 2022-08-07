import type { Theme } from "theme-ui";

const bodyFonts = `'Wack Club Sans', 'Inter', system-ui, sans-serif`;

export const theme: Theme = {
    fonts: {
        body: bodyFonts,
        heading: bodyFonts,
        monospace: "Menlo, monospace"
    },
    fontSizes: [16, 18, 20, 24, 32, 48, 64, 72],
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700
    },
    lineHeights: {
        body: 1.5,
        heading: 1.125
    },
    colors: {
        text: "#101010",
        background: "#F1BF98",
        primary: "#E1F4CB",
        secondary: "#bacba9",
    },
    buttons: {
        primary: {
            color: "text",
            bg: "primary",
            // fontSize: "1.2rem",
            border: "none",
            borderRadius: `${11/16}rem`,
            padding: `0.5rem ${10/16}rem`,
            cursor: "pointer",
            fontFamily: bodyFonts, // for some reason this didn't work before
            transition: "all 0.1s ease-in-out",
            "&:hover": {
                transform: "scale(1.05)"
            },
            "&:focus": {
                bg: "secondary"
            }
        }
    },
    styles: {
        root: {
            fontFamily: "body",
            // lineHeight: "body",
            // fontWeight: "body"
        },
        h1: {
            fontSize: [5, 6, 7]
        }
    },
    sizes: {
        container: "50rem",
        header: "3rem"
    }
}