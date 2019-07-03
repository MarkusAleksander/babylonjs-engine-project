import * as DEFS from '../DEFS/defs.js';
/*
 * Handle scene actors
*/
const _sceneManager = (function () {

    var _isInitialised = false;
    var _sceneObject;

    const _updateBeforeRenderList = [],
        _updateAfterRenderList = [];

    function _renderScene() {
        if(!_isInitialised) return;

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

    function _registerBeforeFrameRender (update) {
        //registerBeforeRender(update);
    }

    function _addUpdateBeforeRender (update) {
        _updateBeforeRenderList.push(_sceneObject.onBeforeStepObservable.add(update));
    }

    function _addUpdateAfterRender (update) {
        _updateAfterRenderList.push(_sceneObject.onAfterStepObservable.add(update));
    }

    function _clearBeforeRenderList () {
        _updateBeforeRenderList.length = 0;
        _sceneObject.onBeforeStepObservable.clear();
    }

    function _clearAfterRenderList () {
        _updateAfterRenderList.length = 0;
        _sceneObject.onAfterStepObservable.clear();
    }


    return {
        initialise: _init,
        createScene: _createScene,
        getScene: _getScene,
        renderScene: _renderScene,

        addUpdateBeforeRender:_addUpdateBeforeRender,
        addUpdateAfterRender: _addUpdateAfterRender,
        clearBeforeRenderList: _clearBeforeRenderList,
        clearAfterRenderList: _clearAfterRenderList
    }

})();

export default _sceneManager;