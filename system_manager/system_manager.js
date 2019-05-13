import * as DEFS from '../DEFS/defs.js';
/*
 * Handle and Manage System Critical elements
 * - Canvas
 * - Babylon Engine
*/
var _systemManager = (function() {

    var canvas = null,
        engine = null,
        scene = null,
        isReady = false;

    function _getCanvas () {
        return isReady ? canvas : (console.log('Engine not initialised!'), null);
    }

    function _getEngine () {
        return isReady ? engine : (console.log('Engine not initialised!'), null);
    }

    function _getScene () {
        return isReady ? scene : (console.log('Engine not initialised'), null);
    }

    function _renderLoop () {
        scene.render();
    }

    function _render () {
        engine.runRenderLoop(_renderLoop);
    }

    function _init (canvasId) {
        // * Get canvas
        canvas = document.getElementById(canvasId);
        // * Create Babylon Engine
        canvas ? (engine = new BABYLON.Engine(canvas, true)) : console.log('No canvas');
        // * Create the scene space
        engine ? (scene = new BABYLON.Scene(engine)) : console.log('No engine');

        isReady = Boolean(canvas) && Boolean(engine) && Boolean(scene);
    }

    return {
        initialise: _init,
        getCanvas: _getCanvas,
        getEngine: _getEngine,
        getScene: _getScene,
        render: _render
    }

})();

export default _systemManager;