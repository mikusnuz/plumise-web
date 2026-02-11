import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeData {
  position: THREE.Vector3;
  baseRadius: number;
  phaseOffset: number;
  activityCycle: number;
  color: THREE.Color;
}

interface EdgeData {
  from: number;
  to: number;
  strength: number;
}

interface ParticleData {
  edgeIndex: number;
  t: number;
  speed: number;
  size: number;
}

// ---------------------------------------------------------------------------
// Constants (reduced for performance)
// ---------------------------------------------------------------------------

const NODE_COUNT = 50;
const EDGE_MAX_DIST = 4.5;
const PARTICLE_COUNT = 70;
const PURPLE_PRIMARY = new THREE.Color("#8B5CF6");
const PURPLE_LIGHT = new THREE.Color("#A78BFA");
const CYAN_PRIMARY = new THREE.Color("#06B6D4");
const CYAN_LIGHT = new THREE.Color("#22D3EE");
const DARK_BG = new THREE.Color("#030712");

// ---------------------------------------------------------------------------
// Utility: seeded random for deterministic layout
// ---------------------------------------------------------------------------

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// ---------------------------------------------------------------------------
// Topology generation
// ---------------------------------------------------------------------------

const generateNetwork = () => {
  const rng = seededRandom(42);

  const nodes: NodeData[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = 2.5 + rng() * 4.5;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    const z = r * Math.cos(phi);

    const isPurple = rng() > 0.35;
    const color = isPurple
      ? new THREE.Color().lerpColors(PURPLE_PRIMARY, PURPLE_LIGHT, rng())
      : new THREE.Color().lerpColors(CYAN_PRIMARY, CYAN_LIGHT, rng());

    nodes.push({
      position: new THREE.Vector3(x, y, z),
      baseRadius: 0.05 + rng() * 0.09,
      phaseOffset: rng() * Math.PI * 2,
      activityCycle: 3 + rng() * 7,
      color,
    });
  }

  const edges: EdgeData[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if (dist < EDGE_MAX_DIST) {
        const strength = 1.0 - dist / EDGE_MAX_DIST;
        edges.push({ from: i, to: j, strength });
      }
    }
  }

  const particles: ParticleData[] = [];
  if (edges.length > 0) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        edgeIndex: Math.floor(rng() * edges.length),
        t: rng(),
        speed: 0.08 + rng() * 0.18,
        size: 0.02 + rng() * 0.03,
      });
    }
  }

  return { nodes, edges, particles };
};

// ---------------------------------------------------------------------------
// Custom shaders
// ---------------------------------------------------------------------------

const nodeVertexShader = /* glsl */ `
  attribute float aRadius;
  attribute vec3 aColor;
  attribute float aActivity;

  varying vec3 vColor;
  varying float vActivity;

  void main() {
    vColor = aColor;
    vActivity = aActivity;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position * aRadius, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const nodeFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vActivity;

  void main() {
    float intensity = 0.8 + vActivity * 1.0;
    vec3 glow = vColor * intensity;
    gl_FragColor = vec4(glow, 1.0);
  }
`;

const edgeVertexShader = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aEnd;
  attribute float aStrength;
  attribute float aPulse;

  varying float vStrength;
  varying float vPulse;
  varying float vT;

  void main() {
    vStrength = aStrength;
    vPulse = aPulse;
    vT = position.x;

    vec3 pos = mix(aStart, aEnd, position.x);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 1.5;
  }
