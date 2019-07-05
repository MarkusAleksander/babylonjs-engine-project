import * as DEFS from './../definitions/definitions.js';

import CameraManager from '../managers/camera/CameraManager.js';
import LightManager from './../managers/lights/LightManager.js';
import SystemManager from './../managers/system/SystemManager.js';
import SceneManager from './../managers/scene/SceneManager.js';

import PhysicsManager from './../managers/physics/PhysicsManager.js';
import ActorManager from './../managers/actor/ActorManager.js';

/*
*   Scene 7 Example
*   Attach before and after render functionality - bat hitting balls
*/
function createScene() {
    /*
    * Create Camera for the scene
    */

    // * Create an ArcRotate
    CameraManager.createCamera(DEFS.CAMERATYPES.ARCROTATE, "main_camera", {
        alpha: Math.PI / 4,
        beta: Math.PI / 3,
        radius: 175,
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
            options: { mass: 0, restitution: 0.2 }
        },
    });

    /*
    *   Create Bat
    */
    ActorManager.createActor({
        actorName: 'Bat',
        actorType: DEFS.ACTORTYPES.PHYSICAL,
        meshes: [{
            meshShape: DEFS.MESHSHAPES.CYLINDER,
            meshOptions: {
                diameter: 6,
                height: 100
            }
        }],
        updatable: true,
        receiveShadows: true,
        castShadows: true,
        addToShadowMaps: ["spotlight"],
        position: {
            x: 0,
            y: 3,
            z: 0
        },
        rotation: {
            x: Math.PI/2,
            y: 0,
            z: 0
        },
        textureOptions: {
            diffuseColor: new BABYLON.Color3(Math.random(), Math.random(), Math.random())
        },
        physicsOptions: {
            imposter: DEFS.PHYSICSIMPOSTERS.CYLINDER,
            options: { mass: 2, restitution: 0.8 }
        },
        animations: [{
            property: 'rotation.z',
            animateBy: 0.1
        }]
    });

    /*
    *   Create 'Spheres'
    */
    let numSpheres = 300;

    for (let i = 0; i < numSpheres; i++) {
        ActorManager.createActor({
            actorName: 'Ball_' + i,
            actorType: DEFS.ACTORTYPES.PHYSICAL,
            meshes: [
                {
                    meshShape: DEFS.MESHSHAPES.SPHERE,
                    meshOptions: {
                        diameter: 4
                    }
                }
            ],
            updatable: true,
            receiveShadows: true,
            castShadows: true,
            addToShadowMaps: ["spotlight"],
            checkCollisions: true,
            position: {
                x: (Math.random() * 50) - 25,
                y: 5 + (5 * i),
                z: (Math.random() * 50) - 25
            },
            textureOptions: {
                diffuseColor: new BABYLON.Color3(Math.random(), Math.random(), Math.random())
            },
            physicsOptions: {
                imposter: DEFS.PHYSICSIMPOSTERS.SPHERE,
                options: { mass: 1, restitution: 0.4 }
            }
        });
    }

    // * Apply physics to all the objects
    PhysicsManager.applyPhysics();


    // * Add before and after render logic
    SceneManager.addLogicBeforeRender(function () {
        console.log('before scene logic: stepID:' + SceneManager.getScene().getStepId());

        if (SceneManager.getScene().getStepId() > 200) {
            SceneManager.clearLogicBeforeRenderList();
        }
    });
    SceneManager.addLogicAfterRender(function () {
        console.log('after scene logic: stepID:' + SceneManager.getScene().getStepId());

        if (SceneManager.getScene().getStepId() > 200) {
            SceneManager.clearLogicAfterRenderList();
        }
    });

}

export default createScene;