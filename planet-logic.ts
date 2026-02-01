/**
 * PLANET LOGIC ENGINE
 * Extracted from SB PLANETGEN V9.6
 */

// --- TYPES ---
export interface Liquid {
    name: string;
    color: string;
    freeze: number;
    boil: number;
    tag: string;
    cloud: string;
    frozenColor: string;
    type: string;
    gas: string;
}

export interface Solid {
    name: string;
    color: string;
    tag: string;
    roughness: number;
    type: string;
    melt: number;
}

export interface PlanetData {
    baseTemp: number;
    maxT: number;
    minT: number;
    solid: Solid;
    liquid: Liquid;
    latBoil: number;
    latFreeze: number;
    oceanName: string;
    solidName: string;
    atmosName: string;
    atmosDensity: number;
    cloudHex: string;
    hasLife: boolean;
    lifeType: string;
    bioColor: string | null;
    bioMinT: number;
    bioMaxT: number;
    tilt: number;
    rings: boolean;
    baseFreq: number;
    suggestedWater: number;
    roughness: number;
}

// --- DATABASES ---
export const LIQUIDS: Liquid[] = [
    { name: "Water",       color: "#3b82f6", freeze: 0,    boil: 100,  tag: "C",  cloud: "#ffffff", frozenColor: "#e0f2fe", type: "standard", gas: "Water Vapor" },
    { name: "Salt Water",  color: "#2563eb", freeze: -2,   boil: 102,  tag: "C",  cloud: "#f1f5f9", frozenColor: "#bfdbfe", type: "standard", gas: "Water Vapor" },
    { name: "Heavy Water", color: "#60a5fa", freeze: 3.8,  boil: 101,  tag: "C",  cloud: "#e0f2fe", frozenColor: "#93c5fd", type: "standard", gas: "Deuterium" },
    { name: "Peroxide",    color: "#7dd3fc", freeze: -0.4, boil: 150,  tag: "O",  cloud: "#e0f2fe", frozenColor: "#e0f2fe", type: "standard", gas: "Oxygen" },
    { name: "Vinegar",     color: "#fde047", freeze: -2,   boil: 118,  tag: "C",  cloud: "#fef9c3", frozenColor: "#facc15", type: "acid",     gas: "Acetic Acid" },
    { name: "Brine",       color: "#0284c7", freeze: -21,  boil: 108,  tag: "C",  cloud: "#f0f9ff", frozenColor: "#bae6fd", type: "standard", gas: "Chlorine" },
    { name: "Methane",     color: "#38bdf8", freeze: -182, boil: -161, tag: "C",  cloud: "#bae6fd", frozenColor: "#bae6fd", type: "volatile", gas: "Methane" },
    { name: "Ethane",      color: "#0ea5e9", freeze: -183, boil: -88,  tag: "C",  cloud: "#e0f2fe", frozenColor: "#7dd3fc", type: "volatile", gas: "Ethane" },
    { name: "Nitrogen",    color: "#60a5fa", freeze: -210, boil: -195, tag: "N",  cloud: "#f1f5f9", frozenColor: "#93c5fd", type: "volatile", gas: "Nitrogen" },
    { name: "Ammonia",     color: "#2dd4bf", freeze: -77,  boil: -33,  tag: "N",  cloud: "#ccfbf1", frozenColor: "#5eead4", type: "acid",     gas: "Ammonia" },
    { name: "Chlorine",    color: "#a3e635", freeze: -101, boil: -34,  tag: "Cl", cloud: "#d9f99d", frozenColor: "#84cc16", type: "acid",     gas: "Chlorine Gas" },
    { name: "Sulfuric Acid", color: "#facc15", freeze: 10,  boil: 337,  tag: "S",  cloud: "#fef08a", frozenColor: "#eab308", type: "acid",    gas: "Sulfur Dioxide" },
    { name: "Nitric Acid",   color: "#fb7185", freeze: -42, boil: 83,   tag: "N",  cloud: "#fca5a5", frozenColor: "#f43f5e", type: "acid",    gas: "Nitrogen Dioxide" },
    { name: "Lava",        color: "#ff4500", freeze: 700,  boil: 3000, tag: "Si", cloud: "#57534e", frozenColor: "#292524", type: "magma",    gas: "Silicate Vapor" },
    { name: "Mercury",     color: "#cbd5e1", freeze: -39,  boil: 357,  tag: "Fe", cloud: "#e2e8f0", frozenColor: "#94a3b8", type: "metal",    gas: "Mercury Vapor" },
    { name: "Crude Oil",   color: "#020617", freeze: -57,  boil: 200,  tag: "C",  cloud: "#52525b", frozenColor: "#000000", type: "viscous",  gas: "Petroleum Gas" },
    { name: "Blood",       color: "#dc2626", freeze: -2,   boil: 100,  tag: "Bio",cloud: "#fca5a5", frozenColor: "#991b1b", type: "organic",  gas: "Iron Oxide" },
    { name: "Slime",       color: "#86efac", freeze: 0,    boil: 110,  tag: "Bio",cloud: "#bbf7d0", frozenColor: "#22c55e", type: "organic",  gas: "Methane" },
];

