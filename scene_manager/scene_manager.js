import * as DEFS from '../DEFS/defs.js';
/*
 * Handle scene actors
*/
const _sceneManager = (function () {

    var _isInitialised = false;

    var _sceneObject;

    function _renderScene() {
        if(!_isInitialised) return
        ;
        _sceneObject.render();
    }

    function _createScene(engine) {
        if(!_isInitialised) return;

        _sceneObject = new BABYLON.Scene(engine);
    }

    function _getScene() {
        if(!_isInitialised) return null;
        return _sceneObject;
    }

    function _init() {
        _isInitialised = true;
    }

    return {
        initialise: _init,
        createScene: _createScene,
        getScene: _getScene,
        renderScene: _renderScene,
    }

})();

export default _sceneManager;