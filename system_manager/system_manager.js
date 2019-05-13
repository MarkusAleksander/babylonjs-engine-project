/*
 * Handle and Manage System Critical elements
 * - Canvas
 * - Babylon Engine
*/
var _systemManager = (function () {

    var _canvas = null,
        _engine = null,
        _isInitialised = false,
        _registeredUpdaters = [];

    function _registerUpdateFunction(func) {
        _registeredUpdaters.push(func);
    }

    function _update() {
        _registeredUpdaters.forEach(function (updater) {
            updater();
        });
    }

    function _runUpdateLoop() {
        _getEngine().runRenderLoop(_update);
    }

    function _getEngine() {
        return _engine;
    }

    function _getCanvas() {
        return _canvas
    }

    /*
    * Initialise with CanvasID
    * PUBLIC
    * canvasId: String
    */
    function _init(canvasId) {
        // * Get canvas
        _canvas = document.getElementById(canvasId);
        // * Create Babylon Engine
        _canvas ? (_engine = new BABYLON.Engine(_canvas, true)) : console.log('No canvas');

        _isInitialised = Boolean(_canvas) && Boolean(_engine);
    }

    return {
        initialise: _init,
        getEngine: _getEngine,
        getCanvas: _getCanvas,
        registerUpdateFunction: _registerUpdateFunction,
        runUpdateLoop: _runUpdateLoop
    }

})();

export default _systemManager;