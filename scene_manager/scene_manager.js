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

    function _registerFunctionBeforeFrameRender (update) {
        _sceneObject.registerBeforeRender(update);
    }

    function _addLogicBeforeRender (update) {
        _updateBeforeRenderList.push(_sceneObject.onBeforeStepObservable.add(update));
    }

    function _addLogicAfterRender (update) {
        _updateAfterRenderList.push(_sceneObject.onAfterStepObservable.add(update));
    }

    function _clearLogicBeforeRenderList () {
        _updateBeforeRenderList.length = 0;
        _sceneObject.onBeforeStepObservable.clear();
    }

    function _clearLogicAfterRenderList () {
        _updateAfterRenderList.length = 0;
        _sceneObject.onAfterStepObservable.clear();
    }


    return {
        initialise: _init,
        createScene: _createScene,
        getScene: _getScene,
        renderScene: _renderScene,

        addLogicBeforeRender:_addLogicBeforeRender,
        addLogicAfterRender: _addLogicAfterRender,
        clearLogicBeforeRenderList: _clearLogicBeforeRenderList,
        clearLogicAfterRenderList: _clearLogicAfterRenderList,

        registerFunctionBeforeFrameRender: _registerFunctionBeforeFrameRender
    }

})();

export default _sceneManager;