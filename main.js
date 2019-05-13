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
    CameraManager.setCameraPosition(new BABYLON.Vector3(2, -2, -2));
    CameraManager.attachToCanvas(SystemManager.getCanvas());

    // Register Update Functions
    SystemManager.registerUpdateFunction(SceneManager.renderScene);
    SystemManager.registerUpdateFunction(MeshManager.update);
}

function run() {
    SystemManager.runUpdateLoop();
}


function createScene() {

    // * Add lights
    LightManager.addLight(DEFS.LIGHTTYPES.HEMISPHERIC, "light1", (0, 3, 0));
    LightManager.addLight(DEFS.LIGHTTYPES.POINT, "light2", (1, 0, 1));

    // * Create an actor
    MeshManager.addSimpleMesh(DEFS.MESHSHAPES.BOX, "box1", { size: 0.5, updatable: true });

    // * Lines
    //SceneManager.addLines("lines1", LINETYPES.SOLID, [[0,0,0], [0,1,1], [0,1,0]]);
    //SceneManager.addLines("lines2", LINETYPES.DASHED, [[0,1,0],[1,1,0],[0,0,0]], {dashSize: 0.2, gapSize: 0.5});
    createWorldAxisReferenceLines();
}

function createWorldAxisReferenceLines() {
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldXRef", [[0, 0, 0], [2, 0, 0]], { colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldYRef", [[0, 0, 0], [0, 2, 0]], { colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldZRef", [[0, 0, 0], [0, 0, 2]], { colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)] });
}

function handleWindowEvents() {
    window.addEventListener("resize", function () {
        SystemManager.getEngine().resize();
    });
}

initialise("renderCanvas");
createScene();
run();

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