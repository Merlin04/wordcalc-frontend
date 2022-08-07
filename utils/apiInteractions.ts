import { useCallback, useMemo, useState } from "react";
import ohm from "ohm-js";

const url = "http://magnesium-cara.dyn.wpi.edu:8090";

const grammar = ohm.grammar(String.raw`ExpressionLanguage {
  Program = Exp
  Exp     = Exp addop Factor        --binary
          | Factor
  Factor  = Primary expop  --binary
          | Primary
  Primary = "(" Exp ")"           --parens
          | text
  addop   = "+" | "-"
  expop   = "^2"
  text  = letter+
}`);

// This is spaghetti code. I am sorry
// Parsers! At the disco
const semantics = grammar.createSemantics();
semantics.addOperation("evaluate", {
    Program(body) {
        return body.evaluate();
    },
    async Exp_binary(left, op, right) {
        return await (op.sourceString === "+" ? getCloser : getSubtraction)(await left.evaluate(), await right.evaluate());
    },
    async Factor_binary(left, op) {
        return await getIntensify(await left.evaluate());
    },
    Primary_parens(open, expression, close) {
        return expression.evaluate();
    },
    text(text) {
        return text.evaluate().join("").toLowerCase();
    },
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) {
        return children.map((c: any) => c.evaluate())
    }
})

const parse = async (input: string) => {
    const match = grammar.match(input);
    if (match.succeeded()) {
        return (await semantics(match).evaluate()).trim();
    } else {
        throw new Error(match.message);
    }
}

type UseAppApiRunFn = (param: string) => Promise<void>;

export function useAppApi(): {
    loading: boolean,
    error: string | null,
    result: string | null,
    run: UseAppApiRunFn
} {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const run = useCallback<UseAppApiRunFn>(async (input) => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            setResult(await parse(input));
            setError("")
        } catch(err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    return useMemo(() => ({
        loading,
        error,
        result,
        run
    }), [loading, error, result, run]);
}

export async function getCloser(sentence: string, destination: string): Promise<string> {
    const resp = await fetch(`${url}/closest/${encodeURIComponent(sentence)}/${destination}`)

    const data = resp.text()
    console.log(data)

    return data
}

export async function getSubtraction(sentence: string, destination: string): Promise<string> {
    const resp = await fetch(`${url}/distance/${encodeURIComponent(sentence)}/${destination}`)

    const data = resp.text()
    console.log(data)

    return data
}

export async function getIntensify(sentence: string): Promise<string> {
    const resp = await fetch(`${url}/similar/${encodeURIComponent(sentence)}`)

    const data = resp.text()
    console.log(data)

    return data
}