import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { feature } from 'topojson-client';
import { geoContains, geoMercator, geoPath } from 'd3-geo';
import rawTopo from '../data/ethiopia-regions.json';

const fc = feature(rawTopo, rawTopo.objects.ETHADM1gbOpen);

const PROJECTION = geoMercator().center([40, 9]).scale(1900).translate([500, 360]);
const PATH = geoPath(PROJECTION);

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
  const reduce = useReducedMotion();

  const baseFill = useMotionValue(readVar('--green-700', '#23572c'));
  const litFill = useMotionValue(readVar('--gold-300', '#e6c878'));
  const strokeColor = useMotionValue(readVar('--line-strong', 'rgba(255,255,255,0.16)'));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => {
      baseFill.set(readVar('--green-700', '#23572c'));
      litFill.set(readVar('--gold-300', '#daa000'));
      strokeColor.set(readVar('--line-strong', 'rgba(232, 24, 24, 0.99)'));
    };
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [baseFill, litFill, strokeColor]);

  const parallaxY = useTransform(scrollProgress, [0, 1], reduce ? [0, 0] : [-40, 120]);
  const parallaxScale = useTransform(scrollProgress, [0, 0.4, 1], reduce ? [1, 1, 1] : [1, 1.06, 1.12]);
  const overallOpacity = useTransform(scrollProgress, [0, 0.85, 1], reduce ? [0.72, 0.72, 0.72] : [0.72, 0.6, 0.45]);

  return (
    <div
      className="eth-map"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <motion.div
        className="eth-map__stage"
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          perspective: '1600px',
          perspectiveOrigin: '50% 40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          y: parallaxY,
          scale: parallaxScale,
          opacity: overallOpacity,
        }}
      >
        <div
          style={{
            width: 'min(1100px, 95vw)',
            aspectRatio: '1000 / 720',
            transform: reduce ? 'none' : 'rotateX(10deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))',
          }}
        >
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
                scrollProgress={scrollProgress}
                baseFill={baseFill}
                litFill={litFill}
                strokeColor={strokeColor}
              />
            ))}

            <rect x="0" y="0" width="1000" height="720" fill="url(#eth-vignette)" pointerEvents="none" />
          </svg>
        </div>
      </motion.div>
    </div>
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
    reduce ? [baseFill.get(), baseFill.get(), baseFill.get()] : [baseFill, litFill, baseFill]
  );
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, inMin - 0.06), inMin, mid, outMax, Math.min(1, outMax + 0.06)],
    reduce ? [0.85, 0.85, 0.85, 0.85, 0.85] : [0.55, 0.92, 1, 0.92, 0.55]
  );
  const strokeOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0.45, 0.45, 0.45] : [0.45, 0.85, 0.45]
  );
  const activeStrokeOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0, 0, 0] : [0, 0.9, 0]
  );
  const pinOpacity = useTransform(
    scrollProgress,
    [inMin, mid, outMax],
    reduce ? [0.65, 0.65, 0.65] : [0, 1, 0]
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
        strokeWidth={1.2}
        strokeLinejoin="round"
      >
        <title>{name}</title>
      </motion.path>
      <motion.path
        d={d}
        fill="none"
        stroke="#b7f7a8"
        strokeWidth={1.8}
        strokeLinejoin="round"
        style={{ strokeOpacity: activeStrokeOpacity }}
        aria-hidden="true"
      />
      {pins.map(([x, y]) => (
        <motion.g key={`${x}-${y}`} style={{ opacity: pinOpacity }} aria-hidden="true">
          <circle cx={x} cy={y} r={7} fill="#b7f7a8" opacity={0.24} />
          <circle cx={x} cy={y} r={3.2} fill="#d9ffd0" stroke="#b7f7a8" strokeWidth={1} />
        </motion.g>
      ))}
    </>
  );
}
