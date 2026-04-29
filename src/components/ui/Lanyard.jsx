/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import {
  MeshLineGeometry,
  MeshLineMaterial,
} from 'meshline';

import lanyard from '../../assets/lanyard/lanyard.png';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

/*
Clean reverted version:
- No ghost cursor
- No double click logic
- No LinkedIn interaction inside cards
- Pure draggable lanyard cards only

LinkedIn buttons are now handled in Leadership.jsx
*/

function Band({
  maxSpeed = 10,
  minSpeed = 0,
  isMobile = false,
  glbPath,
  xOffset = 0,
  yOffset = 0,
  segmentLength = 1.8,
  anchorHeight = 7,
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(glbPath);

  useEffect(() => {
    if (materials) {
      Object.values(materials).forEach((mat) => {
        if (mat.map) {
          mat.map.anisotropy = 16;
          mat.map.minFilter = THREE.LinearFilter;
          mat.map.magFilter = THREE.LinearFilter;
          mat.map.generateMipmaps = false;
          mat.map.needsUpdate = true;
        }
      });
    }
  }, [materials]);

  const texture = useTexture(lanyard);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  const activeSegmentLength = isMobile ? 1.0 : segmentLength;

  useRopeJoint(
    fixed,
    j1,
    [[0, 0, 0], [0, 0, 0], activeSegmentLength]
  );

  useRopeJoint(
    j1,
    j2,
    [[0, 0, 0], [0, 0, 0], activeSegmentLength]
  );

  useRopeJoint(
    j2,
    j3,
    [[0, 0, 0], [0, 0, 0], activeSegmentLength]
  );

  useSphericalJoint(
    j3,
    card,
    [
      [0, 0, 0],
      [0, 2.4, 0],
    ]
  );

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';

      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec
        .set(state.pointer.x, state.pointer.y, 0.5)
        .unproject(state.camera);

      dir
        .copy(vec)
        .sub(state.camera.position)
        .normalize();

      vec.add(
        dir.multiplyScalar(state.camera.position.length())
      );

      [card, j1, j2, j3, fixed].forEach((ref) =>
        ref.current?.wakeUp()
      );

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(
            1,
            ref.current.lerped.distanceTo(
              ref.current.translation()
            )
          )
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta *
            (
              minSpeed +
              clampedDistance *
                (maxSpeed - minSpeed)
            )
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      band.current.geometry.setPoints(
        curve.getPoints(isMobile ? 16 : 32)
      );

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group
        position={[
          xOffset,
          anchorHeight + yOffset,
          0,
        ]}
      >
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type="fixed"
        />

        <RigidBody
          position={[0, -activeSegmentLength, 0]}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -activeSegmentLength * 2, 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -activeSegmentLength * 3, 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -activeSegmentLength * 3, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? 'kinematicPosition'
              : 'dynamic'
          }
        >
          <CuboidCollider args={[4.18, 2.125, 0.01]} />

          <group
            scale={5.25}
            position={[0, -3.9, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.target.setPointerCapture(e.pointerId);

              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(
                    vec.copy(
                      card.current.translation()
                    )
                  )
              );
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.target.releasePointerCapture(
                e.pointerId
              );
              drag(false);
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              {isMobile ? (
                <meshStandardMaterial
                  map={
                    nodes.card.material.map ||
                    materials.base?.map
                  }
                  roughness={0.8}
                  metalness={0}
                />
              ) : (
                <primitive
                  object={
                    nodes.card.material ||
                    materials.base
                  }
                  attach="material"
                />
              )}
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
            />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={
            isMobile
              ? [600, 1000]
              : [1000, 1000]
          }
          useMap
          map={texture}
          repeat={[-2, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

const CARD_SPACING = 5;

export default function LanyardScene({
  members = [],
}) {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );
  }, []);

  const totalWidth =
    (members.length - 1) * CARD_SPACING;

  const startX = -totalWidth / 2;

  return (
    <div className="relative z-0 w-full h-[2400px] md:h-[800px]">
      <Canvas
        camera={{
          position: [
            0,
            0,
            isMobile ? 200 : 50,
          ],
          fov: 20,
        }}
        dpr={[
          1,
          isMobile ? 1 : 2,
        ]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference:
            'high-performance',
          precision: 'highp',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(
            new THREE.Color(0x000000),
            0
          );

          gl.setPixelRatio(
            window.devicePixelRatio
          );
        }}
      >
        <ambientLight intensity={Math.PI} />

        <Physics
          gravity={[0, -40, 0]}
          timeStep={
            isMobile
              ? 1 / 30
              : 1 / 60
          }
        >
          <Suspense fallback={null}>
            {members.map((member, i) => {
              const mobileY =
                28 - i * 11.5;

              return (
                <Band
                  key={member.name}
                  glbPath={member.model}
                  xOffset={
                    isMobile
                      ? 0
                      : startX +
                        i * CARD_SPACING
                  }
                  anchorHeight={
                    isMobile
                      ? mobileY
                      : member.anchorHeight || 7
                  }
                  yOffset={
                    isMobile
                      ? 0
                      : member.yOffset || 0
                  }
                  segmentLength={
                    member.segmentLength || 1.8
                  }
                  isMobile={isMobile}
                />
              );
            })}
          </Suspense>
        </Physics>

        <Environment blur={0.75}>
          <Lightformer
            intensity={0}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={0}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={0}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />

          <Lightformer
            intensity={0}
            color="white"
            position={[-10, 0, 14]}
            rotation={[
              0,
              Math.PI / 2,
              Math.PI / 3,
            ]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}