import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as Engine from './planet-logic';

// --- COMPONENTS ---

// 1. Tag Component
const Tag = ({ tag }: { tag: string }) => {
    const map: Record<string, string> = { 'C':'tag-c', 'Si':'tag-si', 'Fe':'tag-fe', 'X':'tag-x', 'N':'tag-none', 'O':'tag-none', 'S':'tag-fe', 'Bio':'tag-bio' };
    const cls = map[tag] || 'tag-none';
    return <span className={`tag ${cls}`}>[{tag}]</span>;
};

// 2. Starfield
const Starfield = () => {
    const stars = useMemo(() => {
        return Array.from({ length: 80 }).map((_, i) => ({
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            width: Math.random() * 2 + 'px',
            delay: Math.random() * 5 + 's',
        }));
    }, []);

    return (
        <div className="stars" id="starfield">
            {stars.map((s, i) => (
                <div key={i} className="star" style={{
                    top: s.top, left: s.left, width: s.width, height: s.width, animationDelay: s.delay
                }} />
            ))}
        </div>
    );
};

// 3. Planet Render Component
const PlanetDisplay = React.memo(({ seed, viewState }: { seed: string, viewState: any }) => {
    const { waterLevel, lensStrength, shadow, cloudsEnabled } = viewState;
    
    // Memoize Data Generation
    const data = useMemo(() => {
        const rng = Engine.createRNG(seed);
        return Engine.generatePlanetData(rng);
    }, [seed]);

    const palette = useMemo(() => Engine.generatePalette(data), [data]);

    const geologyPaths = useMemo(() => {
        const rng = Engine.createRNG(seed);
        return Engine.generateGeologyPaths(rng, data);
    }, [seed, data]);

    const cloudPaths = useMemo(() => {
        const rng = Engine.createRNG(seed);
        return Engine.generateCloudPaths(rng, data);
    }, [seed, data]);

    const ringPaths = useMemo(() => {
        if (!data.rings) return [];
        const rng = Engine.createRNG(seed);
        return Engine.generateRingPaths(rng, data);
    }, [seed, data]);

    const layerThresholds = useMemo(() => {
        const rng = Engine.createRNG(seed); // Need RNG to replicate jitter
        const base = Engine.generateLayerThresholds(data.solid.type, data.solid.roughness, palette.length);
        return base.map(val => {
             const jitter = (rng() * 0.04) - 0.02;
             return Math.max(0, Math.min(1, val + jitter));
        });
    }, [seed, data, palette.length]);

    const lensDataURI = useMemo(() => Engine.createLensDataURI(lensStrength), [lensStrength]);
    
    // Dynamic Values
    const waterFactor = waterLevel / 100;
    const shadowOp = shadow / 100;

    const noiseID = `noise-${seed}`;
    const structID = `struct-${seed}`;
    
    // Helper to calculate intercept
    const getIntercept = (baseLevel: number, slope: number, waterOffset: number) => {
        const target = baseLevel + waterOffset;
        return -(target * slope);
    };
    const waterOffset = (waterFactor - 0.5) * 1.5;

    return (
        <svg id="render-target" viewBox="-200 -200 1400 1400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="planet-clip"><circle cx="500" cy="500" r="450" /></clipPath>
                
                <filter id="geo-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="25" />
                </filter>
                <filter id="liquid-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1" />
                </filter>
                <filter id="geo-warp" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" result="warpNoise"/>
                    <feDisplacementMap in2="warpNoise" in="SourceGraphic" scale="35" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
                <filter id="zone-warp" x="-20%" y="-20%" width="140%" height="140%">
                     <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="123" result="turb"/>
                     <feDisplacementMap in="SourceGraphic" in2="turb" scale="60" xChannelSelector="R" yChannelSelector="G"/>
                     <feGaussianBlur stdDeviation="10" />
                </filter>
                <filter id="ice-noise" x="-20%" y="-20%" width="140%" height="140%">
                     <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="500" result="frost"/>
                     <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" />
                </filter>
                <filter id="blur-shadow"><feGaussianBlur stdDeviation="20" /></filter>

                {/* MASTER NOISE FILTER */}
                <filter id={noiseID} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency={data.baseFreq} numOctaves="8" seed={parseInt(seed.split('-')[1]) || 123} result="turb"/>
                    {/* SAFARI FIX: Explicit Dimensions */}
                    <feImage href={lensDataURI} result="lensMap" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none"/>
                    <feDisplacementMap in="turb" in2="lensMap" scale="100" xChannelSelector="R" yChannelSelector="G" result="warpedTurb" />
                    <feColorMatrix type="saturate" values="0" in="warpedTurb" result="bw"/>
                    <feComponentTransfer in="bw" result="contrasted">
                        <feFuncR type="linear" slope="4" intercept="-1.5"/>
                        <feFuncG type="linear" slope="4" intercept="-1.5"/>
                        <feFuncB type="linear" slope="4" intercept="-1.5"/>
                    </feComponentTransfer>
                </filter>

                {/* CLOUD FILTER */}
                <filter id={`cloud-atmos-${seed}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" result="distorted"/>
                    <feGaussianBlur in="distorted" stdDeviation="2" result="blurred"/> 
                    <feComponentTransfer in="blurred" result="clouds">
                        <feFuncA type="linear" slope="5" intercept="-1.5"/> 
                    </feComponentTransfer>
                    <feImage href={lensDataURI} result="lensMap" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none"/>
                    <feDisplacementMap in="clouds" in2="lensMap" scale="15" xChannelSelector="R" yChannelSelector="G" result="finalClouds"/>
                </filter>

                {/* LAYER MASKS */}
                {layerThresholds.map((level, i) => {
                    const intercept = getIntercept(level, 60, waterOffset);
                    return (
                        <React.Fragment key={i}>
                            <filter id={`thresh-layer-${i}-${seed}`}>
                                <feComponentTransfer>
                                    <feFuncR type="linear" slope="60" intercept={intercept} />
                                    <feFuncG type="linear" slope="60" intercept={intercept} />
                                    <feFuncB type="linear" slope="60" intercept={intercept} />
                                </feComponentTransfer>
                            </filter>
                            <mask id={`mask-layer-${i}-${seed}`}>
                                <g filter={`url(#thresh-layer-${i}-${seed})`}>
                                    <rect width="1000" height="1000" filter={`url(#${noiseID}) url(#geo-warp)`} />
                                    <use href={`#${structID}`} style={{ mixBlendMode: "lighten" }} />
                                </g>
                            </mask>
                        </React.Fragment>
                    )
                })}

                {/* MASKS FOR LIQUID/LAND */}
                <filter id={`thresh-water-${seed}`}>
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="120" intercept={(waterFactor * 120) + 0.5} />
                        <feFuncG type="linear" slope="120" intercept={(waterFactor * 120) + 0.5} />
                        <feFuncB type="linear" slope="120" intercept={(waterFactor * 120) + 0.5} />
                    </feComponentTransfer>
                </filter>
                <mask id={`mask-liquid-final-${seed}`}>
                     <g filter={`url(#thresh-water-${seed})`}>
                        <rect width="1000" height="1000" filter={`url(#${noiseID}) url(#geo-warp)`} />
                     </g>
                     {/* Mask by Organic Zones */}
                     <rect width="1000" height="1000" fill="white" mask={`url(#mask-liquid-zone-${seed})`} style={{ mixBlendMode: 'multiply' }}/>
                </mask>

                <filter id={`thresh-land-only-${seed}`}>
                     <feComponentTransfer>
                        <feFuncR type="linear" slope="-50" intercept={-(waterFactor * 50) + 0.5} />
                        <feFuncG type="linear" slope="-50" intercept={-(waterFactor * 50) + 0.5} />
                        <feFuncB type="linear" slope="-50" intercept={-(waterFactor * 50) + 0.5} />
                    </feComponentTransfer>
                </filter>
                <mask id={`mask-land-only-${seed}`}>
                     <g filter={`url(#thresh-land-only-${seed})`}>
                        <rect width="1000" height="1000" filter={`url(#${noiseID}) url(#geo-warp)`} />
                     </g>
                </mask>

                {/* ZONE GRADIENTS */}
                <OrganicZoneGradient id={`grad-liq-${seed}`} type="liquid" latBoil={data.latBoil} latFreeze={data.latFreeze} tilt={data.tilt} />
                <mask id={`mask-liquid-zone-${seed}`}>
                    <rect width="1000" height="1000" fill={`url(#grad-liq-${seed})`} filter="url(#zone-warp)"/>
                </mask>

                <OrganicZoneGradient id={`grad-ice-${seed}`} type="ice" latBoil={data.latBoil} latFreeze={data.latFreeze} tilt={data.tilt} />
                <mask id={`mask-ice-zone-${seed}`}>
                    <rect width="1000" height="1000" fill={`url(#grad-ice-${seed})`} filter="url(#zone-warp)"/>
                </mask>

                {data.hasLife && (
                    <>
                        <OrganicBandGradient id={`grad-bio-${seed}`} minT={data.minT} maxT={data.maxT} targetMin={data.bioMinT} targetMax={data.bioMaxT} tilt={data.tilt} />
                        <mask id={`mask-bio-zone-${seed}`}>
                            <rect width="1000" height="1000" fill={`url(#grad-bio-${seed})`} filter="url(#zone-warp)"/>
                        </mask>
                    </>
                )}

                <radialGradient id={`grad-ocean-${seed}`} cx="50%" cy="50%">
                    <stop offset="0%" stopColor={Engine.artColor(data.liquid.color, -5, 5)} />
                    <stop offset="30%" stopColor={data.liquid.color} />
                </radialGradient>

                <radialGradient id="grad-atmos">
                    <stop offset="85%" stopColor={data.cloudHex} stopOpacity="0" />
                    <stop offset="95%" stopColor={data.cloudHex} stopOpacity={data.atmosDensity * 0.4} />
                    <stop offset="100%" stopColor={data.cloudHex} stopOpacity={data.atmosDensity} />
                </radialGradient>
                
                <radialGradient id="shadow-grad" cx="35%" cy="35%">
                    <stop offset="50%" stopColor="#050508" stopOpacity="0"/>
                    <stop offset="100%" stopColor="#050508" stopOpacity={shadowOp}/>
                </radialGradient>

                <g id={structID}>
                    {geologyPaths.map((d, i) => (
                         <path key={i} d={d} fill="none" stroke="white" strokeWidth={Math.random() * 30 + 10} filter="url(#geo-blur)" opacity={0.6 * data.roughness} />
                    ))}
                </g>

            </defs>

            <g id="layer-rings-back">
                {ringPaths.filter(r => !r.front).map(r => (
                    <path key={r.key} d={r.d} stroke={r.stroke} fill="none" strokeWidth={r.width} strokeOpacity={r.opacity} transform={`rotate(${data.tilt}, 500, 500)`} />
                ))}
            </g>

            <circle id="planet-halo" cx="500" cy="500" r="453" fill="#111115" />

            <g id="planet-sphere" clipPath="url(#planet-clip)">
                <g id="group-terrain">
                    {palette.map((color, i) => (
                        <rect key={i} width="1000" height="1000" fill={color} mask={`url(#mask-layer-${i}-${seed})`} />
                    ))}
                </g>

                <g id="group-liquid">
                    <rect width="1000" height="1000" fill={`url(#grad-ocean-${seed})`} mask={`url(#mask-liquid-final-${seed})`} filter={data.liquid.type !== "magma" ? "url(#liquid-blur)" : undefined} />
                    <ellipse cx="300" cy="300" rx="150" ry="100" fill="white" opacity="0.3" transform="rotate(-45, 300, 300)" filter="url(#geo-blur)" mask={`url(#mask-liquid-final-${seed})`} />
                </g>

                <g id="group-ice" style={{ mixBlendMode: 'normal' }}>
                    <rect width="1000" height="1000" fill={data.liquid.frozenColor} mask={`url(#mask-ice-zone-${seed})`} filter="url(#ice-noise)" />
                </g>

                <g id="group-bio">
                    {data.hasLife && (
                        <g mask={`url(#mask-land-only-${seed})`}>
                            <rect width="1000" height="1000" fill={data.bioColor!} mask={`url(#mask-bio-zone-${seed})`} opacity="0.7" style={{ mixBlendMode: 'multiply' }} />
                        </g>
                    )}
                </g>
            </g>

            {cloudsEnabled && data.atmosDensity > 0.1 && (
                <g id="layer-clouds" clipPath="url(#planet-clip)">
                    <g transform={`rotate(${data.tilt}, 500, 500)`} filter={`url(#cloud-atmos-${seed})`} opacity="0.6">
                        {cloudPaths.map(c => (
                            <path key={c.key} d={c.d} fill={c.fill} fillOpacity={c.opacity} />
                        ))}
                    </g>
                </g>
            )}

            <circle id="atmos-glow" cx="500" cy="500" r="450" fill="url(#grad-atmos)" pointerEvents="none" style={{ mixBlendMode: 'screen' }} />
            <circle id="rim-light" cx="500" cy="500" r="448" fill="none" stroke={Engine.artColor(data.cloudHex, 20, -10, 0)} strokeWidth="3" opacity="0.4" pointerEvents="none" />

            <circle id="shadow-overlay" cx="500" cy="500" r="450" fill="url(#shadow-grad)" pointerEvents="none" />
            <path id="terminator" d="M 500,50 A 450,450 0 1,1 500,950 A 550,450 0 1,0 500,50" fill="#08080a" opacity={shadowOp} filter="url(#blur-shadow)" style={{ mixBlendMode: 'multiply' }} pointerEvents="none" />

            <g id="layer-rings-front">
                {ringPaths.filter(r => r.front).map(r => (
                    <path key={r.key} d={r.d} stroke={r.stroke} fill="none" strokeWidth={r.width} strokeOpacity={r.opacity} transform={`rotate(${data.tilt}, 500, 500)`} />
                ))}
            </g>
        </svg>
    );
});

// Helper for gradients
const OrganicZoneGradient = ({ id, type, latBoil, latFreeze, tilt }: any) => {
    const spread = 0.02;
    let stops = [];
    
    if (type === "liquid") {
        const boilY_top = 0.5 - (latBoil * 0.5); 
        const boilY_bot = 0.5 + (latBoil * 0.5);
        stops = [
            { o: "0%", c: "white" },
            { o: (boilY_top-spread)*100 + "%", c: "white" },
            { o: (boilY_top+spread)*100 + "%", c: "#c0c0c0" },
            { o: (boilY_bot-spread)*100 + "%", c: "#c0c0c0" },
            { o: (boilY_