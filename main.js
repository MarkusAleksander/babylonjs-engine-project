import * as DEFS from './DEFS/defs.js';

import LightManager from './actorManagers/lights/light_manager.js';
import LineManager from './actorManagers/lines/line_manager.js';
import CameraManager from './actorManagers/camera/camera_manager.js';
import MeshManager from './actorManagers/meshes/mesh_manager.js';
import AnimationManager from './actorManagers/animation/animation_manager.js';
import PhysicsManager from './actorManagers/physics_manager/physics_manager.js';

import SystemManager from './system_manager/system_manager.js';
import SceneManager from './scene_manager/scene_manager.js';

import ActorManager from './actorManagers/ActorManager/ActorManager.js';

import createScene from './scenes/scene_3.js';

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
    SystemManager.registerUpdateFunction(ActorManager.update);
    // SystemManager.registerUpdateFunction(MeshManager.update);
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