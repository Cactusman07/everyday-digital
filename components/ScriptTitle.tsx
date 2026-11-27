// The script font has no numerals (they render as decorative glyphs), so any
// digits in a script title are set in the display font instead.

export default function ScriptTitle({ text }: { text: string }) {
  return (
    <>
      {text.split(/([0-9$%][0-9$%,.]*)/).map((part, i) =>
        i % 2 ? (
          <span key={i} className="pg-num">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
