import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from "react";
import { useAppApi } from "../utils/apiInteractions";
import { Box, Container, Heading, Input, Text, ThemeUICSSObject } from "theme-ui";
import Button from "../ui/Button";

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Word Calculator</title>
                <meta name="description" content="Do maths with words!"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Container as="section" p={4} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}>
                <Heading as="h1">Word Calculator</Heading>
                <Calculator/>
                <Text sx={{
                    mt: "2rem",
                    color: "gray"
                }}>Built by Arcade, Cara, and Benjamin</Text>
            </Container>
        </div>
    );
};


const opButtonSx: ThemeUICSSObject = {
    fontSize: "1.5rem",
    backgroundColor: "grey",
    width: "100%",
    height: "100%"
}

function Calculator() {
    const { loading, error, result, run } = useAppApi();
    const [text, setText] = useState<string | false>("");

    useEffect(() => {
        if(result || error || loading) {
            setText(false);
        }
    }, [result, error, loading]);

    const displayVal = text !== false ? (text as string) : (result ?? error ?? "Loading");
    const opButtonTextBase = text || (result ?? "");

    return (
        <Box sx={{
            px: "1.5rem",
            py: "1.75rem",
            position: "relative",
            backgroundColor: "#a1a1a1",
            border: "2px solid #212121",
            borderRadius: "0.375rem",
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
        }}>
            <Box sx={{
                position: "relative",
                borderRadius: "0.25rem",
                maxWidth: "30rem",
                overflow: "hidden",
                "&::before": {
                    borderRadius: "0.25rem",
                    backgroundImage: "url('/lcd.png')",
                    filter: "blur(1px)",
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }
            }}>
                <Input placeholder={"Enter text"} value={displayVal} onKeyDown={e => {
                    if(loading) return;

                    if((e.key === "=" || e.key === "Enter") && !(error && text === false)) {
                        e.preventDefault();
                        // noinspection JSIgnoredPromiseFromCall
                        run(text || "");
                    } else if(![...ALPHABET, ...([...ALPHABET].map(c => c.toLowerCase())), "+", "-", "Backspace", "Delete", "Shift", "^", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                        e.preventDefault();
                    // handle cases where the manipulation would affect a ^2
                    } /*else if((e.key === "Backspace" || e.key === "Delete") && )*/
                    //
                    // if(error && text === false) {
                    //     setText("");
                    // }
                }} onChange={e => {

                    // todo: handle copypaste + other more advanced text manipulations
                    console.log("change", e.target.value, text);

                    if(loading) return;

                    /*if(e.target.value.includes("=")) {
                        // Run the calculation
                        // noinspection JSIgnoredPromiseFromCall
                        run(e.target.value.slice(0, -1));
                    } else */if(e.target.value.length === 0 || [...ALPHABET, ...([...ALPHABET].map(c => c.toLowerCase())), "+", "-"].includes(e.target.value.slice(-1)) || e.target.value.endsWith("^2")) {
                        setText(e.target.value.toLowerCase());
                    } else if(e.target.value.endsWith("^")) {
                        if(e.target.value.length > (text || "").length) {
                            setText(e.target.value + "2");
                        } else {
                            setText(e.target.value.slice(0, -1));
                        }
                    }
                }} sx={{
                    textAlign: "right",
                    border: 0,
                    filter: "blur(0.5px)",
                    fontFamily: "DSEG14",
                    fontSize: "2rem",
                    height: "2.875rem",
                    px: "0.375rem",
                    color: "#2C292D",
                    "&::placeholder": {
                        color: "#2C292D"
                    }
                }}
                />
            </Box>
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gridTemplateRows: "repeat(7, 1fr)",
                gridGap: "0.5rem"
            }}>
                {ALPHABET.map(letter => (
                    <Button key={letter} onClick={() => !loading && setText(opButtonTextBase + letter)}>{letter}</Button>
                ))}
                <Box sx={{
                    gridArea: "1 / 5 / 3 / 6"
                }}>
                    <Button sx={opButtonSx} onClick={() => !loading && setText(opButtonTextBase + "^2")}>x<sup>2</sup></Button>
                </Box>
                <Box sx={{
                    gridArea: "3 / 5 / 5 / 6"
                }}>
                    <Button sx={opButtonSx} onClick={() => !loading && setText(opButtonTextBase + "-")}>-</Button>
                </Box>
                <Box sx={{
                    gridArea: "5 / 5 / 7 / 6"
                }}>
                    <Button sx={opButtonSx} onClick={() => !loading && setText(opButtonTextBase + "+")}>+</Button>
                </Box>
                <Box sx={{
                    gridArea: "7 / 4 / 8 / 6"
                }}>
                    <Button onClick={() => !loading && run(opButtonTextBase)} sx={{
                        ...opButtonSx,
                        backgroundColor: "red",
                        padding: 0
                    }}>=</Button>
                </Box>
                <Box sx={{
                    gridArea: "7 / 3 / 8 / 4"
                }}>
                    <Button onClick={() => !loading && setText(opButtonTextBase.slice(0, -1))} sx={{
                        ...opButtonSx,
                        padding: 0
                    }}>{"<-"}</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
