import * as DEFS from '../DEFS/defs.js';
/*
 * Handle scene actors
*/
const _sceneManager = (function () {

    var _isInitialised = false;
    const actors = {
        meshes: [],
    };
    const materials = [];
    const textures = [];

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


    function _addSimpleMesh(meshName, type, options) {
        actors.meshes.push({ name: meshName, actor: _createSimpleMesh(meshName, type, options) });
    }

    function _getMeshActor(name) {
        let actor = actors.meshes.find(function findMeshByName(el) {
            return el.name == name;
        });
        return actor.actor;
    }

    function _moveMeshActorAbsolutely(name, newPos = {}) {
        let actor = _getMeshActor(name);
        actor.position.x = newPos.x != undefined ? newPos.x : actor.position.x;
        actor.position.y = newPos.y != undefined ? newPos.y : actor.position.y;
        actor.position.z = newPos.z != undefined ? newPos.z : actor.position.z;
    }

    function _moveMeshActorRelatively(name, newPos = {}) {
        let actor = _getMeshActor(name);
        actor.position.x = actor.position.x + newPos.x;
        actor.position.y = actor.position.y + newPos.y;
        actor.position.z = actor.position.z + newPos.z;
    }

    function _rotateMeshActorToWorldAxis(name, rotation = {}) {
        let actor = _getMeshActor(name);
        actor.rotation.x = rotation.x != undefined ? rotation.x : 0;
        actor.rotation.y = rotation.y != undefined ? rotation.y : 0;
        actor.rotation.z = rotation.z != undefined ? rotation.z : 0;
    }

    function _rotateMeshActorToLocalAxis(name, rotation = {}) {
        let actor = _getMeshActor(name);
        let localRotation = [
            rotation.x != undefined ? rotation.x : 0,
            rotation.y != undefined ? rotation.y : 0,
            rotation.z != undefined ? rotation.z : 0
        ]
        actor.addRotation(...localRotation);
    }

    function _scaleMeshActor(name, scaling = {}) {
        let actor = _getMeshActor(name);
        actor.scaling.x = scaling.x != undefined ? scaling.x : actor.scaling.x;
        actor.scaling.y = scaling.y != undefined ? scaling.y : actor.scaling.y;
        actor.scaling.z = scaling.z != undefined ? scaling.z : actor.scaling.z;
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

        addSimpleMesh: _addSimpleMesh,

        moveMeshActorAbsolutely: _moveMeshActorAbsolutely,
        moveMeshActorRelatively: _moveMeshActorRelatively,
        rotateMeshActorToWorldAxis: _rotateMeshActorToWorldAxis,
        rotateMeshActorToLocalAxis: _rotateMeshActorToLocalAxis,
        scaleMeshActor: _scaleMeshActor,

        createMaterial: _createMaterial,
        createTexture: _createTexture,
        applyMaterial: _applyMaterial,
        applyTexture: _applyTexture
        // getMeshActor: _getMeshActor
    }

})();

export default _sceneManager;