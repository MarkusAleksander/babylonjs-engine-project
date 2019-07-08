const AnimationManager = (function AnimationManager() {

    const _animations = [];

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

    function _createAnimation(animationData) {
        if(animationData.type == "rotation") {
            return function () {
                this.rotate(animationData.axis, animationData.fps, animationData.frameReference);
            }
        }
        if(animationData.type == "position") {
            return function (actorObj) {

            }
        }
    }

    function _addAnimationObject(animationName, animationOptions) {
        if (!_isInitialised) return;

        if (!_getAnimationObject(name)) {
            _animations.push({
                animationName: animationName,
                animation: _createAnimation(animationOptions)
            });
            //_animations.push(_createAnimationObject(name, animationOptions));
        }

        //let animation = _getAnimationObject(name);
        //debugger;
        //animation.animation.setKeys(animationOptions.keys);
    }

    function _getAnimationObject(name) {
        if (!_isInitialised) return;

        return _animations.find(function findAnimationObjectByName(el) {
            return el.animationName == name;
        });
    }

    function _addAnimationToMesh(meshObject, animationName) {
        if (!_isInitialised) return;

        let animationObj = _getAnimationObject(animationName);

        animationObj.animation = animationObj.animation.bind(meshObject);
        // let meshObj = _meshManagerRef.getMeshInterface(meshName);

        //meshObject.animations.push(animationObj.animation);

        //_sceneManagerRef.getScene().beginAnimation(meshObject, 0, 100, true);
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

        _animations.forEach((animation) => {
            _sceneManagerRef.registerFunctionBeforeFrameRender(() => {
                animation.animation();
            })
        });

        // for (let i = 0; i < _animations.length; i++) {
        //     if (_animations[i].meshName) {
        //         let mesh = _meshManagerRef.getMeshInterface(_animations[i].meshName);

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