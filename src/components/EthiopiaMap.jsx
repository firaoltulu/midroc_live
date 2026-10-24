import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { circInOut, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { feature } from 'topojson-client';
import { geoContains, geoMercator, geoPath } from 'd3-geo';
import rawTopo from '../data/ethiopia-regions.json';
import easternAfrica from '../data/eastern-africa-countries.json';

const fc = feature(rawTopo, rawTopo.objects.ETHADM1gbOpen);

const PROJECTION = geoMercator().center([40, 9]).scale(1900).translate([500, 360]);
const PATH = geoPath(PROJECTION);
const EAST_AFRICA_COUNTRIES = easternAfrica.features.map((country) => ({
  id: country.id,
  name: country.properties.name,
  d: PATH(country),
}));
const SEA_LABELS = [
  { name: 'RED SEA', position: PROJECTION([39, 17]) },
  { name: 'GULF OF ADEN', position: PROJECTION([47.5, 12]) },
  { name: 'ARABIAN SEA', position: PROJECTION([52, 12]) },
  { name: 'INDIAN OCEAN', position: PROJECTION([51, -1]) },
];

const REGIONS = fc.features.map((f, i) => ({
  id: f.properties.shapeISO || `r${i}`,
  name: f.properties.shapeName,
  d: PATH(f),
  pins: getRegionPins(f),
  index: i,
}));

const REGION_COUNT = REGIONS.length;

function getRegionPins(region) {
  const positions = [];
  const collectPositions = (coordinates) => {
    if (typeof coordinates[0] === 'number') {
      positions.push(coordinates);
      return;
    }
    coordinates.forEach(collectPositions);
  };
  collectPositions(region.geometry.coordinates);

  const longitudes = positions.map(([longitude]) => longitude);
  const latitudes = positions.map(([, latitude]) => latitude);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const divisions = 48;
  const candidates = [];

  for (let x = 0; x <= divisions; x += 1) {
    for (let y = 0; y <= divisions; y += 1) {
      const point = [
        minLongitude + ((maxLongitude - minLongitude) * x) / divisions,
        minLatitude + ((maxLatitude - minLatitude) * y) / divisions,
      ];
      if (geoContains(region, point)) candidates.push(PROJECTION(point));
    }
  }

  const projectedBounds = positions.map((point) => PROJECTION(point));
  const center = [
    (Math.min(...projectedBounds.map(([x]) => x)) + Math.max(...projectedBounds.map(([x]) => x))) / 2,
    (Math.min(...projectedBounds.map(([, y]) => y)) + Math.max(...projectedBounds.map(([, y]) => y))) / 2,
  ];
  const pins = [];

  while (pins.length < 4 && candidates.length > 0) {
    let bestIndex = 0;
    let bestDistance = Number.NEGATIVE_INFINITY;

    candidates.forEach(([x, y], candidateIndex) => {
      const distance = pins.length === 0
        ? (x - center[0]) ** 2 + (y - center[1]) ** 2
        : Math.min(...pins.map(([pinX, pinY]) => (x - pinX) ** 2 + (y - pinY) ** 2));
      const score = pins.length === 0 ? -distance : distance;
      if (score > bestDistance) {
        bestDistance = score;
        bestIndex = candidateIndex;
      }
    });

    pins.push(candidates.splice(bestIndex, 1)[0]);
  }

  return pins;
}

function readVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function EthiopiaMap({ scrollProgress }) {
  const reduceMotion = useReducedMotion();
  const smoothedProgress = useSpring(scrollProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.45,
  });
  const mapProgress = reduceMotion ? scrollProgress : smoothedProgress;
  const baseFill = useMotionValue(readVar('--green-700', '#23572c'));
  const litFill = useMotionValue(readVar('--gold-300', '#e6c878'));
  const strokeColor = useMotionValue(readVar('--line-strong', 'rgba(255,255,255,0.16)'));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => {
      baseFill.set(readVar('--green-700', '#23572c'));
      litFill.set(readVar('--gold-300', '#e6c878'));
      strokeColor.set(readVar('--line-strong', 'rgba(255,255,255,0.16)'));
    };
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [baseFill, litFill, strokeColor]);

  return createPortal(
    <div className="eth-map" aria-hidden="true">
      <div className="eth-map__stage">
        <svg
          className="eth-map__context"
          viewBox="0 0 1000 720"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="eth-map__east-africa">
            {EAST_AFRICA_COUNTRIES.map((country) => (
              <path
                key={country.id}
                d={country.d}
                fill="var(--green-500, #3f8a4a)"
                fillOpacity={0.08}
                stroke="var(--gold-300, #e6c878)"
                strokeOpacity={0.45}
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
            ))}
          </g>
          <g
            fill="var(--gold-100, #f5e7c4)"
            fontFamily="var(--font-sans, sans-serif)"
            fontSize={12}
            fontWeight={600}
            letterSpacing={1.5}
            opacity={0.65}
            textAnchor="middle"
          >
            {SEA_LABELS.map(({ name, position }) => (
              <text key={name} x={position[0]} y={position[1]}>{name}</text>
            ))}
          </g>
        </svg>
        <div className="eth-map__art">
          <svg
            viewBox="0 0 1000 720"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'block' }}
          >
            <defs>
              <radialGradient id="eth-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--gold-500, #c9a14a)" stopOpacity="0.42" />
                <stop offset="55%" stopColor="var(--green-500, #3f8a4a)" stopOpacity="0.26" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              {/* <radialGradient id="eth-vignette" cx="60%" cy="50%" r="60%">
                <stop offset="20%" stopColor="black" stopOpacity="0" />
                <stop offset="60%" stopColor="black" stopOpacity="0" />

                <stop offset="100%" stopColor="black" stopOpacity="0.45" />
              </radialGradient> */}
            </defs>

            <circle cx="500" cy="360" r="330" fill="url(#eth-halo)" />

            {REGIONS.map((r, i) => (
              <RegionPath
                key={r.id}
                d={r.d}
                pins={r.pins}
                name={r.name}
                index={i}
                total={REGION_COUNT}
                scrollProgress={mapProgress}
                baseFill={baseFill}
                litFill={litFill}
                strokeColor={strokeColor}
              />
            ))}

            <rect x="0" y="0" width="1000" height="720" fill="url(#eth-vignette)" pointerEvents="none" />
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RegionPath({ d, pins, name, index, total, scrollProgress, baseFill, litFill, strokeColor }) {
  const reduce = useReducedMotion();
  const center = (index + 0.5) / total;
  const half = 1 / total;
  const inMin = Math.max(0, center - half);
  const outMax = Math.min(1, center + half);
  const mid = (inMin + outMax) / 2;

  const fill = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [baseFill.get(), baseFill.get(), baseFill.get()] : [baseFill, litFill, baseFill],
    { ease: circInOut }
  );
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, inMin - 0.06), inMin, mid, outMax, Math.min(1, outMax + 0.06)],
    reduce ? [0.85, 0.85, 0.85, 0.85, 0.85] : [0.55, 0.92, 1, 0.92, 0.55],
    { ease: circInOut }
  );
  const strokeOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0.34, 0.34, 0.34] : [0.3, 0.48, 0.3],
    { ease: circInOut }
  );
  const activeStrokeOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0, 0, 0] : [0, 0.7, 0],
    { ease: circInOut }
  );
  const pinOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0, 0, 0] : [0, 0.8, 0],
    { ease: circInOut }
  );
  const pinRadius = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [3.5, 3.5, 3.5] : [3.5, 4.5, 3.5],
    { ease: circInOut }
  );

  return (
    <>
      <motion.path
        d={d}
        style={{
          fill,
          opacity,
          strokeOpacity,
        }}
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeLinejoin="round"
      >
        <title>{name}</title>
      </motion.path>
      <motion.path
        d={d}
        fill="none"
        stroke="var(--gold-100, #f5e7c4)"
        strokeWidth={3.2}
        strokeLinejoin="round"
        style={{
          strokeOpacity: activeStrokeOpacity,
          filter: 'drop-shadow(0 0 4px rgba(230,200,120,0.65)) drop-shadow(0 0 10px rgba(201,161,74,0.35))',
        }}
        aria-hidden="true"
      />
      {pins.map(([x, y]) => (
        <motion.g
          key={`${x}-${y}`}
          style={{
            opacity: pinOpacity,
            filter: 'drop-shadow(0 0 5px rgba(230,200,120,0.6)) drop-shadow(0 0 11px rgba(201,161,74,0.35))',
          }}
          aria-hidden="true"
        >
          <circle cx={x} cy={y} r={10} fill="var(--gold-300, #e6c878)" opacity={0.28} />
          <motion.circle
            cx={x}
            cy={y}
            style={{ r: pinRadius }}
            fill="var(--gold-100, #f5e7c4)"
            stroke="var(--ink-0, #f5f3ee)"
            strokeWidth={1.5}
          />
          <circle cx={x} cy={y} r={1.6} fill="var(--ink-0, #f5f3ee)" />
        </motion.g>
      ))}
    </>
  );
}
