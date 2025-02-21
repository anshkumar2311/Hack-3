// "use client";

// import { Pose } from '@mediapipe/pose';
// import { VRM, VRMHumanBoneName, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
// import * as Kalidokit from 'kalidokit';
// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// // Define the POSE_CONNECTIONS constant
// const POSE_CONNECTIONS = [
//   [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
//   [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
//   [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23],
//   [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29],
//   [28, 30], [29, 31], [30, 32], [27, 31], [28, 32]
// ];

// interface KalidoAvatarProps {
//   modelPath: string;
//   isSpeaking?: boolean;
//   className?: string;
// }

// interface Results {
//   poseLandmarks?: {
//     x: number;
//     y: number;
//     z: number;
//     visibility?: number;
//   }[];
//   poseWorldLandmarks?: {
//     x: number;
//     y: number;
//     z: number;
//     visibility?: number;
//   }[];
// }

// export function KalidoAvatar({ modelPath, isSpeaking = false, className = "" }: KalidoAvatarProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const drawAreaRef = useRef<HTMLDivElement>(null);
//   const currentVrmRef = useRef<VRM | null>(null);

//   useEffect(() => {
//     if (!videoRef.current || !canvasRef.current || !drawAreaRef.current) return;

//     const videoElement = videoRef.current;
//     const guideCanvas = canvasRef.current;

//     // Dynamically import MediaPipe modules
//     let cameraModule: any;
//     let drawingUtils: any;

//     Promise.all([
//       import('@mediapipe/camera_utils').then(module => module.default),
//       import('@mediapipe/drawing_utils').then(module => module.default)
//     ]).then(([camera, drawing]) => {
//       cameraModule = camera;
//       drawingUtils = drawing;

//       // Initialize camera after modules are loaded
//       if (cameraModule && videoElement) {
//         const cameraInstance = new cameraModule.Camera(videoElement, {
//           onFrame: async () => {
//             await pose.send({ image: videoElement });
//           },
//           width: 640,
//           height: 480,
//         });
//         cameraInstance.start().catch(console.error);
//       }
//     });

//     // THREEJS WORLD SETUP
//     const renderer = new THREE.WebGLRenderer({ alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     drawAreaRef.current.appendChild(renderer.domElement);

//     const orbitCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
//     orbitCamera.position.set(0.0, 1.4, 3.0);

//     const scene = new THREE.Scene();

//     const orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
//     orbitControls.screenSpacePanning = true;
//     orbitControls.target.set(0.0, 1.4, 0.0);
//     orbitControls.update();

//     const light = new THREE.DirectionalLight(0xffffff);
//     light.position.set(1.0, 1.0, 1.0).normalize();
//     scene.add(light);

//     // VRM CHARACTER SETUP
//     const loader = new GLTFLoader();
//     loader.crossOrigin = "anonymous";
//     const helperRoot = new THREE.Group();
//     loader.register((parser) => new VRMLoaderPlugin(parser, { helperRoot }));

//     loader.load(
//       modelPath,
//       (gltf) => {
//         VRMUtils.removeUnnecessaryJoints(gltf.scene);
//         const vrm = gltf.userData.vrm;
//         scene.add(vrm.scene);
//         currentVrmRef.current = vrm;
//         vrm.scene.rotation.y = Math.PI;
//       },
//       (progress) => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),
//       console.error
//     );

//     // Animation Functions
//     const rigRotation = (name: VRMHumanBoneName, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
//       if (!currentVrmRef.current) return;

//       const Part = currentVrmRef.current.humanoid.getNormalizedBoneNode(name);
//       if (!Part) return;

//       const euler = new THREE.Euler(
//         rotation.x * dampener,
//         rotation.y * dampener,
//         rotation.z * dampener
//       );
//       const quaternion = new THREE.Quaternion().setFromEuler(euler);
//       Part.quaternion.slerp(quaternion, lerpAmount);
//     };

//     const rigPosition = (name: VRMHumanBoneName, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
//       if (!currentVrmRef.current) return;

//       const Part = currentVrmRef.current.humanoid.getNormalizedBoneNode(name);
//       if (!Part) return;

//       const vector = new THREE.Vector3(
//         position.x * dampener,
//         position.y * dampener,
//         position.z * dampener
//       );
//       Part.position.lerp(vector, lerpAmount);
//     };

