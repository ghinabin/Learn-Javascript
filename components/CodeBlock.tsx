// Server component — no "use client" needed, pure rendering
const TOKEN_DEFS: Array<{ type: string; source: string }> = [
  { type: "comment", source: String.raw`\/\/[^\n]*` },
  { type: "comment", source: String.raw`\/\*[\s\S]*?\*\/` },
  { type: "string",  source: String.raw`\`(?:[^\`\\]|\\.)*\`` },
  { type: "string",  source: String.raw`'(?:[^'\\]|\\.)*'` },
  { type: "string",  source: String.raw`"(?:[^"\\]|\\.)*"` },
  { type: "keyword", source: String.raw`\b(?:const|let|var|function|return|if|else|for|while|do|class|new|this|true|false|null|undefined|typeof|instanceof|import|export|default|from|async|await|of|in|break|continue|switch|case|throw|try|catch|finally)\b` },
  { type: "number",  source: String.raw`\b\d+\.?\d*\b` },
  { type: "builtin", source: String.raw`\b(?:console|document|window|fetch|Math|Array|Object|String|Number|Boolean|Promise|JSON|localStorage|sessionStorage|setTimeout|setInterval|clearTimeout|clearInterval|Error|Date|Map|Set|parseInt|parseFloat|isNaN|Symbol)\b` },
];

const COLORS: Record<string, string> = {
  comment: "#6a9955",
  string:  "#ce9178",
  keyword: "#569cd6",
  number:  "#b5cea8",
  builtin: "#4ec9b0",
  plain:   "#e4e4e7",
};

function tokenize(code: string) {
  // Fresh regex instances per call — safe for concurrent server renders
  const patterns = TOKEN_DEFS.map(({ type, source }) => ({
    type,
    re: new RegExp(source, "y"),
  }));

  const tokens: Array<{ type: string; value: string }> = [];
  let i = 0;

  while (i < code.length) {
    let matched = false;
    for (const { type, re } of patterns) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m) {
        tokens.push({ type, value: m[0] });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = tokens[tokens.length - 1];
      if (last?.type === "plain") last.value += code[i];
      else tokens.push({ type: "plain", value: code[i] });
      i++;
    }
  }

  return tokens;
}

export default function CodeBlock({ code }: { code: string }) {
  const tokens = tokenize(code);
  return (
    <pre
      style={{
        background: "#0d0d0f",
        border: "1px solid var(--surface-2)",
        borderRadius: 10,
        padding: "18px 20px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 1.7,
        overflowX: "auto",
        margin: 0,
        whiteSpace: "pre",
      }}
    >
      {tokens.map((token, idx) => (
        <span key={idx} style={{ color: COLORS[token.type] ?? COLORS.plain }}>
          {token.value}
        </span>
      ))}
    </pre>
  );
}
