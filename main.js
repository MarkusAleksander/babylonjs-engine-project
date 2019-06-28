import * as DEFS from './DEFS/defs.js';

import LightManager from './actorManagers/lights/light_manager.js';
import LineManager from './actorManagers/lines/line_manager.js';
import CameraManager from './actorManagers/camera/camera_manager.js';
import MeshManager from './actorManagers/meshes/mesh_manager.js';
import AnimationManager from './actorManagers/animation/animation_manager.js';
import PhysicsManager from './physics_manager/physics_manager.js';

import SystemManager from './system_manager/system_manager.js';
import SceneManager from './scene_manager/scene_manager.js';

/*
 * Initialise the engine
*/
function initialise(canvasId) {

    // * Initialise System Manager
    SystemManager.initialise(canvasId);

    // * Initialise Scene Manager
    SceneManager.initialise();

    // * Create Scene
    SceneManager.createScene(SystemManager.getEngine());

    // * Initialise Actor Managers
    LineManager.initialise(SceneManager);
    LightManager.initialise(SceneManager);
    MeshManager.initialise(SceneManager);

    // * Initialise Animation Manager
    AnimationManager.initialise(SceneManager, MeshManager);

    // * Initialise Physics Manager
    PhysicsManager.initialise(SceneManager);

    // * Initialise Camera Manager
    CameraManager.initialise(SceneManager);

    // * Register Update Functions
    SystemManager.registerUpdateFunction(MeshManager.update);
    SystemManager.registerUpdateFunction(SceneManager.renderScene);
}

function run() {
    SystemManager.runUpdateLoop();
}


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
    LightManager.setLightIntensity("spotlight", 0.8);


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
    // * Apply collisions to the ground mesh
    MeshManager.getMeshInterface("ground").mesh.checkCollisions = true;


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
    MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, DICETEMPLATE.name, {
        faceUV: MeshManager.getMultifaceOption(DICETEMPLATE.name).faceUV,
        wrap: MeshManager.getMultifaceOption(DICETEMPLATE.name).wrap,
        size: DICETEMPLATE.size,
        updatable: true,
        receiveShadows: true
    });
    // * Create texture for dice actor and apply
    MeshManager.addTexture(DICETEMPLATE.name, {
        diffuseTexture: DICETEMPLATE.texture,
        specularTexture: DICETEMPLATE.texture,
        bumpTexture: DICETEMPLATE.bumpMap
    });
    MeshManager.applyTexture(DICETEMPLATE.name, DICETEMPLATE.name);

    // * Position dice from origin
    MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, DICETEMPLATE.name, {
        x: 0,
        y: DICETEMPLATE.size * 2,
        z: 0
    });

    // * Inform light manager which meshes are to cast shadows
    LightManager.addMeshToShadowMap("spotlight", MeshManager.getMeshInterface(DICETEMPLATE.name));

    // * Create lots of actors
    let rowLimit = 1,
        spacing = 10;
        //d = MeshManager.getMeshInterface("cube").mesh.physicsImpostor;//.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        //debugger;

    // for (let i = 0; i < rowLimit; i++) {
    //     for (let j = 0; j < rowLimit; j++) {
    //         for (let k = 0; k < rowLimit; k++) {
    //             let name = "box_" + i + "_" + j + "_" + k;
    //             MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, name, {
    //                 faceUV: multifaceOption.faceUV,
    //                 wrap: multifaceOption.wrap,
    //                 size: 1,
    //                 updatable: true,
    //                 receiveShadows: true
    //             });
    //             MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, name, {
    //                 x: (i * spacing) - (rowLimit / 2),
    //                 y: (k * spacing) + 1,
    //                 z: (j * spacing) - (rowLimit / 2)
    //             });
    //             MeshManager.applyTexture(DICE, name);
    //             LightManager.addMeshToShadowMap("spotlight", MeshManager.getMeshInterface(name));

    //         }
    //     }
    // }


    // * Create an animation
    // AnimationManager.addAnimationObject("rotationX", {
    //     property: "rotation.x",
    //     fps: 30,
    //     type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    //     mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    //     keys: [{
    //         frame: 0,
    //         value: 0
    //     }, {
    //         frame: 50,
    //         value: Math.PI
    //     }, {
    //         frame: 100,
    //         value: Math.PI * 2
    //     }]
    // });
    // AnimationManager.addAnimationObject("rotationY", {
    //     property: "rotation.y",
    //     fps: 30,
    //     type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    //     mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    //     keys: [{
    //         frame: 0,
    //         value: 0
    //     }, {
    //         frame: 50,
    //         value: Math.PI
    //     }, {
    //         frame: 100,
    //         value: Math.PI * 2
    //     }]
    // });
    // AnimationManager.addAnimationObject("rotationZ", {
    //     property: "rotation.z",
    //     fps: 30,
    //     type: BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    //     mode: BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    //     keys: [{
    //         frame: 0,
    //         value: 0
    //     }, {
    //         frame: 50,
    //         value: Math.PI
    //     }, {
    //         frame: 100,
    //         value: Math.PI * 2
    //     }]
    // });


    /*
    *   Enable Physics
    */
    PhysicsManager.enablePhysics(new BABYLON.Vector3(0, -9.81, 0));

    // for (let i = 0; i < rowLimit; i++) {
    //     for (let j = 0; j < rowLimit; j++) {
    //         for (let k = 0; k < rowLimit; k++) {
    //             let name = "box_" + i + "_" + j + "_" + k;
    //             MeshManager.getMeshInterface(name).mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface(name).mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, SceneManager.getScene());
    //         }
    //     }
    // }
    window.setTimeout(function() {
        MeshManager.getMeshInterface(DICETEMPLATE.name).mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface(DICETEMPLATE.name).mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, SceneManager.getScene());
        MeshManager.getMeshInterface("ground").mesh.physicsImpostor = new BABYLON.PhysicsImpostor(MeshManager.getMeshInterface("ground").mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9}, SceneManager.getScene());
    }, 1000);

    // AnimationManager.runAnimations();

    // * World Axis Lines - DEBUG ONLU
    createWorldAxisReferenceLines();
}

