import * as DEFS from './../DEFS/defs.js';

import CameraManager from './../actorManagers/camera/camera_manager.js';
import LightManager from './../actorManagers/lights/light_manager.js';
import SystemManager from './../system_manager/system_manager.js';
import PhysicsManager from './../actorManagers/physics_manager/physics_manager.js';

import ActorManager from './../actorManagers/ActorManager/ActorManager.js';

/*
*   Scene 3 Example
*   Physics Multiple Blocks
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
            diffuseTexture: "imgs/grass.jpg",
            uScale: 16,
            vScale: 16,
            vOffset: 0.5,
            uOffset: 0.5,
            specularTexture: "imgs/grass.jpg",
            bumpTexture: "imgs/grass_bumpmap.jpg",
        },
        physicsOptions: {
            imposter: DEFS.PHYSICSIMPOSTERS.BOX,
            options: { mass: 0, restitution: 0.9 }
        },
    });


    /*
    * Create Actors
    */

    // * Create lots of actors
    let rowLimit = 6,
        spacing = 3;

    for (let i = 0; i < rowLimit; i++) {
        for (let j = 0; j < 1; j++) {
            for (let k = 0; k < rowLimit; k++) {

                /*
                *   Create 'Dice block'
                */
                ActorManager.createActor({
                    actorName: "Dice_" + i + "_" + j + "_" + k,
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
                    position: {
                        x: (i * spacing) - (rowLimit / 2) * 2 + Math.random(),
                        y: (k * spacing) + 1 * 2 + Math.random(),
                        z: (j * spacing) - (rowLimit / 2) * 2 + Math.random()
                    },
                    textureOptions: {
                        diffuseTexture: "imgs/dice.jpg",
                        specularTexture: "imgs/dice.jpg",
                        bumpTexture: "imgs/dice_bumpmap.jpg"
                    },
                    physicsOptions: {
                        imposter: DEFS.PHYSICSIMPOSTERS.BOX,
                        options: { mass: 1, restitution: 0.5 }
                    },
                });
            }
        }
    }

    // * Apply physics to all the objects
    PhysicsManager.applyPhysics();
}

export default createScene;