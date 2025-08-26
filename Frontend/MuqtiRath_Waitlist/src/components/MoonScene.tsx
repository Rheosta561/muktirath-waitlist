
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';


function Moon() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial color="#ddd" roughness={1} metalness={0.1} />
    </mesh>
  );
}

export default function MoonScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      <Moon />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