//     const animateVRM = (vrm: VRM, results: Results) => {
//       if (!vrm) return;

//       const pose3DLandmarks = results.poseWorldLandmarks;
//       const pose2DLandmarks = results.poseLandmarks;

//       if (pose2DLandmarks && pose3DLandmarks) {
//         const riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
//           runtime: "mediapipe",
//           video: videoElement,
//         });

//         if (riggedPose) {
//           rigRotation(VRMHumanBoneName.Hips, riggedPose.Hips.rotation, 0.7);
//           rigPosition(
//             VRMHumanBoneName.Hips,
//             {
//               x: riggedPose.Hips.position.x,
//               y: riggedPose.Hips.position.y + 1,
//               z: -riggedPose.Hips.position.z,
//             },
//             1,
//             0.07
//           );

//           rigRotation(VRMHumanBoneName.Chest, riggedPose.Spine, 0.25, 0.3);
//           rigRotation(VRMHumanBoneName.Spine, riggedPose.Spine, 0.45, 0.3);

//           rigRotation(VRMHumanBoneName.RightUpperArm, riggedPose.RightUpperArm, 1, 0.3);
//           rigRotation(VRMHumanBoneName.RightLowerArm, riggedPose.RightLowerArm, 1, 0.3);
//           rigRotation(VRMHumanBoneName.LeftUpperArm, riggedPose.LeftUpperArm, 1, 0.3);
//           rigRotation(VRMHumanBoneName.LeftLowerArm, riggedPose.LeftLowerArm, 1, 0.3);

//           rigRotation(VRMHumanBoneName.LeftUpperLeg, riggedPose.LeftUpperLeg, 1, 0.3);
//           rigRotation(VRMHumanBoneName.LeftLowerLeg, riggedPose.LeftLowerLeg, 1, 0.3);
//           rigRotation(VRMHumanBoneName.RightUpperLeg, riggedPose.RightUpperLeg, 1, 0.3);
//           rigRotation(VRMHumanBoneName.RightLowerLeg, riggedPose.RightLowerLeg, 1, 0.3);
//         }
//       }
//     };

//     // Mediapipe Setup
//     const pose = new Pose({
//       locateFile: (file) => {
//         if (file.startsWith("pose"))
//           return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
//       }
//     });

//     pose.setOptions({
//       modelComplexity: 1,
//       smoothLandmarks: true,
//       enableSegmentation: false,
//       smoothSegmentation: false,
//       minDetectionConfidence: 0.2,
//       minTrackingConfidence: 0.2
//     });

//     const drawResults = (results: Results) => {
//       if (!guideCanvas || !videoElement || !drawingUtils) return;

//       guideCanvas.width = videoElement.videoWidth;
//       guideCanvas.height = videoElement.videoHeight;
//       const canvasCtx = guideCanvas.getContext("2d");

//       if (canvasCtx) {
//         canvasCtx.save();
//         canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
//         if (results.poseLandmarks) {
//           drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
//             color: "#00cff7",
//             lineWidth: 4,
//           });
//           drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks, {
//             color: "#ff0364",
//             lineWidth: 2,
//           });
//         }
//       }
//     };

//     pose.onResults((results) => {
//       drawResults(results);
//       animateVRM(currentVrmRef.current!, results);
//     });

//     // Animation Loop
//     const clock = new THREE.Clock();

//     const animate = () => {
//       requestAnimationFrame(animate);

//       if (currentVrmRef.current) {
//         currentVrmRef.current.update(clock.getDelta());
//       }
//       renderer.render(scene, orbitCamera);
//     };
//     animate();

//     // Cleanup
//     return () => {
//       renderer.dispose();
//       scene.clear();
//     };
//   }, [modelPath]);

//   return (
//     <div className={className}>
//       <div className="grid grid-cols-2 gap-2">
//         <video
//           ref={videoRef}
//           className="w-24 h-16 z-10"
//         />
//         <canvas
//           ref={canvasRef}
//           className="w-72 h-48 ml-2"
//         />
//       </div>
//       <div
//         ref={drawAreaRef}
//         className="w-72 h-48 ml-2"
//       />
//     </div>
//   );
// }



export const HomeTest = () => {
  return (
    <div>
      <iframe src=" http://localhost:3001" allowFullScreen allowTransparency className="w-[500px] min-h-screen" frameBorder="0" allow="camera; microphone" />
    </div>
  )
}
