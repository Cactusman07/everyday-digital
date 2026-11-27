// Two original white silhouette characters for the home page.
//
// Climber: hangs on a rope at the right edge and lowers himself down the page
// as you scroll. Arms and legs are redrawn every frame by DiveEffects.
// Waver: stands in the closing section with a laptop under one arm and waves
// on a loop. Pure CSS animation.

export function Climber() {
  return (
    <div className="climber" data-climber aria-hidden="true">
      <div className="climber__rope" data-climber-rope />
      <svg
        className="climber__fig"
        data-climber-fig
        viewBox="0 0 80 150"
        width="80"
        height="150"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* legs (points set by script) */}
        <polyline data-leg="l" points="40,96 34,118 30,140" strokeWidth="8" />
        <polyline data-leg="r" points="40,96 46,118 50,140" strokeWidth="8" />
        {/* body */}
        <rect
          x="30"
          y="56"
          width="20"
          height="44"
          rx="10"
          fill="#fff"
          stroke="none"
        />
        {/* head, with a cap peak so he reads as a little person, not a pin */}
        <circle cx="40" cy="44" r="11" fill="#fff" stroke="none" />
        <path d="M29 41 q11 -12 22 0 l7 1" strokeWidth="4" />
        {/* arms (points set by script) */}
        <polyline data-arm="l" points="40,62 31,46 40,26" strokeWidth="7" />
        <polyline data-arm="r" points="40,62 49,46 40,32" strokeWidth="7" />
        {/* hands */}
        <circle
          data-hand="l"
          cx="40"
          cy="26"
          r="4.5"
          fill="#fff"
          stroke="none"
        />
        <circle
          data-hand="r"
          cx="40"
          cy="32"
          r="4.5"
          fill="#fff"
          stroke="none"
        />
      </svg>
    </div>
  );
}

export function Waver() {
  return (
    <div className="waver" data-waver aria-hidden="true">
      <p className="waver__bubble">Kia ora!</p>
      <svg viewBox="0 0 260 340" className="waver__svg" fill="#fff">
        {/* legs and shoes */}
        <rect x="98" y="196" width="26" height="110" rx="13" />
        <rect x="136" y="196" width="26" height="110" rx="13" />
        <rect x="84" y="292" width="42" height="20" rx="10" />
        <rect x="134" y="292" width="42" height="20" rx="10" />
        {/* body */}
        <rect x="88" y="104" width="84" height="116" rx="36" />
        {/* head and cap */}
        <circle cx="130" cy="66" r="34" />
        <path d="M96 58 Q130 14 164 58 L186 62 Q176 70 162 66 Z" />
        {/* arm down, holding a laptop */}
        <g className="waver__hold">
          <rect
            x="66"
            y="112"
            width="24"
            height="88"
            rx="12"
            transform="rotate(14 78 118)"
          />
          <rect
            x="30"
            y="170"
            width="70"
            height="46"
            rx="6"
            transform="rotate(-10 65 193)"
          />
          <circle
            cx="65"
            cy="193"
            r="6"
            fill="#000"
            transform="rotate(-10 65 193)"
          />
        </g>
        {/* waving arm */}
        <g className="waver__arm">
          <rect x="168" y="44" width="24" height="84" rx="12" />
          <circle cx="180" cy="40" r="17" />
        </g>
      </svg>
    </div>
  );
}
