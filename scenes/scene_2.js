import * as DEFS from './../definitions/definitions.js';

import CameraManager from './../managers/camera/CameraManager.js';
import LightManager from './../managers/lights/LightManager.js';
import SystemManager from './../managers/system/SystemManager.js';
import PhysicsManager from './../managers/physics/PhysicsManager.js';

import ActorManager from './../managers/actor/ActorManager.js';

/*
*   Scene 2 Example
*   Physics With Single Block
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
    *   Enable Physics
    */
    PhysicsManager.enablePhysics(new BABYLON.Vector3(0, -9.81, 0));

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
            }
        }],
        updatable: true,
        receiveShadows: true,
        castShadows: true,
        addToShadowMaps: ["spotlight"],
        checkCollisions: true,
        position: {
            x: 2,
            y: 20,
            z: 2
        },
        textureOptions: {
            diffuseTexture: "assets/imgs/dice.jpg",
            specularTexture: "assets/imgs/dice.jpg",
            bumpTexture: "assets/imgs/dice_bumpmap.jpg"
        },
        physicsOptions: {
            imposter: DEFS.PHYSICSIMPOSTERS.BOX,
            options: { mass: 1, restitution: 0.5 }
        },
    });

    // * Apply physics to all the objects
    PhysicsManager.applyPhysics();
}

export default createScene;