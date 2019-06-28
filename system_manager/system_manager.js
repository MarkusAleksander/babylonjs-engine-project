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

    /*
    * Attach an update function to be handled by the System Manager
    * PUBLIC
    */
    function _registerUpdateFunction(func) {
        if(!_isInitialised) return;

        _registeredUpdaters.push(func);
    }

    /*
    * Update registered update functions
    * PRIVATE
    */
    function _update() {
        if(!_isInitialised || _registeredUpdaters.length == 0) return;

        _registeredUpdaters.forEach(function (updater) {
            updater();
        });
    }

    /*
    * Run the Engine Loop
    * PUBLIC
    */
    function _runUpdateLoop() {
        if(!_isInitialised) return;

        _getEngine().runRenderLoop(_update);
    }

    /*
    * Get the Engine object
    * PUBLIC
    */
    function _getEngine() {
        if(!_isInitialised) return;

        return _engine;
    }

    /*
    * Get the Canvas object
    * PUBLIC
    */
    function _getCanvas() {
        if(!_isInitialised) return;

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
        _canvas ? (_engine = new BABYLON.Engine(_canvas, true, {
            deterministicLockstep: true,
            lockstepMaxSteps: 4
        })) : console.log('No canvas');

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