export const SOLIDS: Solid[] = [
    { name: "Silicate",   color: "#78716c", tag: "Si", roughness: 1.0, type: "rock", melt: 1200 },
    { name: "Basalt",     color: "#3f3f46", tag: "Si", roughness: 1.0, type: "rock", melt: 1100 },
    { name: "Granite",    color: "#a1a1aa", tag: "Si", roughness: 1.3, type: "rock", melt: 1215 },
    { name: "Sandstone",  color: "#f59e0b", tag: "Si", roughness: 0.5, type: "rock", melt: 1300 },
    { name: "Limestone",  color: "#e5e5e5", tag: "C",  roughness: 0.8, type: "rock", melt: 900 },
    { name: "Obsidian",   color: "#18181b", tag: "Si", roughness: 1.1, type: "glass", melt: 1000 },
    { name: "Pumice",     color: "#d4d4d8", tag: "Si", roughness: 1.5, type: "rock", melt: 1200 },
    { name: "Regolith",   color: "#737373", tag: "Si", roughness: 1.4, type: "dust", melt: 1200 },
    { name: "Slate",      color: "#475569", tag: "Si", roughness: 0.9, type: "rock", melt: 1200 },
    { name: "Marble",     color: "#f3f4f6", tag: "C",  roughness: 0.7, type: "rock", melt: 1200 },
    { name: "Water Ice",  color: "#e2e8f0", tag: "C",  roughness: 0.7, type: "ice", melt: 0 },
    { name: "Dry Ice",    color: "#eff6ff", tag: "C",  roughness: 0.4, type: "ice", melt: -78 },
    { name: "Blue Ice",   color: "#bfdbfe", tag: "C",  roughness: 0.9, type: "ice", melt: 0 },
    { name: "Methane Ice",color: "#7dd3fc", tag: "C",  roughness: 0.5, type: "ice", melt: -182 },
    { name: "Iron Ore",   color: "#b91c1c", tag: "Fe", roughness: 1.2, type: "metal", melt: 1538 },
    { name: "Gold Vein",  color: "#facc15", tag: "Fe", roughness: 1.0, type: "metal", melt: 1064 },
    { name: "Copper Ox",  color: "#34d399", tag: "Fe", roughness: 0.8, type: "metal", melt: 1085 },
    { name: "Titanium",   color: "#94a3b8", tag: "Fe", roughness: 0.9, type: "metal", melt: 1668 },
    { name: "Bone",       color: "#fef3c7", tag: "Bio", roughness: 0.9, type: "organic", melt: 200 }
];

