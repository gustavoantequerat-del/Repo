export function Tip({ text, children, icon, pos }) {
  const trigger = icon ? (
    <span className="tip-icon" aria-label="Más información">i</span>
  ) : (
    <span className="tip-trigger">{children}</span>
  );
  return (
    <span className="tip" data-pos={pos} tabIndex="0">
      {icon ? <>{children}{children && ' '}{trigger}</> : trigger}
      <span className="tip-bubble" role="tooltip">{text}</span>
    </span>
  );
}
