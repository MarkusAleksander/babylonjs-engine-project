import { CAMERATYPES } from '../../DEFS/defs.js';

const CameraManager = (function CameraManager() {

    var _camera = null,
        _isInitialised = false,
        _sceneManagerRef;

    function _createCamera (type, name, options) {
        if(!_isInitialised && _camera) return;

        switch (type) {
            case CAMERATYPES.ARCROTATE:
                _camera = new BABYLON.ArcRotateCamera(name, options.alpha, options.beta, options.radius, options.position, _sceneManagerRef.getScene());
            case CAMERATYPES.FOLLOW:
                _camera = new BABYLON.FollowCamera(name, new BABYLON.Vector3(0, 10, -10), _sceneManagerRef.getScene());
            case CAMERATYPES.FLY:
                _camera = new BABYLON.FlyCamera(name, new BABYLON.Vector3(0, 5, -10), _sceneManagerRef.getScene());
            case CAMERATYPES.UNIVERSAL:
                _camera = new BABYLON.UniversalCamera(name, new BABYLON.Vector3(0, 0, -10), _sceneManagerRef.getScene())
            default:
        }

    }

    function _destroyCamera () {
        // TODO
    }

    function _setCameraPosition (position) {
        _camera.setPosition(position);
    }

    function _attachToCanvas(canvas) {
        _camera.attachControl(canvas, true);
    }

    function _getCamera () {
        return _camera;
    }

    function _init (sceneManager) {
        if(sceneManager) {
            _sceneManagerRef = sceneManager;
            _isInitialised = true;
        }
    }

    return {
        initialise: _init,
        createCamera: _createCamera,
        setCameraPosition: _setCameraPosition,
        attachToCanvas: _attachToCanvas,
        getCamera: _getCamera
    }

})();

export default CameraManager;