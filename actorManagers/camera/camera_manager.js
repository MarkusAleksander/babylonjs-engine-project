const CameraManager = (function CameraManager() {

    var _camera = null,
        _isInitialised = false,
        _sceneManagerRef;

    function _createCamera () {
        if(!_isInitialised) return;

        _camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0,0,0), _sceneManagerRef.getScene());
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
            _createCamera();
        }
    }

    return {
        initialise: _init,
        setCameraPosition: _setCameraPosition,
        attachToCanvas: _attachToCanvas,
        getCamera: _getCamera
    }

})();

export default CameraManager;