import * as DEFS from './../DEFS/defs.js';

import CameraManager from './../actorManagers/camera/camera_manager.js';
import LightManager from './../actorManagers/lights/light_manager.js';
import MeshManager from './../actorManagers/meshes/mesh_manager.js';
import SystemManager from './../system_manager/system_manager.js';
import AnimationManager from './../actorManagers/animation/animation_manager.js';


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
    MeshManager.addSimpleMesh(DEFS.MESHSHAPES.GROUND, "ground", {
        width: 125,
        height: 125,
        subdivisions: 24,
        updatable: true,
        receiveShadows: true
    });
    // * Create and apply a texture to the ground
    MeshManager.addTexture("grass", {
        diffuseTexture: "imgs/grass.jpg",
        uScale: 16,
        vScale: 16,
        vOffset: 0.5,
        uOffset: 0.5,
        specularTexture: "imgs/grass.jpg",
        bumpTexture: "imgs/grass_bumpmap.jpg",
    });
    MeshManager.applyTexture("grass", "ground");

    /*
    * Create Actors
    */
    // * Create some useful data
    const DICETEMPLATE = {
        name: "dice",
        texture: "imgs/dice.jpg",
        bumpMap: "imgs/dice_bumpmap.jpg",
        size: 2
    }
    // * Create multiface option for dice actor
    // TODO - Should come after mesh creation - not before
    MeshManager.addMultfaceOption(DICETEMPLATE.name, {
        cols: 2,
        rows: 3,
        faces: [[0, 2], [1, 0], [0, 1], [1, 1], [0, 0], [1, 2]],
        wrap: true
    });
    // * Create texture for dice actor and apply
    MeshManager.addTexture(DICETEMPLATE.name, {
        diffuseTexture: DICETEMPLATE.texture,
        specularTexture: DICETEMPLATE.texture,
        bumpTexture: DICETEMPLATE.bumpMap
    });

    // * Create a single mesh
    MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, DICETEMPLATE.name, {
        faceUV: MeshManager.getMultifaceOption(DICETEMPLATE.name).faceUV,
        wrap: MeshManager.getMultifaceOption(DICETEMPLATE.name).wrap,
        size: DICETEMPLATE.size,
        updatable: true,
        receiveShadows: true
    });

    MeshManager.applyTexture(DICETEMPLATE.name, DICETEMPLATE.name);

    //* Position dice from origin - TODO - setting position this way impacts on physics solver
    MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, DICETEMPLATE.name, {
        x: 0,
        y: DICETEMPLATE.size * 2,
        z: 0
    });

    //* Inform light manager which meshes are to cast shadows
    LightManager.addMeshToShadowMap("spotlight", MeshManager.getMeshInterface(DICETEMPLATE.name));

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
    AnimationManager.addAnimationToMesh("rotationZ", DICETEMPLATE.name);

    // * Begin animations
    AnimationManager.runAnimations();

}

export default createScene;