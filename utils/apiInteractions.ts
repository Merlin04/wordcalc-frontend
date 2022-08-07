import { useCallback, useMemo, useState } from "react";
import ohm from "ohm-js";

const url = "http://magnesium-cara.dyn.wpi.edu:8090";

const grammar = ohm.grammar(String.raw`WC {
    Exp = Dyadic | Monadic | Text
    Dyadic = Add | Subtract
    Monadic = Intensify
    Add = Exp "+" Exp
    Subtract = Exp "-" Exp
    Intensify = Exp "^2"
    Text = letter+
}`);

const semantics = grammar.createSemantics();
semantics.addOperation("evaluate", {
    Exp(exp) {
        return exp.evaluate();
    },
    Dyadic(exp) {
        return exp.evaluate();
    },
    Monadic(exp) {
        return exp.evaluate();
    },
    async Add(exp1, _, exp2) {
        return getCloser(await exp1.evaluate(), await exp2.evaluate());
    },
    async Subtract(exp1, _, exp2) {
        return getSubtraction(await exp1.evaluate(), await exp2.evaluate());
    },
    async Intensify(exp, _) {
        return getIntensify(await exp.evaluate());
    },
    Text(text) {
        return text.evaluate().join("");
    },
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) {
        return children.map((c: any) => c.evaluate())
    }
})

const parse = (input: string) => {
    const match = grammar.match(input);
    if (match.succeeded()) {
        return semantics(match).evaluate();
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