import * as DEFS from './../definitions/definitions.js';

import CameraManager from './../managers/camera/CameraManager.js';
import LightManager from './../managers/lights/LightManager.js';
import SystemManager from './../managers/system/SystemManager.js';

import AnimationManager from './../managers/animation/AnimationManager.js';
import PhysicsManager from './../managers/physics/PhysicsManager.js';
import ActorManager from './../managers/actor/ActorManager.js';

/*
*   Scene 5 Example
*   Merged Meshes with Physics and lots of colour
*/
function createScene() {
    /*
    * Create Camera for the scene
    */

    // * Create an ArcRotate
    CameraManager.createCamera(DEFS.CAMERATYPES.ARCROTATE, "main_camera", {
        alpha: Math.PI / 4,
        beta: Math.PI / 3,
        radius: 75,
        target: new BABYLON.Vector3(0, 0, 0)
    });

    // * Attach the camera to the scene
    CameraManager.attachToCanvas(SystemManager.getCanvas());


    /*
    * Add lights to the scene and configure
    */
    LightManager.addLight(DEFS.LIGHTTYPES.HEMISPHERIC, "hemilight", { direction: new BABYLON.Vector3(0, 1, 0) });
    LightManager.setLightIntensity("hemilight", 0.6);
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
    *   Enable Physics
    */
    PhysicsManager.enablePhysics(new BABYLON.Vector3(0, -9.81, 0));

    /*
    * Create Actors
    */

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
            diffuseTexture: "assets/imgs/grass.jpg",
            uScale: 16,
            vScale: 16,
            vOffset: 0.5,
            uOffset: 0.5,
            specularTexture: "assets/imgs/grass.jpg",
            bumpTexture: "assets/imgs/grass_bumpmap.jpg",
        },
        physicsOptions: {
            imposter: DEFS.PHYSICSIMPOSTERS.BOX,
            options: { mass: 0, restitution: 0.9 }
        },
    });


    /*
    *   Create 'Dice block'
    */

    let numSpheres = 100,
        sphereSize = 4;

    for (let i = 0; i < numSpheres; i++) {
        ActorManager.createActor({
            actorName: 'MergedMesh_' + i,
            actorType: DEFS.ACTORTYPES.PHYSICAL,
            meshes: [
                {
                    meshShape: DEFS.MESHSHAPES.BOX,
                    meshOptions: {
                        size: sphereSize - 1
                    },
                    multifaceOption: {
                        cols: 2,
                        rows: 3,
                        faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
                        wrap: true
                    },
                    physicsOptions: {
                        imposter: DEFS.PHYSICSIMPOSTERS.BOX,
                        options: { mass: 0 }
                    },
                },
                {
                    meshShape: DEFS.MESHSHAPES.SPHERE,
                    meshOptions: {
                        diameter: sphereSize
                    },
                    physicsOptions: {
                        imposter: DEFS.PHYSICSIMPOSTERS.BOX,
                        options: { mass: 0 }
                    },
                }
            ],
            animations: [{
                animationName: "rotationY",
                animationData: {
                    type: 'rotation',
                    axis: BABYLON.Axis.Y,
                    fps: (Math.PI) / 60,
                    frameReference: BABYLON.Space.WORLD
                }
            }],
            updatable: true,
            receiveShadows: true,
            castShadows: true,
            addToShadowMaps: ["spotlight"],
            checkCollisions: true,
            position: {
                x: (Math.random() * 20) - 10,
                y: (sphereSize / 2) + (sphereSize * i) + Math.random(),
                z: (Math.random() * 20) - 10
            },
            textureOptions: {
                diffuseColor: new BABYLON.Color3(Math.random(), Math.random(), Math.random()),
                diffuseTexture: "assets/imgs/dice.jpg",
                specularTexture: "assets/imgs/dice.jpg",
                bumpTexture: "assets/imgs/dice_bumpmap.jpg"
            },
            physicsOptions: {
                imposter: DEFS.PHYSICSIMPOSTERS.NOIMPOSTER,
                options: { mass: 2, restitution: 0.1 }
            },
        });
    }

    // * Begin animations
    AnimationManager.runAnimations();

    // * Apply physics to all the objects
    //PhysicsManager.applyPhysics();
}

export default createScene;