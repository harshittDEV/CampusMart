import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Polygon,
  G,
  Ellipse,
} from 'react-native-svg';
import { Colors } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCENE_SIZE = Math.min(SCREEN_WIDTH - 40, 360);

interface Campus3DSceneProps {
  onAnimationComplete?: () => void;
}

export const Campus3DScene: React.FC<Campus3DSceneProps> = ({
  onAnimationComplete,
}) => {
  // Animation drivers
  const stageOpacity = useRef(new Animated.Value(0)).current;
  const stageScale = useRef(new Animated.Value(0.9)).current;

  // Building arrival
  const buildingY = useRef(new Animated.Value(-280)).current;
  const buildingRotateX = useRef(new Animated.Value(15)).current;
  const buildingShadowScale = useRef(new Animated.Value(0.3)).current;
  const buildingShadowOpacity = useRef(new Animated.Value(0)).current;

  // Graduation Cap arrival
  const capY = useRef(new Animated.Value(-200)).current;
  const capRotate = useRef(new Animated.Value(-24)).current;
  const capScale = useRef(new Animated.Value(0.7)).current;
  const capOpacity = useRef(new Animated.Value(0)).current;
  const capShadowOpacity = useRef(new Animated.Value(0)).current;

  // Gentle idle float for cap after landing
  const idleFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Coordinated multi-stage animation sequence
    const animSequence = Animated.sequence([
      // Scene 1: Stage appearance (0.0 - 0.3s)
      Animated.parallel([
        Animated.timing(stageOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(stageScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Scene 2: 3D Campus Building descends and settles with subtle bounce (0.3 - 1.4s)
      Animated.parallel([
        Animated.spring(buildingY, {
          toValue: 0,
          friction: 6,
          tension: 28,
          useNativeDriver: true,
        }),
        Animated.timing(buildingRotateX, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(buildingShadowScale, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(buildingShadowOpacity, {
          toValue: 0.8,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),

      // Scene 3: 3D Graduation Cap descends, rotates, and settles above campus (1.2 - 2.1s)
      Animated.parallel([
        Animated.timing(capOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(capY, {
          toValue: 0,
          friction: 5,
          tension: 30,
          useNativeDriver: true,
        }),
        Animated.spring(capRotate, {
          toValue: 0,
          friction: 6,
          tension: 25,
          useNativeDriver: true,
        }),
        Animated.spring(capScale, {
          toValue: 1,
          friction: 6,
          tension: 35,
          useNativeDriver: true,
        }),
        Animated.timing(capShadowOpacity, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animSequence.start(({ finished }) => {
      if (finished) {
        onAnimationComplete?.();

        // Subtle ambient idle breathing (stops when unmounted)
        Animated.loop(
          Animated.sequence([
            Animated.timing(idleFloat, {
              toValue: -3,
              duration: 1800,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(idleFloat, {
              toValue: 0,
              duration: 1800,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });

    return () => {
      animSequence.stop();
    };
  }, []);

  const capRotationInterpolate = capRotate.interpolate({
    inputRange: [-24, 0],
    outputRange: ['-24deg', '0deg'],
  });

  const buildingTiltInterpolate = buildingRotateX.interpolate({
    inputRange: [0, 15],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <View style={[styles.container, { width: SCENE_SIZE, height: SCENE_SIZE }]}>
      {/* ── 1. Pedestal & Contact Shadows ───────────────────────── */}
      <Animated.View
        style={[
          styles.pedestalLayer,
          {
            opacity: stageOpacity,
            transform: [{ scale: stageScale }],
          },
        ]}
      >
        <Svg width={SCENE_SIZE} height={SCENE_SIZE} viewBox="0 0 340 340">
          <Defs>
            {/* Soft ground ambient occlusion */}
            <RadialGradient id="groundShadow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.18" />
              <Stop offset="65%" stopColor="#4F46E5" stopOpacity="0.06" />
              <Stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </RadialGradient>

            {/* Pedestal Top Gradient */}
            <LinearGradient id="pedestalTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="50%" stopColor="#F8FAFC" />
              <Stop offset="100%" stopColor="#EEF2FF" />
            </LinearGradient>

            {/* Pedestal Rim Gradient */}
            <LinearGradient id="pedestalRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CBD5E1" />
              <Stop offset="100%" stopColor="#94A3B8" />
            </LinearGradient>
          </Defs>

          {/* Deep ambient shadow on floor */}
          <Ellipse cx="170" cy="275" rx="145" ry="36" fill="url(#groundShadow)" />

          {/* 3D Pedestal Stage Cylinder Edge */}
          <Path
            d="M 35 250 A 135 34 0 0 0 305 250 L 305 264 A 135 34 0 0 1 35 264 Z"
            fill="url(#pedestalRim)"
          />

          {/* 3D Pedestal Top Surface */}
          <Ellipse
            cx="170"
            cy="250"
            rx="135"
            ry="34"
            fill="url(#pedestalTop)"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* Concentric campus plaza ring */}
          <Ellipse
            cx="170"
            cy="250"
            rx="115"
            ry="28"
            fill="none"
            stroke="#818CF8"
            strokeWidth="1"
            strokeDasharray="4,4"
            strokeOpacity="0.4"
          />
        </Svg>
      </Animated.View>

      {/* ── Dynamic Building Contact Shadow ─────────────────────── */}
      <Animated.View
        style={[
          styles.buildingShadow,
          {
            opacity: buildingShadowOpacity,
            transform: [{ scale: buildingShadowScale }],
          },
        ]}
      >
        <Svg width={240} height={50} viewBox="0 0 240 50">
          <Defs>
            <RadialGradient id="buildingContact" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.32" />
              <Stop offset="70%" stopColor="#1E1B4B" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="120" cy="25" rx="110" ry="20" fill="url(#buildingContact)" />
        </Svg>
      </Animated.View>

      {/* ── 2. The 3D Campus Building ───────────────────────────── */}
      <Animated.View
        style={[
          styles.buildingLayer,
          {
            transform: [
              { translateY: buildingY },
              { perspective: 800 },
              { rotateX: buildingTiltInterpolate },
            ],
          },
        ]}
      >
        <Svg width={260} height={200} viewBox="0 0 260 200">
          <Defs>
            {/* Facade Daylit Gradients */}
            <LinearGradient id="frontWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="60%" stopColor="#F8FAFC" />
              <Stop offset="100%" stopColor="#E2E8F0" />
            </LinearGradient>

            {/* Wing Side Extrusion (Shadowed 3D Depth) */}
            <LinearGradient id="sideWall" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#94A3B8" />
              <Stop offset="100%" stopColor="#64748B" />
            </LinearGradient>

            {/* University Roof Gradient (Refined Indigo/Slate Tile) */}
            <LinearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4F46E5" />
              <Stop offset="60%" stopColor="#4338CA" />
              <Stop offset="100%" stopColor="#312E81" />
            </LinearGradient>

            {/* Portico Pediment */}
            <LinearGradient id="pedimentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#EEF2FF" />
              <Stop offset="100%" stopColor="#CBD5E1" />
            </LinearGradient>

            {/* Classical Columns (3D Cylinder lighting) */}
            <LinearGradient id="columnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="45%" stopColor="#F1F5F9" />
              <Stop offset="80%" stopColor="#CBD5E1" />
              <Stop offset="100%" stopColor="#94A3B8" />
            </LinearGradient>

            {/* Window Glass Reflection */}
            <LinearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="30%" stopColor="#0284C7" />
              <Stop offset="100%" stopColor="#0F172A" />
            </LinearGradient>

            {/* Arched Entrance Glow */}
            <RadialGradient id="portalGlow" cx="50%" cy="80%" rx="50%" ry="60%">
              <Stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
              <Stop offset="50%" stopColor="#D97706" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.95" />
            </RadialGradient>

            {/* Dome Copper/Gold Trim */}
            <LinearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6366F1" />
              <Stop offset="50%" stopColor="#4F46E5" />
              <Stop offset="100%" stopColor="#3730A3" />
            </LinearGradient>
          </Defs>

          {/* ── West Wing (Left) ── */}
          {/* West Wing Roof */}
          <Polygon points="14,92 84,92 84,72 26,72" fill="url(#roofGradient)" />
          {/* West Wing Left Shaded Edge */}
          <Polygon points="14,92 26,72 26,160 14,160" fill="url(#sideWall)" />
          {/* West Wing Front Facade */}
          <Rect x="26" y="72" width="60" height="88" fill="url(#frontWall)" />
          <LineSeparator x1="26" y1="160" x2="86" y2="160" color="#94A3B8" />

          {/* West Wing Windows (6 panes) */}
          <G fill="url(#windowGlass)">
            {/* Top row */}
            <Rect x="34" y="84" width="12" height="18" rx="2" />
            <Rect x="52" y="84" width="12" height="18" rx="2" />
            <Rect x="70" y="84" width="12" height="18" rx="2" />
            {/* Middle row */}
            <Rect x="34" y="112" width="12" height="18" rx="2" />
            <Rect x="52" y="112" width="12" height="18" rx="2" />
            <Rect x="70" y="112" width="12" height="18" rx="2" />
          </G>

          {/* ── East Wing (Right) ── */}
          {/* East Wing Roof */}
          <Polygon points="176,92 246,92 234,72 176,72" fill="url(#roofGradient)" />
          {/* East Wing Right Shaded Edge */}
          <Polygon points="246,92 234,72 234,160 246,160" fill="url(#sideWall)" />
          {/* East Wing Front Facade */}
          <Rect x="174" y="72" width="60" height="88" fill="url(#frontWall)" />

          {/* East Wing Windows (6 panes) */}
          <G fill="url(#windowGlass)">
            {/* Top row */}
            <Rect x="180" y="84" width="12" height="18" rx="2" />
            <Rect x="198" y="84" width="12" height="18" rx="2" />
            <Rect x="216" y="84" width="12" height="18" rx="2" />
            {/* Middle row */}
            <Rect x="180" y="112" width="12" height="18" rx="2" />
            <Rect x="198" y="112" width="12" height="18" rx="2" />
            <Rect x="216" y="112" width="12" height="18" rx="2" />
          </G>

          {/* ── Central Grand Rotunda & Portico ── */}
          {/* Central Dome Tower Base */}
          <Rect x="108" y="24" width="44" height="26" fill="url(#frontWall)" />
          {/* Central Dome / Cupola */}
          <Path
            d="M 112 24 C 112 8, 148 8, 148 24 Z"
            fill="url(#domeGrad)"
          />
          {/* Spire / Needle */}
          <Polygon points="129,2 131,2 131,8 129,8" fill="#F59E0B" />
          <Circle cx="130" cy="2" r="2" fill="#F59E0B" />

          {/* Central Main Building Body */}
          <Rect x="82" y="50" width="96" height="110" fill="url(#frontWall)" />

          {/* Classical Triangular Pediment Roof */}
          <Polygon points="76,52 130,16 184,52" fill="url(#pedimentGrad)" stroke="#CBD5E1" strokeWidth="1" />
          {/* Pediment Cornice Trim */}
          <Rect x="74" y="50" width="112" height="5" fill="#4F46E5" />

          {/* University Clock / Golden Emblem in Pediment */}
          <Circle cx="130" cy="38" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <Path d="M 130 34 L 130 38 L 133 39" stroke="#1E1B4B" strokeWidth="1.2" strokeLinecap="round" />

          {/* Entablature Header */}
          <Rect x="86" y="66" width="88" height="6" fill="#EEF2FF" stroke="#CBD5E1" strokeWidth="0.8" />

          {/* 4 Classical 3D Columns */}
          <G fill="url(#columnGrad)">
            {/* Column 1 */}
            <Rect x="90" y="72" width="8" height="66" rx="1" />
            <Rect x="88" y="70" width="12" height="3" rx="0.5" fill="#CBD5E1" />
            <Rect x="88" y="137" width="12" height="3" rx="0.5" fill="#94A3B8" />

            {/* Column 2 */}
            <Rect x="110" y="72" width="8" height="66" rx="1" />
            <Rect x="108" y="70" width="12" height="3" rx="0.5" fill="#CBD5E1" />
            <Rect x="108" y="137" width="12" height="3" rx="0.5" fill="#94A3B8" />

            {/* Column 3 */}
            <Rect x="142" y="72" width="8" height="66" rx="1" />
            <Rect x="140" y="70" width="12" height="3" rx="0.5" fill="#CBD5E1" />
            <Rect x="140" y="137" width="12" height="3" rx="0.5" fill="#94A3B8" />

            {/* Column 4 */}
            <Rect x="162" y="72" width="8" height="66" rx="1" />
            <Rect x="160" y="70" width="12" height="3" rx="0.5" fill="#CBD5E1" />
            <Rect x="160" y="137" width="12" height="3" rx="0.5" fill="#94A3B8" />
          </G>

          {/* Central Arched Portal / Entrance */}
          <Path
            d="M 121 140 L 121 98 A 9 9 0 0 1 139 98 L 139 140 Z"
            fill="url(#portalGlow)"
          />
          {/* Double Door Trim */}
          <Rect x="123" y="104" width="6.5" height="36" fill="#1E1B4B" opacity="0.6" />
          <Rect x="130.5" y="104" width="6.5" height="36" fill="#1E1B4B" opacity="0.75" />

          {/* Tiered Grand Entrance Steps (3D Steps extending forward) */}
          {/* Step 1 (Top) */}
          <Polygon points="84,140 176,140 180,146 80,146" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.8" />
          <Polygon points="176,140 180,146 180,150 176,144" fill="#94A3B8" />
          {/* Step 2 (Middle) */}
          <Polygon points="80,146 180,146 184,152 76,152" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
          <Polygon points="180,146 184,152 184,156 180,150" fill="#94A3B8" />
          {/* Step 3 (Ground) */}
          <Polygon points="76,152 184,152 188,158 72,158" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          <Polygon points="184,152 188,158 188,162 184,156" fill="#64748B" />
        </Svg>
      </Animated.View>

      {/* ── 3. The 3D Graduation Cap Layer ─────────────────────── */}
      <Animated.View
        style={[
          styles.capLayer,
          {
            opacity: capOpacity,
            transform: [
              { translateY: Animated.add(capY, idleFloat) },
              { scale: capScale },
              { perspective: 600 },
              { rotateZ: capRotationInterpolate },
            ],
          },
        ]}
      >
        {/* Soft shadow cast by Cap on roof */}
        <Animated.View
          style={[
            styles.capShadow,
            {
              opacity: capShadowOpacity,
            },
          ]}
        >
          <Svg width={110} height={30} viewBox="0 0 110 30">
            <Ellipse cx="55" cy="15" rx="42" ry="10" fill="#0F172A" opacity={0.28} />
          </Svg>
        </Animated.View>

        {/* 3D Mortarboard Vector Illustration */}
        <Svg width={130} height={90} viewBox="0 0 130 90">
          <Defs>
            {/* Top Mortarboard Face (Deep Velvet Brand Indigo) */}
            <LinearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4338CA" />
              <Stop offset="50%" stopColor="#312E81" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </LinearGradient>

            {/* Mortarboard Edge / Rim (3D Thickness) */}
            <LinearGradient id="capRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="50%" stopColor="#0F172A" />
              <Stop offset="100%" stopColor="#020617" />
            </LinearGradient>

            {/* Skull Cap Base */}
            <LinearGradient id="skullCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#312E81" />
              <Stop offset="100%" stopColor="#0F172A" />
            </LinearGradient>

            {/* Golden Silk Tassel */}
            <LinearGradient id="tasselGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDE68A" />
              <Stop offset="40%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </LinearGradient>
          </Defs>

          {/* Skull Cap volume under the board */}
          <Path
            d="M 44 38 Q 65 62 86 38 Z"
            fill="url(#skullCapGrad)"
          />

          {/* 3D Mortarboard Thickness / Underside Rim */}
          <Polygon
            points="65,16 122,34 122,39 65,22"
            fill="#0F172A"
          />
          <Polygon
            points="8,34 65,16 65,22 8,39"
            fill="#1E1B4B"
          />
          <Polygon
            points="8,39 65,56 122,39 122,44 65,61 8,44"
            fill="url(#capRim)"
          />

          {/* Mortarboard Diamond Top Surface */}
          <Polygon
            points="65,14 122,34 65,54 8,34"
            fill="url(#capTop)"
            stroke="#6366F1"
            strokeWidth="0.8"
          />

          {/* Center Button Stud */}
          <Circle cx="65" cy="34" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

          {/* Golden Ribbon Tassel draped over edge */}
          {/* Tassel cord from center to rim */}
          <Path
            d="M 65 34 Q 85 36 94 40"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Tassel drop ribbon */}
          <Path
            d="M 94 40 Q 98 48 97 58 Q 96 64 97 68"
            fill="none"
            stroke="url(#tasselGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Tassel fringe bell / brush */}
          <Polygon
            points="95,66 99,66 101,77 93,77"
            fill="url(#tasselGrad)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const LineSeparator: React.FC<{ x1: string; y1: string; x2: string; y2: string; color: string }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
}) => (
  <Path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={color} strokeWidth="1" />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pedestalLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingShadow: {
    position: 'absolute',
    bottom: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingLayer: {
    position: 'absolute',
    bottom: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capLayer: {
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  capShadow: {
    position: 'absolute',
    top: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
