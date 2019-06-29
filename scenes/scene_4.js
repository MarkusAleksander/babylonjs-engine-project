import * as DEFS from './../DEFS/defs.js';

import CameraManager from './../actorManagers/camera/camera_manager.js';
import LightManager from './../actorManagers/lights/light_manager.js';
import MeshManager from './../actorManagers/meshes/mesh_manager.js';
import SystemManager from './../system_manager/system_manager.js';
import PhysicsManager from './../physics_manager/physics_manager.js';
import SceneManager from './../scene_manager/scene_manager.js';

import actorManager from './../actorManagers/ActorManager/ActorManager.js';
import ActorManager from './../actorManagers/ActorManager/ActorManager.js';

/*
*   Scene 4 Example
*   Rebuilding With ActorManager interface for Actors
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
                subdivisions: 24,
                updatable: true,
                receiveShadows: true,
                checkCollisions: true
            },
        }],
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

    //MeshManager.getMeshInterface("ground").mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface("ground").mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, SceneManager.getScene());

    // MeshManager.addSimpleMesh(DEFS.MESHSHAPES.GROUND, "ground", {
    //     width: 125,
    //     height: 125,
    //     subdivisions: 24,
    //     updatable: true,
    //     receiveShadows: true
    // });
    // // * Create and apply a texture to the ground
    // MeshManager.addTexture("grass", {
    //     diffuseTexture: "imgs/grass.jpg",
    //     uScale: 16,
    //     vScale: 16,
    //     vOffset: 0.5,
    //     uOffset: 0.5,
    //     specularTexture: "imgs/grass.jpg",
    //     bumpTexture: "imgs/grass_bumpmap.jpg",
    // });
    // MeshManager.applyTexture("grass", "ground");
    // // * Apply collisions to the ground mesh
    // MeshManager.getMeshInterface("ground").mesh.checkCollisions = true;


    /*
    * Create Actors
    */
    // * Create some useful data
    // const DICETEMPLATE = {
    //     name: "dice",
    //     texture: "imgs/dice.jpg",
    //     bumpMap: "imgs/dice_bumpmap.jpg",
    //     size: 2
    // }
    // // * Create multiface option for dice actor
    // // TODO - Should come after mesh creation - not before
    // MeshManager.addMultfaceOption(DICETEMPLATE.name, {
    //     cols: 2,
    //     rows: 3,
    //     faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
    //     wrap: true
    // });
    // // * Create texture for dice actor and apply
    // MeshManager.addTexture(DICETEMPLATE.name, {
    //     diffuseTexture: DICETEMPLATE.texture,
    //     specularTexture: DICETEMPLATE.texture,
    //     bumpTexture: DICETEMPLATE.bumpMap
    // });

    // // * Create a single mesh
    // MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, DICETEMPLATE.name, {
    //     faceUV: MeshManager.getMultifaceOption(DICETEMPLATE.name).faceUV,
    //     wrap: MeshManager.getMultifaceOption(DICETEMPLATE.name).wrap,
    //     size: DICETEMPLATE.size,
    //     updatable: true,
    //     receiveShadows: true
    // });

    // MeshManager.applyTexture(DICETEMPLATE.name, DICETEMPLATE.name);

    // //* Position dice from origin - TODO - setting position this way impacts on physics solver
    // MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, DICETEMPLATE.name, {
    //     x: 0,
    //     y: DICETEMPLATE.size * 2,
    //     z: 0
    // });

    // //* Inform light manager which meshes are to cast shadows
    // LightManager.addMeshToShadowMap("spotlight", MeshManager.getMeshInterface(DICETEMPLATE.name));



    // window.setTimeout(function () {

    //     // * Apply physics to mesh
    //     MeshManager.getMeshInterface(DICETEMPLATE.name).mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface(DICETEMPLATE.name).mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, SceneManager.getScene());

    //     // * Apply physics to ground
    //     //MeshManager.getMeshInterface("ground").mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface("ground").mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, SceneManager.getScene());
    // }, 3000);
}

export default createScene;