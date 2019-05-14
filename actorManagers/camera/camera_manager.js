import { CAMERATYPES } from '../../DEFS/defs.js';

const CameraManager = (function CameraManager() {

    var _camera = null,
        _isInitialised = false,
        _sceneManagerRef;

    /*
    * Create a camera from BABYLON
    * PRIVATE
    * type: DEF.CAMERATYPES
    * name: String
    * options: Object
    */
    function _createCamera(type, name, options) {
        if (!_isInitialised && _camera) return;

        switch (type) {
            case CAMERATYPES.ARCROTATE:
                return new BABYLON.ArcRotateCamera(name, options.alpha, options.beta, options.radius, options.position, _sceneManagerRef.getScene());
            case CAMERATYPES.FOLLOW:
                // TODO
                return new BABYLON.FollowCamera(name, options.position, _sceneManagerRef.getScene());
            case CAMERATYPES.FLY:
                return new BABYLON.FlyCamera(name, options.position, _sceneManagerRef.getScene());
            case CAMERATYPES.UNIVERSAL:
                return new BABYLON.UniversalCamera(name, options.position, _sceneManagerRef.getScene());
            default:
                return new BABYLON.UniversalCamera(name, options.position, _sceneManagerRef.getScene());
        }
    }

    /*
    * Create a manageable camera object
    * PUBLIC
    * type: DEF.MESHSHAPES
    * name: String
    * options: Object
    */
    function _createCameraObject(type, name, options) {
        _camera = {
            name: name,
            type: type,
            options: options,
            camera: _createCamera(type, name, options)
        };
    }

    function _destroyCamera() {
        // TODO
    }

    /*
    * Set position of camera
    * PUBLIC
    * position: Object
    */
    function _setCameraPosition(position) {
        if (!_camera) return;

        if (_camera.camera.hasOwnProperty('setPosition')) {
            _camera.camera.setPosition(position);
        }
    }

    /*
    * Set position of camera
    * PUBLIC
    * targetPosition: Object
    */
    function _setCameraTarget(targetPosition) {
        if (!_camera) return;

        if (_camera.camera.hasOwnProperty('setTarget')) {
            _camera.camera.setTarget(targetPosition);
        }
    }
    /*
    * Attach camera to scene
    * PUBLIC
    * canvas: CanvasElement
    */
    function _attachToCanvas(canvas) {
        if (!_camera) return;

        _camera.camera.attachControl(canvas, true);
    }

    /*
    * Get camera
    * PRIVATE
    * position: Object
    */
    function _getCamera() {
        return _camera;
    }

    /*
    * Initialise Camera Manager
    * PRIVATE
    * sceneManager: SceneManager
    */
    function _init(sceneManager) {
        if (sceneManager) {
            _sceneManagerRef = sceneManager;
            _isInitialised = true;
        }
    }

    return {
        initialise: _init,
        createCamera: _createCameraObject,
        setCameraPosition: _setCameraPosition,
        attachToCanvas: _attachToCanvas,
        setTarget: _setCameraTarget
    }

})();

export default CameraManager;