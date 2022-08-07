import { useMemo } from "react";
import { Button as ThemeButton, ButtonProps } from "theme-ui";

export default function Button({sx, ...rest}: ButtonProps) {
    const rotation = useMemo(() => Math.random() * 3, []);

    return <ThemeButton {...rest} sx={{
        transform: `rotate(${rotation}deg)`,
        ...sx
    }} />;
}