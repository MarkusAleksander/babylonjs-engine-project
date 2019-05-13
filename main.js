import * as DEFS from './DEFS/defs.js';

import SystemManager from './system_manager/system_manager.js';
import SceneManager from './scene_manager/scene_manager.js';

/*
 * Initialise the engine
*/
function initialise (canvasId) {
    SystemManager.initialise("renderCanvas");
}

function createScene () {

    // * Initialise the Scene Manager
    SceneManager.initialiseScene(SystemManager);

    // * Add camera to the scene and attach to canvas
    SceneManager.initialiseCamera();

    // * Add lights
    SceneManager.addLight(DEFS.LIGHTTYPES.HEMISPHERIC, "light1", (0, 3, 0));
    SceneManager.addLight(DEFS.LIGHTTYPES.POINT, "light2", (1, 0, 1));

    // * Create an actor
    SceneManager.addSimpleMesh("box1", DEFS.MESHSHAPES.BOX, {size: 0.5, updatable: true});

    // * Lines
    //SceneManager.addLines("lines1", LINETYPES.SOLID, [[0,0,0], [0,1,1], [0,1,0]]);
    //SceneManager.addLines("lines2", LINETYPES.DASHED, [[0,1,0],[1,1,0],[0,0,0]], {dashSize: 0.2, gapSize: 0.5});
}

function createWorldAxisReferenceLines () {
    SceneManager.addLines("worldXRef", DEFS.LINETYPES.SOLID, [[0,0,0], [2,0,0]], {colors: [new BABYLON.Color4(1,0,0,1), new BABYLON.Color4(1,0,0,1)]});
    SceneManager.addLines("worldYRef", DEFS.LINETYPES.SOLID, [[0,0,0], [0,2,0]], {colors: [new BABYLON.Color4(0,1,0,1), new BABYLON.Color4(0,1,0,1)]});
    SceneManager.addLines("worldZRef", DEFS.LINETYPES.SOLID, [[0,0,0], [0,0,2]], {colors: [new BABYLON.Color4(0,0,1,1), new BABYLON.Color4(0,0,1,1)]});
}

function handleWindowEvents() {
    window.addEventListener("resize", function() {
        SystemManager.getEngine().resize();
    });
}

// * Initalise
initialise('renderCanvas');

// * Create Scene
createScene();

createWorldAxisReferenceLines();

// * Run Rendering
SystemManager.render();

// SceneManager.moveMeshActorRelatively("box1", { x: 0, y: 1, z: 0});
// SceneManager.moveMeshActorRelatively("box1", { x: 0, y: 0, z: 1});
//SceneManager.moveMeshActorAbsolutely("box1", { x: 0, y: 0, z: 1});

// window.setTimeout(function() {
//     SceneManager.moveMeshActorRelatively("box1", { x: 1, y: 0, z: 0});
//     SceneManager.scaleMeshActor("box1", { x: 2 });
// }, 1000);

window.setInterval(function () {
     SceneManager.rotateMeshActorToLocalAxis("box1", { x: Math.PI / 12, y: Math.PI / 24 });
}, 100);

SystemManager.getScene().ambientColor = new BABYLON.Color3(1,1,1);

// SceneManager.createMaterial("mat1", {
//     diffuseColor: new BABYLON.Color4(1, 1, 1, 1),
//     // specularColor: new BABYLON.Color3(0, 0, 1),
//     // emissiveColor: new BABYLON.Color3(1, 0, 0),
//     // ambientColor: new BABYLON.Color4(1, 0, 0, 0)
// })

// SceneManager.applyMaterial("box1", "mat1");

SceneManager.createTexture("bricktexture", {
    diffuseTexture: "imgs/brick.jpg"
})
SceneManager.applyTexture("box1", "bricktexture");

// * Handle resizing events
handleWindowEvents();

// * TODOs: Wireframe Modes