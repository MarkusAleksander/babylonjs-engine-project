import * as DEFS from './../../definitions/definitions.js';

/*
* Handle Physics
*/

const _physicsManager = (function () {

    var _isInitialised = false;

    var _sceneManagerRef,
        _physicsPlugin = null,
        _physicsObjects = [];

    function _enablePhysics(gravityVec) {
        if (!_isInitialised) return;

        _sceneManagerRef.getScene().enablePhysics(gravityVec, _physicsPlugin);
        _physicsPlugin.setTimeStep(1 / 60);
    }

    function _init(sceneManager) {
        if (sceneManager) {
            _sceneManagerRef = sceneManager;
            _physicsPlugin = new BABYLON.AmmoJSPlugin(false);
            _isInitialised = true;
        }
    }

    function _getImposter(type) {
        if (!_isInitialised) return;

        switch (type) {
            case DEFS.PHYSICSIMPOSTERS.BOX:
                return BABYLON.PhysicsImpostor.BoxImpostor;
            case DEFS.PHYSICSIMPOSTERS.SPHERE:
                return BABYLON.PhysicsImpostor.SphereImpostor;
            case DEFS.PHYSICSIMPOSTERS.CYLINDER:
                return BABYLON.PhysicsImpostor.CylinderImpostor;
            case DEFS.PHYSICSIMPOSTERS.NOIMPOSTER:
                return BABYLON.PhysicsImpostor.NoImpostor;
            default:
                return BABYLON.PhysicsImpostor.BoxImpostor;
        }
    }

    function _createPhyiscsObject(meshObject, physicsOptions) {
        if (!_isInitialised) return;

        meshObject.physicsImpostor = new BABYLON.PhysicsImpostor(meshObject, _getImposter(physicsOptions.imposter), physicsOptions.options, _sceneManagerRef.getScene());

        // _physicsObjects.push({
        //     meshObject: meshObject,
        //     imposter: physicsOptions.imposter,
        //     physicsOptions: physicsOptions.options
        // });

    }

    function _applyPhysics() {
        _physicsObjects.forEach(function (pO) {
            pO.meshObject.physicsImpostor = new BABYLON.PhysicsImpostor(pO.meshObject, _getImposter(pO.imposter), pO.physicsOptions, _sceneManagerRef.getScene());
        });
    }

    return {
        initialise: _init,
        enablePhysics: _enablePhysics,
        createPhyiscsObject: _createPhyiscsObject,
        applyPhysics: _applyPhysics
    }

})();

export default _physicsManager;