function createWorldAxisReferenceLines() {
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldXRef", [[0, 0, 0], [5, 0, 0]], { colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldYRef", [[0, 0, 0], [0, 5, 0]], { colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldZRef", [[0, 0, 0], [0, 0, 5]], { colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)] });
}

function handleWindowEvents() {
    window.addEventListener("resize", function () {
        SystemManager.getEngine().resize();
    });
}

initialise("renderCanvas");
createScene();
run();

// window.setTimeout(function () {
//     MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, "box1", { x: 2, y: 2, z: 2 });
// }, 1000);

// window.setTimeout(function () {
//     MeshManager.addAction(DEFS.ACTIONTYPES.MOVERELATIVE, "box1", { x: 1, y: -1, z: -1 });
// }, 2000);

// window.setTimeout(function () {
//     MeshManager.addAction(DEFS.ACTIONTYPES.SCALE, "box1", { x: 2 });
// }, 3000);

// window.setInterval(function () {
//     MeshManager.addAction(DEFS.ACTIONTYPES.ROTATETOLOCAL, "box1", { x: Math.PI / 48 });
// }, 10);

//createWorldAxisReferenceLines();


// SceneManager.moveMeshActorRelatively("box1", { x: 0, y: 1, z: 0});
// SceneManager.moveMeshActorRelatively("box1", { x: 0, y: 0, z: 1});
//SceneManager.moveMeshActorAbsolutely("box1", { x: 0, y: 0, z: 1});

// window.setTimeout(function() {
//     SceneManager.moveMeshActorRelatively("box1", { x: 1, y: 0, z: 0});
//     SceneManager.scaleMeshActor("box1", { x: 2 });
// }, 1000);

// window.setInterval(function () {
//      SceneManager.rotateMeshActorToLocalAxis("box1", { x: Math.PI / 12, y: Math.PI / 24 });
// }, 100);

// SystemManager.getScene().ambientColor = new BABYLON.Color3(1,1,1);

// SceneManager.createMaterial("mat1", {
//     diffuseColor: new BABYLON.Color4(1, 1, 1, 1),
//     // specularColor: new BABYLON.Color3(0, 0, 1),
//     // emissiveColor: new BABYLON.Color3(1, 0, 0),
//     // ambientColor: new BABYLON.Color4(1, 0, 0, 0)
// })

// SceneManager.applyMaterial("box1", "mat1");

// SceneManager.createTexture("bricktexture", {
//     diffuseTexture: "imgs/brick.jpg"
// })
// SceneManager.applyTexture("box1", "bricktexture");

// * Handle resizing events
handleWindowEvents();

// * TODOs: Wireframe Modes