import * as DEFS from './definitions/definitions.js';

import LightManager from './managers/lights/LightManager.js';
import LineManager from './managers/lines/LineManager.js';
import CameraManager from './managers/camera/CameraManager.js';
import MeshManager from './managers/meshes/MeshManager.js';
import AnimationManager from './managers/animation/AnimationManager.js';
import PhysicsManager from './managers/physics/PhysicsManager.js';

import SystemManager from './managers/system/SystemManager.js';
import SceneManager from './managers/scene/SceneManager.js';

import ActorManager from './managers/actor/ActorManager.js';

import createScene from './scenes/scene_5.js';

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
    ActorManager.initialise(SceneManager);

    // TODO - Should these be moved to the ActorManager?
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
    SystemManager.registerUpdateFunction(SceneManager.renderScene);
}

/*
*   Call to run the System Manager Update Loop
*/
function run() {
    SystemManager.runUpdateLoop();
}

/*
*   Setup the Scene
*/
function setupScene() {

    /*
    *   Create Scene!
    */
    createScene();

    // * World Axis Lines
    createWorldAxisReferenceLines();
}

/*
*   Create Lines to display World Axis
*/
function createWorldAxisReferenceLines() {
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldXRef", [[0, 0, 0], [5, 0, 0]], { colors: [new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldYRef", [[0, 0, 0], [0, 5, 0]], { colors: [new BABYLON.Color4(0, 1, 0, 1), new BABYLON.Color4(0, 1, 0, 1)] });
    LineManager.addLines(DEFS.LINETYPES.SOLID, "worldZRef", [[0, 0, 0], [0, 0, 5]], { colors: [new BABYLON.Color4(0, 0, 1, 1), new BABYLON.Color4(0, 0, 1, 1)] });
}

/*
*   Handle Window change events
*/
function handleWindowEvents() {
    window.addEventListener("resize", function () {
        SystemManager.getEngine().resize();
    });
}

initialise("renderCanvas");
setupScene();
run();
handleWindowEvents();

// * TODOs: Wireframe Modes
// * TODO: Debug mode