import * as DEFS from './DEFS/defs.js';

import LightManager from './actorManagers/lights/light_manager.js';
import LineManager from './actorManagers/lines/line_manager.js';
import CameraManager from './actorManagers/camera/camera_manager.js';
import MeshManager from './actorManagers/meshes/mesh_manager.js';

import SystemManager from './system_manager/system_manager.js';
import SceneManager from './scene_manager/scene_manager.js';

/*
 * Initialise the engine
*/
function initialise(canvasId) {

    // Initialise System Manager
    SystemManager.initialise(canvasId);

    // Initialise Scene Manager
    SceneManager.initialise();

    // Create Scene
    SceneManager.createScene(SystemManager.getEngine());

    // Create Actor Managers
    LineManager.initialise(SceneManager);
    LightManager.initialise(SceneManager);
    MeshManager.initialise(SceneManager);

    // Create Camera
    CameraManager.initialise(SceneManager);

    // * ArcRotate
    CameraManager.createCamera(DEFS.CAMERATYPES.ARCROTATE, "arc_camera", {
        alpha: Math.PI / 4,
        beta: Math.PI / 4,
        radius: 20,
        target: new BABYLON.Vector3(0, 0, 0)
    });
    // TODO
    //CameraManager.setCameraPosition(new BABYLON.Vector3(0, 0, 20));

    // * Universal Camera
    // CameraManager.createCamera(DEFS.CAMERATYPES.UNIVERSAL, "universal_camera", {
    //     position: new BABYLON.Vector3(0, 0, 0)
    // });
    // CameraManager.setTarget(new BABYLON.Vector3(0, 0, 0));



    // * FLy Camera
    // CameraManager.createCamera(DEFS.CAMERATYPES.FLY, "fly_camera", {
    //     position: new BABYLON.Vector3(0, 0, 0)
    // });

    CameraManager.attachToCanvas(SystemManager.getCanvas());

    // Register Update Functions
    SystemManager.registerUpdateFunction(MeshManager.update);
    SystemManager.registerUpdateFunction(SceneManager.renderScene);
}

function run() {
    SystemManager.runUpdateLoop();
}


function createScene() {

    // * Add lights
    //LightManager.addLight(DEFS.LIGHTTYPES.POINT, "pointlight", { position: new BABYLON.Vector3(0, 0, 20) });
    LightManager.addLight(DEFS.LIGHTTYPES.HEMISPHERIC, "hemilight", { direction: new BABYLON.Vector3(0, 1, 0) });
    //LightManager.addLight(DEFS.LIGHTTYPES.DIRECTIONAL, "directional", { direction: new BABYLON.Vector3(0, 0, -1) })
    LightManager.addLight(DEFS.LIGHTTYPES.SPOT, "spotlight", { position: new BABYLON.Vector3(5, 30, 0), direction: new BABYLON.Vector3(-0.2, -1, 0), angle: Math.PI / 4, exponent: 50 });

    // * Colour lights
    LightManager.setDiffuseColour("spotlight", new BABYLON.Color3(1, 1, 1));
    LightManager.setSpecularColour("spotlight", new BABYLON.Color3(1, 1, 1));
    // LightManager.setGroundColour("hemilight", new BABYLON.Color3(0, 1, 0));

    LightManager.setLightIntensity("hemilight", 0.2);
    LightManager.setLightIntensity("spotlight", 0.8);

    // * Create an actor
    //MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, "box1", { size: 0.5, updatable: true });

    // * Create a texture
    MeshManager.addTexture("brick", {
        diffuseTexture: "imgs/brick.jpg"
    });
    MeshManager.addTexture("stone", {
        diffuseTexture: "imgs/stone.jpg"
    });
    MeshManager.addTexture("grass", {
        diffuseTexture: "imgs/grass.jpg",
        uScale: 4,
        vScale: 4,
        vOffset: 0.5,
        uOffset: 0.5,
        specularTexture: "imgs/grass.jpg",
        bumpTexture: "imgs/grass_bumpmap.jpg",
    });
    MeshManager.addMaterial("mat1", {
        diffuseColor: new BABYLON.Color3(0.52, 0.81, 0.98),
        specularColor: new BABYLON.Color3(0.6, 0.9, 1),
        alpha: 0.7
        // emissiveColor: new BABYLON.Color3(1, 1, 1)
    });

    // * Create Ground

    MeshManager.addSimpleMesh(DEFS.MESHSHAPES.GROUND, "ground", { width: 25, height: 25, subdivisions: 10, updatable: true });
    MeshManager.applyTexture("grass", "ground");
    // * Create lots of actors

    let rowLimit = 3,
        spacing = 2;

    for (let i = 0; i < rowLimit; i++) {
        for (let j = 0; j < rowLimit; j++) {
            for (let k = 0; k < rowLimit; k++) {
                let name = "box_" + i + "_" + j + "_" + k;
                MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, name, { size: 1, updatable: true });
                MeshManager.addAction(DEFS.ACTIONTYPES.MOVEABSOLUTE, name, { x: (i * spacing) - (rowLimit / 2), y: (k * spacing) + 1, z: (j * spacing) - (rowLimit / 2) });
                MeshManager.applyMaterial("mat1", name);
                //MeshManager.applyTexture("stone", name);

                // window.setInterval(function () {
                //     MeshManager.addAction(DEFS.ACTIONTYPES.ROTATETOLOCAL, name, { x: Math.PI / 12 });
                // }, 50)
            }
        }
    }

    // * Apply texture
    //MeshManager.applyTexture("brick", "box1");

    // * World Axis Lines
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