// --- UTILS ---
export function hexToHSL(hex: string) {
    let r = parseInt(hex.substring(1,3), 16) / 255;
    let g = parseInt(hex.substring(3,5), 16) / 255;
    let b = parseInt(hex.substring(5,7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function artColor(hex: string, lShift: number, sShift = 0, hShift = 0) {
    const hsl = hexToHSL(hex);
    let newL = Math.max(6, Math.min(95, hsl.l + lShift));
    let newS = Math.max(0, Math.min(100, hsl.s + sShift));
    let newH = (hsl.h + hShift) % 360;
    if (newH < 0) newH += 360;
    return hslToHex(newH, newS, newL);
}

export function createRNG(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    let seed = (hash >>> 0) || 1;
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function createLensDataURI(strength: number): string {
    const size = 256; 
    const cvs = document.createElement('canvas');
    cvs.width = size; cvs.height = size;
    const ctx = cvs.getContext('2d');
    if (!ctx) return "";
    const imgData = ctx.createImageData(size, size);
    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            let nx = (x / size) * 2 - 1, ny = (y / size) * 2 - 1;
            let d = Math.sqrt(nx*nx + ny*ny);
            let r = 127 + (nx * d * strength); 
            let g = 127 + (ny * d * strength);
            r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g));
            const i = (y*size + x) * 4;
            imgData.data[i] = r; imgData.data[i+1] = g; imgData.data[i+2] = 0; imgData.data[i+3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return cvs.toDataURL();
}

// --- CORE GENERATION ---
export function generatePlanetData(rng: () => number): PlanetData {
    let baseTemp = Math.floor(rng() * 450 - 150);
    if (rng() > 0.92) baseTemp += Math.floor(rng() * 4500);
    if (rng() < 0.12) baseTemp -= 150;

    const equatorOffset = Math.floor(rng() * 50 + 20);
    const poleOffset = Math.floor(rng() * 80 + 40);
    const maxT = baseTemp + equatorOffset;
    const minT = baseTemp - poleOffset;

    const CtoK = (c: number) => c + 273.15;
    const baseK = CtoK(baseTemp);

    const validSolids = SOLIDS.filter(s => {
        if (s.type === 'ice' && baseTemp > s.melt) return false;
        return true;
    });
    
    let solid = validSolids.length > 0
        ? validSolids[Math.floor(rng() * validSolids.length)]
        : { name: "Scorched Crust", color: "#1a0500", tag: "Si", roughness: 1.2, type: "rock", melt: 9999 };

    const solidMeltK = CtoK(solid.melt);
    let solidName = solid.name;
    if (baseK > solidMeltK * 3) {
        solidName = `Molten ${solid.name}`;
        solid = { ...solid, color: artColor(solid.color, 25, 15, 5) };
    }

    const potentialLiquids = LIQUIDS.filter(l => baseTemp > l.freeze);
    
    let liquid: Liquid;
    let oceanName;
    let liquidState = "none";
    let cloudColor;
    let atmosContribution = 0;

    if (potentialLiquids.length > 0) {
        liquid = potentialLiquids[Math.floor(rng() * potentialLiquids.length)];
        oceanName = liquid.name;
        cloudColor = liquid.cloud;
        const liquidBoilK = CtoK(liquid.boil);

        if (baseK > liquidBoilK * 3) {
            liquidState = "sediment";
            oceanName = `${liquid.name} Sediment`;
            liquid = { ...liquid, color: artColor(liquid.color, -40, -30), tag: "Dry" };
            cloudColor = "#59544f";
            atmosContribution = 0.8;
        } else if (baseK > liquidBoilK) {
            liquidState = "boiling";
            oceanName = `Boiling ${liquid.name}`;
            atmosContribution = 0.4;
        } else {
            liquidState = "liquid";
            atmosContribution = 0.1;
        }
    } else {
        liquidState = "none";
        oceanName = "None";
        liquid = { name: "None", tag: "-", frozenColor: "#a1a1aa", cloud: "#a1a1aa", color: "#000", freeze: 0, boil: 0, type: "none", gas: "none" };
        cloudColor = "#a1a1aa";
    }

    let atmosName = "None";
    let atmosDensity = 0;

    if (rng() > 0.2) {
        atmosDensity = rng() * 0.3;
        atmosDensity += atmosContribution;
        atmosDensity = Math.max(0, Math.min(1, atmosDensity));

        if (liquidState === "sediment") {
            atmosDensity = 0.9 + (rng() * 0.1);
            atmosName = `Dense Vaporized ${liquid.name}`;
        } else if (atmosDensity < 0.05) {
            atmosName = "Trace Gases";
        } else {
            const desc = atmosDensity > 0.7 ? "Dense" : atmosDensity > 0.35 ? "Moderate" : "Thin";
            const gas = (liquid.gas && liquidState !== "none") ? liquid.gas : "Inert Mix";
            atmosName = `${desc} ${gas}`;
        }
    } else {
        atmosName = "Vacuum";
    }

    let hasLife = false;
    let lifeType = "None";
    let bioColor = null;
    let bioMinT = 0, bioMaxT = 0;

    if (liquidState === "liquid") {
        if (["Water", "Salt Water"].includes(liquid.name) && baseTemp > -15 && baseTemp < 60) {
            hasLife = true; lifeType = "Carbon-Based"; bioColor = "#10b981";
            bioMinT = -15; bioMaxT = 60;
        } else if (baseTemp > 200 && baseTemp < 1000 && solid.tag === "Si") {
            hasLife = true; lifeType = "Silicon-Based"; bioColor = "#9333ea";
            bioMinT = 200; bioMaxT = 1000;
        }
    }

    const getLatForTemp = (t: number) => (maxT === minT) ? 0.5 : (maxT - t) / (maxT - minT);
    let latBoil = getLatForTemp(liquid.boil || 9999);
    let latFreeze = getLatForTemp(liquid.freeze || 9998);

    if (liquidState === "sediment") latBoil = -2.0;

    let suggestedWater = (liquidState === "none" || liquidState === "sediment") ?
        Math.floor(rng() * 15) :
        Math.floor(rng() * 40 + 30);
    if (hasLife) suggestedWater = Math.floor(rng() * 20 + 45);

    return {
        baseTemp, maxT, minT,
        solid, liquid,
        latBoil, latFreeze,
        oceanName, solidName,
        atmosName, atmosDensity,
        cloudHex: cloudColor,
        hasLife, lifeType, bioColor, bioMinT, bioMaxT,
        tilt: rng() * 45,
        rings: rng() < 0.10,
        baseFreq: 0.006 - ((solid.roughness * 0.5) * 0.0045),
        suggestedWater,
        roughness: solid.roughness * (0.5 + rng())
    };
}

export function generatePalette(data: PlanetData) {
    const s = data.solid.color;
    return [
        artColor(s, -45, 10, -15),
        artColor(s, -30, 5, -10),
        artColor(s, -15, 0, -5),
        s,
        artColor(s, 15, 0, 5),
        artColor(s, 30, -10, 10),
        artColor(s, 50, -20, 15)
    ];
}

// --- CLOUDS ---
export interface CloudElement {
    d: string;
    fill: string;
    opacity: number;
    key: string;
}

export function generateCloudPaths(rng: () => number, data: PlanetData): CloudElement[] {
    if (data.atmosDensity < 0.1) return [];

    const R = 640;
    const systemElements: CloudElement[] = [];
    
    const generateCloudSpine = (yBase: number, width: number, xOffset: number, R: number) => {
        const points = [];
        const steps = 60;
        const startX = -width / 2 + xOffset;
        const stepSize = width / steps;
        
        let yDrift = 0;
        const driftStrength = 1.0; 

        for (let i = 0; i <= steps; i++) {
            const xRel = startX + (i * stepSize);
            const xRatio = xRel / R;
            const sphereCurve = (xRatio * xRatio) * yBase * -0.8; 
            let y = yBase + sphereCurve;
            yDrift += (rng() - 0.5) * driftStrength;
            yDrift *= 0.95;
            y += yDrift;
            points.push({ x: 500 + xRel, y: 500 + y });
        }
        return points;
    };

    const generateCloudShapeFromSpine = (spinePoints: {x:number, y:number}[], options: any) => {
        const { baseThickness = 30, thicknessVariance = 10, edgeNoise = 10, taperPower = 0.5 } = options;
        if (spinePoints.length < 3) return "";
        const topPoints = [], botPoints = [];
        let thickness = baseThickness;

        for (let i = 0; i < spinePoints.length; i++) {
            const p_curr = spinePoints[i];
            const p_next = spinePoints[Math.min(spinePoints.length-1, i+1)];
            const p_prev = spinePoints[Math.max(0, i-1)];
            const dx = p_next.x - p_prev.x, dy = p_next.y - p_prev.y;
            let nx = -dy, ny = dx;
            const len = Math.sqrt(nx*nx+ny*ny);
            if (len > 0) { nx /= len; ny /= len; }

            const progress = i / (spinePoints.length - 1);
            const taper = Math.sin(progress * Math.PI); 
            const thickMod = Math.pow(taper, taperPower);
            thickness += (rng() - 0.5) * (thicknessVariance / 5);
            thickness = Math.max(5, thickness); 
            const currentThick = thickness * thickMod;
            const jag = (rng() - 0.5) * edgeNoise * thickMod;
            
            topPoints.push({ x: p_curr.x + nx * (currentThick * 0.5 + jag), y: p_curr.y + ny * (currentThick * 0.5 + jag) });
            botPoints.push({ x: p_curr.x - nx * (currentThick * 0.5 + jag), y: p_curr.y - ny * (currentThick * 0.5 + jag) });
        }

        let d = `M ${topPoints[0].x.toFixed(1)} ${topPoints[0].y.toFixed(1)}`;
        for (let i = 1; i < topPoints.length; i++) d += ` L ${topPoints[i].x.toFixed(1)} ${topPoints[i].y.toFixed(1)}`;
        for (let i = botPoints.length - 1; i >= 0; i--) d += ` L ${botPoints[i].x.toFixed(1)} ${botPoints[i].y.toFixed(1)}`;
        d += " Z";
        return d;
    };

    const clusterCount = Math.floor(rng() * 2) + 3;
    const range = 1.85; 
    const zoneSize = range / clusterCount;
    
    let elementCounter = 0;

    for (let c = 0; c < clusterCount; c++) {
        const zoneTop = -(range/2) + (c * zoneSize);
        const latPos = zoneTop + (rng() * zoneSize * 0.8) + (zoneSize * 0.1);
        const yBase = latPos * R;
        const maxChord = Math.sqrt(Math.max(0, R*R - yBase*yBase)) * 2;
        const width = maxChord * (0.2 + rng() * 0.7);
        const maxOffset = (maxChord - width) / 2;
        const xOffset = (rng() * maxOffset * 2) - maxOffset;
        const dist = Math.abs(latPos);
        const col = artColor(data.cloudHex, dist * -15, dist * -5);

        const spine = generateCloudSpine(yBase, width, xOffset, R);
        
        // Generate Cloud System (Inline)
        const stackingDirection = yBase < 0 ? -1 : 1;
        const createStack = (spinePoints: {x:number, y:number}[], layers: number, scale: number) => {
            for (let i = 0; i <= layers; i++) {
                const lengthRatio = 1.0 - (i * 0.08); 
                const subLength = Math.floor(spinePoints.length * Math.max(0.4, lengthRatio));
                const slack = spinePoints.length - subLength;
                const startIdx = Math.floor(rng() * (slack * 0.8) + (slack * 0.1));
                const baseSubSpine = spinePoints.slice(startIdx, startIdx + subLength);
                const offsetDist = i * 14 * scale * stackingDirection; 
                const disjointX = (rng() - 0.5) * 20 * scale; 

                const offsetSubSpine = baseSubSpine.map((p, j, arr) => {
                    const p_next = arr[Math.min(arr.length-1, j+1)];
                    const p_prev = arr[Math.max(0, j-1)];
                    const dx = p_next.x - p_prev.x, dy = p_next.y - p_prev.y;
                    let nx = -dy, ny = dx;
                    const len = Math.sqrt(nx*nx+ny*ny);
                    if (len > 0) { nx /= len; ny /= len; }
                    return { x: p.x + (nx * offsetDist) + disjointX, y: p.y + (ny * offsetDist) };
                });

                const subPathData = generateCloudShapeFromSpine(offsetSubSpine, {
                    baseThickness: (35 - (i * 2)) * scale, 
                    edgeNoise: (12 + i) * scale,
                    taperPower: 0.5
                });

                if (subPathData) {
                    const lightShift = 40 - (i * 10); 
                    const subColor = artColor(col, lightShift, -5);
                    systemElements.push({
                        d: subPathData,
                        fill: subColor,
                        opacity: 0.6,
                        key: `cloud-${c}-${i}-${elementCounter++}`
                    });
                }
            }
        };

        const mainLayers = Math.floor(rng() * 4) + 4; 
        createStack(spine, mainLayers, 1.0);

        const goRight = rng() > 0.5;
        const attachPoint = goRight ? spine[spine.length - 1] : spine[0];
        const attachRelX = attachPoint.x - 500;
        const sidecarWidth = (rng() * 100) + 80;
        const overlap = 40; 
        const sidecarCenterOffset = goRight ? attachRelX + (sidecarWidth/2) - overlap : attachRelX - (sidecarWidth/2) + overlap;
        const sidecarSpine = generateCloudSpine(yBase, sidecarWidth, sidecarCenterOffset, R);
        const sidecarLayers = Math.floor(rng() * 3) + 2; 
        createStack(sidecarSpine, sidecarLayers, 0.75);
    }
    return systemElements;
}

// --- RINGS ---
export interface RingElement {
    d: string;
    stroke: string;
    width: number;
    opacity: number;
    front: boolean;
    key: string;
}

export function generateRingPaths(rng: () => number, data: PlanetData): RingElement[] {
    const elements: RingElement[] = [];

    if (rng() > 0.2) {
        // Simple Rings
        const ringBase = data.solid.color;
        for(let i=0; i<8; i++) {
            const r = 600 + i * 20;
            const ry = r * 0.25;
            const arc = (s: number, e: number) => {
                const rad=Math.PI/180;
                const sx=500+r*Math.cos(e*rad), sy=500+ry*Math.sin(e*rad);
                const ex=500+r*Math.cos(s*rad), ey=500+ry*Math.sin(s*rad);
                return `M ${sx} ${sy} A ${r} ${ry} 0 0 0 ${ex} ${ey}`;
            };
            const width = rng()*8+2;
            const opacity = rng() * 0.3 + 0.1;
            const color = artColor(ringBase, (i%2===0?20:-20), -10, 0);

            elements.push({ d: arc(180, 360), stroke: color, width, opacity, front: false, key: `s-back-${i}` });
            elements.push({ d: arc(0, 180), stroke: color, width, opacity, front: true, key: `s-front-${i}` });
        }
        return elements;
    }

    // Complex Rings
    const solidColor = data.solid.color;
    const iceColor = data.liquid.frozenColor || "#e0f2fe";
    const palette = [solidColor, iceColor, artColor(solidColor, 15, -10), artColor(iceColor, -15, 5)];
    const perspective = 0.25 + rng() * 0.15;
    const bands = [
        { start: 540, end: 650, density: 0.8, particles: 200 },
        { start: 670, end: 800, density: 0.5, particles: 200 },
        { start: 810, end: 825, density: 0.3, particles: 30 }
    ];

    const createArcPath = (radius: number, ry: number, startAngle: number, endAngle: number) => {
        const rad = Math.PI / 180;
        const sx = 500 + radius * Math.cos(endAngle * rad);
        const sy = 500 + ry * Math.sin(endAngle * rad);
        const ex = 500 + radius * Math.cos(startAngle * rad);
        const ey = 500 + ry * Math.sin(startAngle * rad);
        return `M ${sx} ${sy} A ${radius} ${ry} 0 0 0 ${ex} ${ey}`;
    };

    let pIdx = 0;
    bands.forEach(band => {
        for (let i = 0; i < band.particles; i++) {
            const progress = rng();
            const radius = band.start + progress * (band.end - band.start);
            const ry = radius * perspective;
            const wave = Math.sin(progress * Math.PI * (10 + rng() * 10));
            const baseOpacity = (band.density * 0.3) * (0.5 + rng() * 0.5);
            const finalOpacity = baseOpacity + wave * 0.1;
            
            if (finalOpacity < 0.04) continue;
            const color = palette[Math.floor(rng() * palette.length)];
            const width = 1 + rng() * 3.5;

            elements.push({ d: createArcPath(radius, ry, 180, 360), stroke: color, width, opacity: finalOpacity, front: false, key: `c-back-${pIdx}` });
            elements.push({ d: createArcPath(radius, ry, 0, 180), stroke: color, width, opacity: finalOpacity, front: true, key: `c-front-${pIdx}` });
            pIdx++;
        }
    });

    const specialFeatures = Math.floor(rng() * 3);
    for (let i = 0; i < specialFeatures; i++) {
        const randomBand = bands[Math.floor(rng() * bands.length)];
        const radius = randomBand.start + rng() * (randomBand.end - randomBand.start);
        const ry = radius * perspective;
        const color = artColor(palette[1], 40, 10);
        const width = 2 + rng() * 2;
        const opacity = 0.7 + rng() * 0.2;
        
        elements.push({ d: createArcPath(radius, ry, 180, 360), stroke: color, width, opacity, front: false, key: `spec-back-${i}` });
        elements.push({ d: createArcPath(radius, ry, 0, 180), stroke: color, width, opacity, front: true, key: `spec-front-${i}` });
    }

    return elements;
}

// --- GEOLOGY ---
export function generateGeologyPaths(rng: () => number, data: PlanetData): string[] {
    const paths = [];
    if (data.roughness > 0.5) {
        const count = Math.ceil(8 * data.roughness);
        for (let i = 0; i < count; i++) {
            const lat1 = rng()*2-1; const lon1 = rng()*6.28;
            const lat2 = rng()*2-1; const lon2 = lon1 + rng();
            let d = "";
            for(let t=0; t<=12; t++) {
                const step = t/12;
                const lat = lat1+(lat2-lat1)*step;
                const lon = lon1+(lon2-lon1)*step;
                
                // Project Sphere Inline
                const r = 450;
                let x = r * Math.cos(lat) * Math.sin(lon);
                let y = r * Math.sin(lat);
                let z = r * Math.cos(lat) * Math.cos(lon);
                let rad = data.tilt * (Math.PI/180);
                let xT = x * Math.cos(rad) - y * Math.sin(rad);
                let yT = x * Math.sin(rad) + y * Math.cos(rad);
                
                if(z > -100) d += (t===0?"M":"L") + ` ${(xT + 500)} ${(-yT + 500)}`;
            }
            if(d) paths.push(d);
        }
    }
    return paths;
}

export function generateLayerThresholds(solidType: string, roughness: number, count: number) {
    let stops = [0];
    let current = 0;
    let gapBase = 0.05;
    if (solidType === 'crystal') gapBase = 0.03;
    if (roughness < 0.6) gapBase = 0.08;
    const multiplier = 1.08; 

    for(let i=1; i<count; i++) {
        current += gapBase;
        stops.push(current);
        gapBase *= multiplier;
    }
    const maxVal = stops[stops.length-1];
    return stops.map(v => 0.08 + (v / maxVal) * 0.75);
}
