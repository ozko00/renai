'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Topology, GeometryCollection } from 'topojson-specification';

const SIZE = 200;
const RADIUS = 90;
const CENTER = SIZE / 2;
const TOPOJSON_URL = '/data/countries-110m.json';

type WorldTopology = Topology<{
  countries: GeometryCollection;
  land: GeometryCollection;
}>;

type CountryFeatures = FeatureCollection<Geometry>;

let cachedFeatures: CountryFeatures | null = null;
let inflight: Promise<CountryFeatures> | null = null;

function loadCountries(): Promise<CountryFeatures> {
  if (cachedFeatures) return Promise.resolve(cachedFeatures);
  if (inflight) return inflight;
  inflight = fetch(TOPOJSON_URL, { cache: 'force-cache' })
    .then((res) => res.json() as Promise<WorldTopology>)
    .then((topology) => {
      const fc = feature(
        topology,
        topology.objects.countries
      ) as unknown as CountryFeatures;
      cachedFeatures = fc;
      return fc;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export default function SpinningGlobe() {
  const [features, setFeatures] = useState<CountryFeatures | null>(null);
  const [lambda, setLambda] = useState(50);

  // Static graticule (latitude/longitude grid) — reuse across renders
  const graticule = useMemo(() => geoGraticule10(), []);

  // Static elements (whirl rings) don't depend on rotation
  // The projection/path generator changes every frame as λ rotates
  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([CENTER, CENTER])
        .scale(RADIUS)
        .rotate([lambda, -10, 0])
        .clipAngle(90),
    [lambda]
  );

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  // Pre-compute SVG path strings for the current frame
  const countryPaths = useMemo(() => {
    if (!features) return [];
    return features.features
      .map((f) => pathGen(f))
      .filter((d): d is string => Boolean(d));
  }, [features, pathGen]);

  const graticulePath = useMemo(() => pathGen(graticule) ?? '', [pathGen, graticule]);
  const spherePath = useMemo(
    () => pathGen({ type: 'Sphere' }) ?? '',
    [pathGen]
  );

  // Load topojson once on mount
  useEffect(() => {
    let cancelled = false;
    loadCountries().then((fc) => {
      if (!cancelled) setFeatures(fc);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rotation loop — respect reduced motion
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let last = performance.now();
    // Degrees per millisecond — 360deg / 24000ms = full revolution every 24s
    const speed = 360 / 24000;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setLambda((prev) => (prev + speed * dt) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      className="block"
      role="img"
      aria-label="読み込み中"
    >
      {/* Outer whirl arc (clockwise) — partial dashed ring around the globe */}
      <g className="koi-globe-whirl-cw" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
        <path
          d={describeArc(CENTER, CENTER, RADIUS + 8, -120, 60)}
          fill="none"
          stroke="var(--koi-ink)"
          strokeWidth="0.9"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      </g>

      {/* Inner whirl arc (counter-clockwise) */}
      <g className="koi-globe-whirl-ccw" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
        <path
          d={describeArc(CENTER, CENTER, RADIUS + 4, 30, 220)}
          fill="none"
          stroke="var(--koi-ink)"
          strokeWidth="0.7"
          strokeOpacity="0.32"
          strokeLinecap="round"
        />
      </g>

      {/* Sphere outline (the equator-on outline of the globe) */}
      <path
        d={spherePath}
        fill="none"
        stroke="var(--koi-ink)"
        strokeWidth="1.4"
      />

      {/* Graticule (latitude/longitude grid) */}
      <path
        d={graticulePath}
        fill="none"
        stroke="var(--koi-ink)"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      />

      {/* Countries with borders — fade in once topojson loads */}
      <g
        style={{
          opacity: features ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
        }}
      >
        {countryPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--koi-ink)"
            strokeOpacity="0.7"
            strokeWidth="0.55"
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Describe an SVG arc path between two angles (in degrees) on a circle.
 * 0deg points to the right (3 o'clock); positive degrees go clockwise.
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const arcSpan = endAngle - startAngle;
  const largeArcFlag = arcSpan <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}
