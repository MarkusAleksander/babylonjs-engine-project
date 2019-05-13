/*
 * Handle and Manage System Critical elements
 * - Canvas
 * - Babylon Engine
*/
var _systemManager = (function() {

    var canvas = null,
        _engine = null,
        _sceneManager = null, // ? Is this even needed?
        _isInitialised = false;

    // function _getCanvas () {
    //     return isReady ? canvas : (console.log('Engine not initialised!'), null);
    // }

    // function _getEngine () {
    //     return isReady ? engine : (console.log('Engine not initialised!'), null);
    // }

    // function _render () {
    //     _engine.runRenderLoop(_sceneManager.renderScene);
    // }

    /*
    * Initialise with CanvasID
    * PUBLIC
    * sceneManager: SceneManager
    */
    function _registerSceneManager (sceneManager) {
        // ? Is this even needed?
        if(!_isInitialised) return;

        _sceneManager = sceneManager;
    }

    function _getEngine () {
        return _engine;
    }

    /*
    * Initialise with CanvasID
    * PUBLIC
    * canvasId: String
    */
    function _init (canvasId) {
        // * Get canvas
        canvas = document.getElementById(canvasId);
        // * Create Babylon Engine
        canvas ? (_engine = new BABYLON.Engine(canvas, true)) : console.log('No canvas');

        _isInitialised = Boolean(canvas) && Boolean(_engine);
    }

    return {
        initialise: _init,
        getEngine: _getEngine,
        registerSceneManager: _registerSceneManager,

        // getCanvas: _getCanvas,
        // getEngine: _getEngine,
        //getScene: _getScene,
        // render: _render
    }

})();

export default _systemManager;