`;

const edgeFragmentShader = /* glsl */ `
  varying float vStrength;
  varying float vPulse;
  varying float vT;

  void main() {
    float alpha = vStrength * (0.25 + vPulse * 0.45);
    float edgeFade = smoothstep(0.0, 0.1, vT) * smoothstep(1.0, 0.9, vT);
    alpha *= edgeFade;

    vec3 purple = vec3(0.545, 0.361, 0.965);
    vec3 cyan = vec3(0.024, 0.714, 0.831);
    vec3 color = mix(purple, cyan, vT * 0.5 + vPulse * 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Component: Instanced Nodes
// ---------------------------------------------------------------------------

const SPHERE_GEO = new THREE.IcosahedronGeometry(1, 1);

const NetworkNodes = ({
  nodes,
  mouseRef,
}: {
  nodes: NodeData[];
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { radii, colors } = useMemo(() => {
    const r = new Float32Array(NODE_COUNT);
    const c = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((n, i) => {
      r[i] = n.baseRadius;
      c[i * 3] = n.color.r;
      c[i * 3 + 1] = n.color.g;
      c[i * 3 + 2] = n.color.b;
    });
    return { radii: r, colors: c };
  }, [nodes]);

  const activityArr = useMemo(() => new Float32Array(NODE_COUNT), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x * 0.3;
    const my = mouseRef.current.y * 0.3;

    for (let i = 0; i < NODE_COUNT; i++) {
      const node = nodes[i];
      const activity =
        0.5 +
        0.5 * Math.sin(t / node.activityCycle + node.phaseOffset);
      activityArr[i] = activity;

      const scale = node.baseRadius * (0.8 + activity * 0.6);

      dummy.position.copy(node.position);
      dummy.position.x += mx * 0.15;
      dummy.position.y += my * 0.15;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;

    const geo = mesh.geometry;
    const activityAttr = geo.getAttribute("aActivity");
    if (activityAttr) {
      (activityAttr as THREE.BufferAttribute).set(activityArr);
      activityAttr.needsUpdate = true;
    }
  });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const geo = mesh.geometry;
    geo.setAttribute("aRadius", new THREE.InstancedBufferAttribute(radii, 1));
    geo.setAttribute(
      "aColor",
      new THREE.InstancedBufferAttribute(colors, 3)
    );
    geo.setAttribute(
      "aActivity",
      new THREE.InstancedBufferAttribute(activityArr, 1)
    );

    for (let i = 0; i < NODE_COUNT; i++) {
      dummy.position.copy(nodes[i].position);
      dummy.scale.setScalar(nodes[i].baseRadius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes, radii, colors, activityArr, dummy]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodeVertexShader,
        fragmentShader: nodeFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[SPHERE_GEO, material, NODE_COUNT]}
      frustumCulled={false}
    />
  );
};

// ---------------------------------------------------------------------------
// Component: Edge connections as Points along lines
// ---------------------------------------------------------------------------

const EDGE_SEGMENTS = 8;

const NetworkEdges = ({
  nodes,
  edges,
  mouseRef,
}: {
  nodes: NodeData[];
  edges: EdgeData[];
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, startArr, endArr, pulseArr } = useMemo(() => {
    const count = edges.length * EDGE_SEGMENTS;
    const positions = new Float32Array(count * 3);
    const starts = new Float32Array(count * 3);
    const ends = new Float32Array(count * 3);
    const strengths = new Float32Array(count);
    const pulses = new Float32Array(count);

    let idx = 0;
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      const fromPos = nodes[edge.from].position;
      const toPos = nodes[edge.to].position;

      for (let s = 0; s < EDGE_SEGMENTS; s++) {
        const t = s / (EDGE_SEGMENTS - 1);

        positions[idx * 3] = t;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = 0;

        starts[idx * 3] = fromPos.x;
        starts[idx * 3 + 1] = fromPos.y;
        starts[idx * 3 + 2] = fromPos.z;

        ends[idx * 3] = toPos.x;
        ends[idx * 3 + 1] = toPos.y;
        ends[idx * 3 + 2] = toPos.z;

        strengths[idx] = edge.strength;
        pulses[idx] = 0;
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
    geo.setAttribute("aEnd", new THREE.BufferAttribute(ends, 3));
    geo.setAttribute("aStrength", new THREE.BufferAttribute(strengths, 1));
    geo.setAttribute("aPulse", new THREE.BufferAttribute(pulses, 1));

    return {
      geometry: geo,
      startArr: starts,
      endArr: ends,
      pulseArr: pulses,
    };
  }, [nodes, edges]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x * 0.3;
    const my = mouseRef.current.y * 0.3;

    let idx = 0;
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      const fromPos = nodes[edge.from].position;
      const toPos = nodes[edge.to].position;

      const pulse =
        0.5 +
        0.5 * Math.sin(t * 1.5 + e * 0.3);

      for (let s = 0; s < EDGE_SEGMENTS; s++) {
        startArr[idx * 3] = fromPos.x + mx * 0.15;
        startArr[idx * 3 + 1] = fromPos.y + my * 0.15;
        startArr[idx * 3 + 2] = fromPos.z;

        endArr[idx * 3] = toPos.x + mx * 0.15;
        endArr[idx * 3 + 1] = toPos.y + my * 0.15;
        endArr[idx * 3 + 2] = toPos.z;

        pulseArr[idx] = pulse;
        idx++;
      }
    }

    const geo = pointsRef.current?.geometry;
    if (geo) {
      geo.attributes.aStart.needsUpdate = true;
      geo.attributes.aEnd.needsUpdate = true;
      geo.attributes.aPulse.needsUpdate = true;
    }
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

// ---------------------------------------------------------------------------
// Component: Flowing particles along edges
// ---------------------------------------------------------------------------

const FlowingParticles = ({
  nodes,
  edges,
  particles,
  mouseRef,
}: {
  nodes: NodeData[];
  edges: EdgeData[];
  particles: ParticleData[];
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, posArr, colorArr, sizeArr } = useMemo(() => {
    const count = particles.length;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    return { geometry: geo, posArr: pos, colorArr: col, sizeArr: sizes };
  }, [particles.length]);

  const particlesState = useRef(
    particles.map((p) => ({ ...p }))
  );

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const mx = mouseRef.current.x * 0.3;
    const my = mouseRef.current.y * 0.3;
    const state = particlesState.current;

    for (let i = 0; i < state.length; i++) {
      const p = state[i];
      p.t += p.speed * delta;
      if (p.t > 1) {
        p.t -= 1;
        p.edgeIndex = Math.floor(Math.random() * edges.length);
      }

      const edge = edges[p.edgeIndex];
      if (!edge) continue;

      const fromPos = nodes[edge.from].position;
      const toPos = nodes[edge.to].position;

      const px = fromPos.x + (toPos.x - fromPos.x) * p.t + mx * 0.15;
      const py = fromPos.y + (toPos.y - fromPos.y) * p.t + my * 0.15;
      const pz = fromPos.z + (toPos.z - fromPos.z) * p.t;

      posArr[i * 3] = px;
      posArr[i * 3 + 1] = py;
      posArr[i * 3 + 2] = pz;

      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + i);
      const isPurple = i % 3 !== 0;
      if (isPurple) {
        colorArr[i * 3] = 0.67 * (0.7 + pulse * 0.3);
        colorArr[i * 3 + 1] = 0.55 * (0.7 + pulse * 0.3);
        colorArr[i * 3 + 2] = 0.98;
      } else {
        colorArr[i * 3] = 0.13;
        colorArr[i * 3 + 1] = 0.83 * (0.7 + pulse * 0.3);
        colorArr[i * 3 + 2] = 0.93;
      }

      sizeArr[i] = p.size * (0.5 + pulse * 0.5);
    }

    const geo = pointsRef.current?.geometry;
    if (geo) {
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aColor.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;
    }
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          attribute vec3 aColor;
          attribute float aSize;
          varying vec3 vColor;
          void main() {
            vColor = aColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            float alpha = 1.0 - smoothstep(0.0, 1.0, d);
            alpha = pow(alpha, 1.5) * 0.9;
            gl_FragColor = vec4(vColor * 1.5, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

// ---------------------------------------------------------------------------
// Component: Scene container with rotation and parallax
// ---------------------------------------------------------------------------

const SceneContent = ({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const network = useMemo(() => generateNetwork(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.rotation.y = t * 0.04 + mouseRef.current.x * 0.08;
    groupRef.current.rotation.x =
      Math.sin(t * 0.02) * 0.05 + mouseRef.current.y * 0.05;
  });

  return (
    <>
      <color attach="background" args={[DARK_BG]} />
      <fog attach="fog" args={["#030712", 12, 28]} />

      <ambientLight intensity={0.25} />
      <pointLight
        position={[5, 5, 5]}
        intensity={0.7}
        color="#8B5CF6"
      />
      <pointLight
        position={[-5, -3, 3]}
        intensity={0.5}
        color="#06B6D4"
      />

      <group ref={groupRef}>
        <NetworkNodes nodes={network.nodes} mouseRef={mouseRef} />
        <NetworkEdges
          nodes={network.nodes}
          edges={network.edges}
          mouseRef={mouseRef}
        />
        <FlowingParticles
          nodes={network.nodes}
          edges={network.edges}
          particles={network.particles}
          mouseRef={mouseRef}
        />
      </group>

      <Stars
        radius={15}
        depth={30}
        count={400}
        factor={2}
        saturation={0.2}
        fade
        speed={0.3}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Component: Mouse tracker (outside Canvas)
// ---------------------------------------------------------------------------

const useMousePosition = () => {
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return mouseRef;
};

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

const NeuralNetwork = () => {
  const mouseRef = useMousePosition();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 60,
          near: 0.1,
          far: 50,
        }}
        dpr={1}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ background: "#030712" }}
      >
        <SceneContent mouseRef={mouseRef} />
      </Canvas>

      {/* Gradient overlay: fade edges to transparent for seamless integration */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, #030712 100%)",
        }}
      />

      {/* Bottom fade for content below */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, transparent, #030712)",
        }}
      />
    </div>
  );
};

export default NeuralNetwork;
