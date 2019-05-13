/*
 * Handle and Manage System Critical elements
 * - Canvas
 * - Babylon Engine
*/
var _systemManager = (function() {

    var _canvas = null,
        _engine = null,
        _sceneManager = null, // ? Is this even needed?
        _isInitialised = false;

    // function _getCanvas () {
    //     return isReady ? canvas : (console.log('Engine not initialised!'), null);
    // }

    // function _getEngine () {
    //     return isReady ? engine : (console.log('Engine not initialised!'), null);
    // }

    // function _ () {
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

    function _getCanvas () {
        return _canvas
    }

    /*
    * Initialise with CanvasID
    * PUBLIC
    * canvasId: String
    */
    function _init (canvasId) {
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
        registerSceneManager: _registerSceneManager,

        // getCanvas: _getCanvas,
        // getEngine: _getEngine,
        //getScene: _getScene,
        // render: _render
    }

})();

export default _systemManager;