// Two original white silhouette characters for the home page.
//
// Climber: hangs on a rope at the right edge and lowers himself down the page
// as you scroll. Arms and legs are redrawn every frame by HomeScrollEffects.
// Waver: the climber again, landed in the closing section. He holds the end
// of his rope (coiled on the floor) and waves. Pure CSS animation.

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
      <svg
        viewBox="0 0 240 330"
        className="waver__svg"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* The rope fades in from above: he's just come down it */}
          <linearGradient
            id="waver-rope"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="70"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
        </defs>
        {/* shadow on the ground */}
        <ellipse
          cx="122"
          cy="306"
          rx="62"
          ry="5"
          fill="#fff"
          fillOpacity="0.16"
          stroke="none"
        />
        {/* the rope, from above to his hand, then slack and coiled on the floor */}
        <path d="M70 0 V146" stroke="url(#waver-rope)" strokeWidth="4" />
        <path
          d="M70 150 C70 210 66 262 62 290 C60 304 32 306 30 298 C28 290 50 288 56 298"
          strokeWidth="4"
        />
        {/* legs and feet */}
        <polyline points="110,214 106,258 104,298 92,300" strokeWidth="19" />
        <polyline points="134,214 138,258 140,298 152,300" strokeWidth="19" />
        {/* body */}
        <rect
          x="98"
          y="121"
          width="48"
          height="104"
          rx="24"
          fill="#fff"
          stroke="none"
        />
        {/* head, with the same cap as the climber */}
        <circle cx="122" cy="92" r="26" fill="#fff" stroke="none" />
        <path d="M96 85 q26 -29 52 0 l17 2" strokeWidth="9.5" />
        {/* arm gripping the rope */}
        <polyline points="108,138 84,170 72,150" strokeWidth="17" />
        <circle cx="70" cy="147" r="10.5" fill="#fff" stroke="none" />
        {/* waving arm: the forearm swings from the elbow */}
        <polyline points="136,138 172,122" strokeWidth="17" />
        <g className="waver__arm">
          <line x1="172" y1="122" x2="190" y2="80" strokeWidth="17" />
          <circle cx="193" cy="72" r="11" fill="#fff" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
