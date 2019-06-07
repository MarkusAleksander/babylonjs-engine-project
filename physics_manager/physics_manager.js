import * as DEFS from '../DEFS/defs.js';

/*
* Handle Physics
*/

const _physicsManager = (function() {

    var _isInitialised = false;

    var _sceneManagerRef;

    function _createGravity(gravityVec) {
        _sceneManagerRef.gravity = gravityVec;
        _sceneManagerRef.collisionsEnabled = true;
    }

    function _init(sceneManager) {
        if(sceneManager) {
            _sceneManagerRef = sceneManager;
            _isInitialised = true;
        }
    }

    return {
        initialise: _init,
        createGravity: _createGravity
    }

})();

export default _physicsManager;