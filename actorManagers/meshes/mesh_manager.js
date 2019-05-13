import { MESHSHAPES } from '../../DEFS/defs.js';

const MeshManager = (function MeshManager() {

    const meshes = [],
        materials = [],
        textures = [];

    const actionList = [];

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

    // *****

    function _moveMeshAbsolutely(name, newPos) {
        let mesh = _getMesh(name);
        mesh.position.x = newPos.x != undefined ? newPos.x : mesh.position.x;
        mesh.position.y = newPos.y != undefined ? newPos.y : mesh.position.y;
        mesh.position.z = newPos.z != undefined ? newPos.z : mesh.position.z;
    }

    function _moveMeshRelatively(name, newPos) {
        let mesh = _getMesh(name);
        mesh.position.x = mesh.position.x + newPos.x;
        mesh.position.y = mesh.position.y + newPos.y;
        mesh.position.z = mesh.position.z + newPos.z;
    }

    function _rotateMeshToWorldAxis(name, rotation) {
        let mesh = _getMesh(name);
        mesh.rotation.x = rotation.x != undefined ? rotation.x : 0;
        mesh.rotation.y = rotation.y != undefined ? rotation.y : 0;
        mesh.rotation.z = rotation.z != undefined ? rotation.z : 0;
    }

    function _rotateMeshToLocalAxis(name, rotation) {
        let mesh = _getMesh(name);
        let localRotation = [
            rotation.x != undefined ? rotation.x : 0,
            rotation.y != undefined ? rotation.y : 0,
            rotation.z != undefined ? rotation.z : 0
        ]
        mesh.addRotation(...localRotation);
    }

    function _scaleMesh(name, scaling) {
        let mesh = _getMesh(name);
        mesh.scaling.x = scaling.x != undefined ? scaling.x : mesh.scaling.x;
        mesh.scaling.y = scaling.y != undefined ? scaling.y : mesh.scaling.y;
        mesh.scaling.z = scaling.z != undefined ? scaling.z : mesh.scaling.z;
    }

    function _addAction(actionType, mesh, options) { }

    function _processActionList() {
        while (actionList.length > 0) {
            actionList.shift();
        }
    }

    function _update() {
        // * Do update here
        _processActionList();
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
        update: _update,

        addSimpleMesh: _addSimpleMesh,

        getMesh: _getMesh
    }
})();

export default MeshManager;