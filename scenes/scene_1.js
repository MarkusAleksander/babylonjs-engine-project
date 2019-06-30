import * as DEFS from './../DEFS/defs.js';

import CameraManager from './../actorManagers/camera/camera_manager.js';
import LightManager from './../actorManagers/lights/light_manager.js';
import SystemManager from './../system_manager/system_manager.js';

import AnimationManager from './../actorManagers/animation/animation_manager.js';
import ActorManager from './../actorManagers/ActorManager/ActorManager.js';

/*
*   Scene 1 Example
*   Animation
*/
function createScene() {
    /*
        * Create Camera for the scene
        */

    // * Create an ArcRotate
    CameraManager.createCamera(DEFS.CAMERATYPES.ARCROTATE, "main_camera", {
        alpha: Math.PI / 4,
        beta: Math.PI / 3,
        radius: 50,
        target: new BABYLON.Vector3(0, 0, 0)
    });

    // * Attach the camera to the scene
    CameraManager.attachToCanvas(SystemManager.getCanvas());


    /*
    * Add lights to the scene and configure
    */
    LightManager.addLight(DEFS.LIGHTTYPES.HEMISPHERIC, "hemilight", { direction: new BABYLON.Vector3(0, 1, 0) });
    LightManager.setLightIntensity("hemilight", 0.2);
    LightManager.addLight(DEFS.LIGHTTYPES.SPOT, "spotlight", {
        position: new BABYLON.Vector3(-20, 30, -20),
        direction: new BABYLON.Vector3(0.7, -1, 0.7),
        angle: Math.PI / 4,
        exponent: 50,
        castShadows: true
    });
    LightManager.setDiffuseColour("spotlight", new BABYLON.Color3(1, 1, 1));
    LightManager.setSpecularColour("spotlight", new BABYLON.Color3(1, 1, 1));
    LightManager.setLightIntensity("spotlight", 1);


    /*
    * Create Ground
    */
    ActorManager.createActor({
        actorName: "ground",
        meshes: [{
            meshShape: DEFS.MESHSHAPES.GROUND,
            meshOptions: {
                width: 125,
                height: 125,
                subdivisions: 24
            },
        }],
        updatable: true,
        receiveShadows: true,
        checkCollisions: true,
        actorType: DEFS.ACTORTYPES.PHYSICAL,
        textureOptions: {
            diffuseTexture: "imgs/grass.jpg",
            uScale: 16,
            vScale: 16,
            vOffset: 0.5,
            uOffset: 0.5,
            specularTexture: "imgs/grass.jpg",
            bumpTexture: "imgs/grass_bumpmap.jpg",
        },
        physicsOptions: {
            imposter: BABYLON.PhysicsImpostor.BoxImpostor,
            options: { mass: 0, restitution: 0.9 }
        },
    });

    /*
    *   Create 'Dice block'
    */
    ActorManager.createActor({
        actorName: 'Dice_1',
        actorType: DEFS.ACTORTYPES.PHYSICAL,
        meshes: [{
            meshShape: DEFS.MESHSHAPES.BOX,
            meshOptions: {
                size: 2
            },
            multifaceOption: {
                cols: 2,
                rows: 3,
                faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
                wrap: true
            },
            animations: [{
                animationName: "rotationX",
                animationOptions: {
                    property: "rotation.x",
                    fps: 30,
                    type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
                    keys: [{
                        frame: 0,
                        value: 0
                    }, {
                        frame: 50,
                        value: Math.PI
                    }, {
                        frame: 100,
                        value: Math.PI * 2
                    }]
                }
            }, {
                animationName: "rotationY",
                animationOptions: {
                    property: "rotation.y",
                    fps: 30,
                    type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
                    keys: [{
                        frame: 0,
                        value: 0
                    }, {
                        frame: 50,
                        value: Math.PI
                    }, {
                        frame: 100,
                        value: Math.PI * 2
                    }]
                }
            }]
        }],
        updatable: true,
        receiveShadows: true,
        position: {
            x: 2,
            y: 2,
            z: 2
        },
        textureOptions: {
            diffuseTexture: "imgs/dice.jpg",
            specularTexture: "imgs/dice.jpg",
            bumpTexture: "imgs/dice_bumpmap.jpg"
        }
    });

    //* Inform light manager which meshes are to cast shadows
    ActorManager.getActorByName("Dice_1").meshes.forEach(function addMeshToShadowMap(mesh) {
        LightManager.addMeshToShadowMap("spotlight", mesh);
    });

    // * Create an animation
    AnimationManager.addAnimationObject("rotationX", {
        property: "rotation.x",
        fps: 30,
        type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        keys: [{
            frame: 0,
            value: 0
        }, {
            frame: 50,
            value: Math.PI
        }, {
            frame: 100,
            value: Math.PI * 2
        }]
    });
    AnimationManager.addAnimationObject("rotationY", {
        property: "rotation.y",
        fps: 30,
        type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        keys: [{
            frame: 0,
            value: 0
        }, {
            frame: 50,
            value: Math.PI
        }, {
            frame: 100,
            value: Math.PI * 2
        }]
    });
    AnimationManager.addAnimationObject("rotationZ", {
        property: "rotation.z",
        fps: 30,
        type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        keys: [{
            frame: 0,
            value: 0
        }, {
            frame: 50,
            value: Math.PI
        }, {
            frame: 100,
            value: Math.PI * 2
        }]
    });

    // * Assign animation to mesh
    // AnimationManager.addAnimationToMesh("rotationZ", DICETEMPLATE.name);

    // * Begin animations
    AnimationManager.runAnimations();

}

export default createScene;