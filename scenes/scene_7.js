import * as DEFS from './../DEFS/defs.js';

import CameraManager from './../actorManagers/camera/camera_manager.js';
import LightManager from './../actorManagers/lights/light_manager.js';
import SystemManager from './../system_manager/system_manager.js';
import SceneManager from './../scene_manager/scene_manager.js';

import PhysicsManager from './../actorManagers/physics_manager/physics_manager.js';
import ActorManager from './../actorManagers/ActorManager/ActorManager.js';
import AnimationManager from '../actorManagers/animation/animation_manager.js';

/*
*   Scene 7 Example
*   Attach before and after render functionality
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
    *   Create 'Dice block'
    */
let numDice = 200;

for(let i = 0; i < numDice; i++) {
        ActorManager.createActor({
            actorName: 'MergedMesh_' + i,
            actorType: DEFS.ACTORTYPES.PHYSICAL,
            meshes: [
                {
                    meshShape: DEFS.MESHSHAPES.BOX,
                    meshOptions: {
                        size: 5
                    },
                    multifaceOption: {
                        cols: 2,
                        rows: 3,
                        faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
                        wrap: true
                    },
                    relativePosition: {
                        x: 2,
                        y: 2,
                        z: 2
                    },
                    physicsOptions: {
                        imposter: DEFS.PHYSICSIMPOSTERS.BOX,
                        options: { mass: 0, restitution: 0.5 }
                    },
                },
                {
                    meshShape: DEFS.MESHSHAPES.BOX,
                    meshOptions: {
                        size: 5
                    },
                    multifaceOption: {
                        cols: 2,
                        rows: 3,
                        faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
                        wrap: true
                    },
                    relativePosition: {
                        x: -2,
                        y: -2,
                        z: -2
                    },
                    physicsOptions: {
                        imposter: DEFS.PHYSICSIMPOSTERS.BOX,
                        options: { mass: 0, restitution: 0.5 }
                    },
                }
            ],
            updatable: true,
            receiveShadows: true,
            castShadows: true,
            addToShadowMaps: ["spotlight"],
            checkCollisions: true,
            position: {
                x: (Math.random() * 20) + 10,
                y: 5 + (9 * i),
                z: (Math.random() * 20) - 10
            },
            textureOptions: {
                diffuseColor: new BABYLON.Vector3(Math.random(), Math.random(), Math.random()),
                diffuseTexture: "imgs/dice.jpg",
                specularTexture: "imgs/dice.jpg",
                bumpTexture: "imgs/dice_bumpmap.jpg"
            },
            physicsOptions: {
                imposter: DEFS.PHYSICSIMPOSTERS.NOIMPOSTER,
                options: { mass: 2, restitution: 0.9 }
            },
            animations: [{
                property: 'rotation.x',
                animateBy: Math.random() - Math.random()
            }
            // ,{
            //     property: 'position.z',
            //     animateBy: Math.random() - Math.random()
            // }
        ]
        });
    }

    // * Apply physics to all the objects
    PhysicsManager.applyPhysics();


    // * Add before and after render logic
    SceneManager.addLogicBeforeRender(function() {
        console.log('before scene logic: stepID:' + SceneManager.getScene().getStepId());

        if(SceneManager.getScene().getStepId() > 200) {
            SceneManager.clearLogicBeforeRenderList();
        }
    });
    SceneManager.addLogicAfterRender(function() {
        console.log('after scene logic: stepID:' + SceneManager.getScene().getStepId());

        if(SceneManager.getScene().getStepId() > 200) {
            SceneManager.clearLogicAfterRenderList();
        }
    });

}

export default createScene;