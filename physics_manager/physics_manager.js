import * as DEFS from '../DEFS/defs.js';

/*
* Handle Physics
*/

const _physicsManager = (function() {

    var _isInitialised = false;

    var _sceneManagerRef,
        _physicsPlugin = null;

    function _enablePhysics(gravityVec) {
        if(!_isInitialised) return;

        _sceneManagerRef.getScene().enablePhysics(gravityVec, _physicsPlugin);

        //_sceneManagerRef.gravity = gravityVec;
        //_sceneManagerRef.collisionsEnabled = true;
    }

    function _init(sceneManager) {
        if(sceneManager) {
            _sceneManagerRef = sceneManager;
            _physicsPlugin = new BABYLON.CannonJSPlugin();
            _isInitialised = true;
        }
    }

    return {
        initialise: _init,
        enablePhysics: _enablePhysics
    }

})();

export default _physicsManager;