const AnimationManager = (function AnimationManager() {

    const _animations = [],
        _animatedMeshes = [];

    var _isInitialised = false,
        _sceneManagerRef,
        _meshManagerRef;

    function _createAnimation(name, animationOptions) {
        return new BABYLON.Animation(
            name,
            animationOptions.property,
            animationOptions.fps,
            animationOptions.type,
            animationOptions.mode
        );
    }

    function _createAnimationObject(name, animationOptions) {
        return {
            name: name,
            animation: _createAnimation(name, animationOptions)
        }
    }

    function _addAnimationObject(name, animationOptions) {
        if (!_isInitialised) return;

        if (!_getAnimationObject(name)) {
            _animations.push(_createAnimationObject(name, animationOptions));
        }

        let animation = _getAnimationObject(name);
        //debugger;
        animation.animation.setKeys(animationOptions.keys);
    }

    function _getAnimationObject(name) {
        if (!_isInitialised) return;

        return _animations.find(function findAnimationObjectByName(el) {
            return el.name == name;
        });
    }

    function _addAnimationToMesh(animationName, meshName) {
        if (!_isInitialised) return;

        let animationObj = _getAnimationObject(animationName);
        let meshObj = _meshManagerRef.getMesh(meshName);

        if (!meshObj.mesh.animations) {
            meshObj.mesh.animations = [];
        }
        meshObj.mesh.animations.push(animationObj.animation);

        _sceneManagerRef.getScene().beginAnimation(meshObj.mesh, 0, 100, true);
        // _animatedMeshes.push(meshName);
    }

    /*
    * Initialise with Scene Manager
    * PUBLIC
    * sceneManager: SceneManager
    */
    function _init(sceneManager, meshManager) {
        if (sceneManager) {
            _sceneManagerRef = sceneManager;
            _meshManagerRef = meshManager;
            _isInitialised = true;
        }
    }

    function _runAnimations() {

        // for (let i = 0; i < _animations.length; i++) {
        //     if (_animations[i].meshName) {
        //         let mesh = _meshManagerRef.getMesh(_animations[i].meshName);

        //         _sceneManagerRef.beginAnimation(mesh.mesh, 0, 100, true);
        //     }
        // }
    }

    return {
        initialise: _init,

        addAnimationObject: _addAnimationObject,
        addAnimationToMesh: _addAnimationToMesh,

        runAnimations: _runAnimations
    }
})();

export default AnimationManager;