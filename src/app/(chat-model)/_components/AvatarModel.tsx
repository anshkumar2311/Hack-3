'use client';

import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AvatarModelProps {
    isSpeaking?: boolean;
    onFinishSpeaking?: () => void;
}

const AvatarModel = ({ isSpeaking = false, onFinishSpeaking }: AvatarModelProps) => {
    const gltf = useGLTF('/model.glb');
    const mixer = useRef(new THREE.AnimationMixer(gltf.scene));
    const [morphTargetDictionary, setMorphTargetDictionary] = useState<{ [key: string]: number } | null>(null);

    const [
        bodyTexture,
        eyesTexture,
        teethTexture,
        bodySpecularTexture,
        bodyRoughnessTexture,
        bodyNormalTexture,
        teethNormalTexture,
        // teethSpecularTexture,
        hairTexture,
        tshirtDiffuseTexture,
        tshirtNormalTexture,
        tshirtRoughnessTexture,
        hairAlphaTexture,
        hairNormalTexture,
        hairRoughnessTexture,
    ] = useTexture([
        "/images/body.webp",
        "/images/eyes.webp",
        "/images/teeth_diffuse.webp",
        "/images/body_specular.webp",
        "/images/body_roughness.webp",
        "/images/body_normal.webp",
        "/images/teeth_normal.webp",
        // "/images/teeth_specular.webp",
        "/images/h_color.webp",
        "/images/tshirt_diffuse.webp",
        "/images/tshirt_normal.webp",
        "/images/tshirt_roughness.webp",
        "/images/h_alpha.webp",
        "/images/h_normal.webp",
        "/images/h_roughness.webp",
    ]);

    useEffect(() => {
        // Set up textures
        const textures = [
            bodyTexture, eyesTexture, teethTexture, bodySpecularTexture,
            bodyRoughnessTexture, bodyNormalTexture, teethNormalTexture,
            hairTexture, hairAlphaTexture, hairNormalTexture, hairRoughnessTexture
        ];

        textures.forEach(texture => {
            if (texture) {
                texture.encoding = THREE.sRGBEncoding;
                texture.flipY = false;
            }
        });

        // Special encoding for normal maps
        [bodyNormalTexture, teethNormalTexture, hairNormalTexture].forEach(texture => {
            if (texture) {
                texture.encoding = THREE.LinearEncoding;
            }
        });

        // Set up materials
        gltf.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.frustumCulled = false;

                if (node.name.includes('Body')) {
                    node.material = new THREE.MeshPhysicalMaterial({
                        map: bodyTexture,
                        normalMap: bodyNormalTexture,
                        roughnessMap: bodyRoughnessTexture,
                        normalScale: new THREE.Vector2(0.6, 0.6),
                        roughness: 1.7,
                        envMapIntensity: 0.8
                    });
                    setMorphTargetDictionary(node.morphTargetDictionary || null);
                }

                if (node.name.includes('Eyes')) {
                    node.material = new THREE.MeshStandardMaterial({
                        map: eyesTexture,
                        roughness: 0.1,
                        envMapIntensity: 0.5
                    });
                }

                if (node.name.includes('Hair')) {
                    node.material = new THREE.MeshStandardMaterial({
                        map: hairTexture,
                        alphaMap: hairAlphaTexture,
                        normalMap: hairNormalTexture,
                        roughnessMap: hairRoughnessTexture,
                        transparent: true,
                        side: THREE.DoubleSide,
                        color: new THREE.Color(0x000000),
                        envMapIntensity: 0.3
                    });
                }
            }
        });

        // Cleanup
        return () => {
            mixer.current.stopAllAction();
        };
    }, []);

    useEffect(() => {
        if (isSpeaking) {
            // Add speaking animation logic here
            const speakingAnimation = new THREE.AnimationClip('speaking', 1, [
                // Add your speaking animation tracks here
            ]);

            const action = mixer.current.clipAction(speakingAnimation);
            action.play();
        } else {
            mixer.current.stopAllAction();
            if (onFinishSpeaking) {
                onFinishSpeaking();
            }
        }
    }, [isSpeaking, onFinishSpeaking]);

    return <primitive object={gltf.scene} />;
};

export default AvatarModel;
