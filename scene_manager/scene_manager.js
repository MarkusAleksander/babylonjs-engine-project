import * as DEFS from '../DEFS/defs.js';
/*
 * Handle scene actors
*/
const _sceneManager = (function () {

    var _isInitialised = false;

    var _sceneObject;

    function _renderScene() {
        _sceneObject.render();
    }

    function _createScene(engine) {
        _sceneObject = new BABYLON.Scene(engine);
    }

    function _getScene() {
        return _sceneObject;
    }

    function _createMaterial(name, options = {}) {
        let material = new BABYLON.StandardMaterial(name, _systemManagerRef.getScene());

        material.diffuseColor = options.diffuseColor != undefined ? options.diffuseColor : material.diffuseColor;
        material.specularColor = options.specularColor != undefined ? options.specularColor : material.specularColor;
        material.emissiveColor = options.emissiveColor != undefined ? options.emissiveColor : material.emissiveColor;
        material.ambientColor = options.ambientColor != undefined ? options.ambientColor : material.ambientColor;

        materials.push({ name: name, material: material });
    }

    function _getMaterial(name) {
        let material = materials.find(function findMaterialByName(el) {
            return el.name == name;
        });
        return material.material;
    }

    function _applyMaterial(actorName, matName) {
        let actor = _getMeshActor(actorName);
        let material = _getMaterial(matName);

        actor.material = material;
    }

    function _createTexture(name, options = {}) {
        let texture = new BABYLON.StandardMaterial(name, _systemManagerRef.getScene());

        texture.diffuseTexture = options.diffuseTexture != undefined ? new BABYLON.Texture(options.diffuseTexture, _systemManagerRef.getScene()) : texture.diffuseTexture;
        texture.specularTexture = options.specularTexture != undefined ? new BABYLON.Texture(options.specularTexture, _systemManagerRef.getScene()) : texture.specularTexture;
        texture.emissiveTexture = options.emissiveTexture != undefined ? new BABYLON.Texture(options.emissiveTexture, _systemManagerRef.getScene()) : texture.emissiveTexture;
        texture.ambientTexture = options.ambientTexture != undefined ? new BABYLON.Texture(options.ambientTexture, _systemManagerRef.getScene()) : texture.ambientTexture;
        texture.alpha = options.alpha != undefined ? options.alpha : 1;
        texture.diffuseTexture.hasAlpha = options.hasAlpha != undefined ? options.hasAlpha : false;

        textures.push({ name: name, texture: texture });
    }

    function _getTexture(name) {
        let texture = textures.find(function findMaterialByName(el) {
            return el.name == name;
        });
        return texture.texture;
    }

    function _applyTexture(actorName, texName) {
        let actor = _getMeshActor(actorName);
        let texture = _getTexture(texName);

        actor.material = texture;
    }

    function _init() {
        _isInitialised = true;
    }

    return {

        initialise: _init,
        createScene: _createScene,
        getScene: _getScene,
        renderScene: _renderScene,

        createMaterial: _createMaterial,
        createTexture: _createTexture,
        applyMaterial: _applyMaterial,
        applyTexture: _applyTexture
        // getMeshActor: _getMeshActor
    }

})();

export default _sceneManager;