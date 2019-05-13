import { MESHSHAPES } from '../../DEFS/defs.js';

const MeshManager = (function MeshManager() {

    const meshes = [],
        materials = [],
        textures = [];

    var _isInitialised = false,
        _sceneManagerRef;

    function _createSimpleMesh(type, name, options) {

        switch (type) {
            case MESHSHAPES.SPHERE:
                return BABYLON.MeshBuilder.CreateSphere(name, options, _sceneManagerRef.getScene());
            case MESHSHAPES.BOX:
                return BABYLON.MeshBuilder.CreateBox(name, options, _sceneManagerRef.getScene());
            case MESHSHAPES.PLANE:
                return BABYLON.MeshBuilder.CreatePlane(name, options, _sceneManagerRef.getScene());
            case MESHSHAPES.GROUND:
                return BABYLON.MeshBuilder.CreateGround(name, options, _sceneManagerRef.getScene());
            default:
                return BABYLON.MeshBuilder.CreateSphere(name, options, _sceneManagerRef.getScene());
        }
    }

    function _createSimpleMeshObject(type, name, options) {
        return {
            name: name,
            type: type,
            mesh: _createSimpleMesh(type, name, options),
        }
    }

    function _addSimpleMesh(type, name, options) {
        if (!_isInitialised) return;

        if (_getMesh(name) == undefined) {
            meshes.push(_createSimpleMeshObject(type, name, options));
        }
    }

    function _createCompoundMeshObject() { }

    function _addCompoundMesh() { }

    function _getMesh(name) {
        if (!_isInitialised) return;

        return meshes.find(function findMeshByName(el) {
            return el.name == name;
        });
    }

    /*
    * Initialise with Scene Manager
    * PUBLIC
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

        addSimpleMesh: _addSimpleMesh,

        getMesh: _getMesh
    }
})();

export default MeshManager;