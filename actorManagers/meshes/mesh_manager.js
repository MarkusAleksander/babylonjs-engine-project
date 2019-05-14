import { MESHSHAPES } from '../../DEFS/defs.js';

const MeshManager = (function MeshManager() {

    const meshes = [],
        materials = [],
        textures = [];

    const _actionList = [];

    var _isInitialised = false,
        _sceneManagerRef;


    // * ------------- */
    // *  MESH CREATION
    // * ------------- */


    /*
    * Create a simple mesh from BABYLON
    * PRIVATE
    * type: DEF.MESHSHAPES
    * name: String
    * options: Object describing mesh
    */
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

    /*
    * Create a manageable simple mesh object
    * PRIVATE
    * type: DEF.MESHSHAPES
    * name: String
    * options: Object describing mesh
    */
    function _createSimpleMeshObject(type, name, options) {
        return {
            name: name,
            type: type,
            mesh: _createSimpleMesh(type, name, options),
        }
    }

    /*
    * Create a manageable compound mesh object
    * PRIVATE
    TODO: Build function
    */
    function _createCompoundMeshObject() {
        // * Create compound mesh from simple meshes
    }

    /*
    * Add a simple mesh object
    * PUBLIC
    * type: DEF.MESHSHAPES
    * name: String
    * options: Object describing mesh
    */
    function _addSimpleMesh(type, name, options) {
        if (!_isInitialised) return;

        if (_getMesh(name) == undefined) {
            meshes.push(_createSimpleMeshObject(type, name, options));
        }
    }

    /*
    * Add a compound mesh object
    * PUBLIC
    TODO: Build function
    */
    function _addCompoundMesh() {
        // * Add a compound mesh
    }


    // * ------------- */
    // *  MESH MANIPULATION
    // * ------------- */


    /*
    * Get a mesh objecy by name
    * PUBLIC
    * name: String
    TODO: Should be private?
    */
    function _getMesh(name) {
        if (!_isInitialised) return;

        return meshes.find(function findMeshByName(el) {
            return el.name == name;
        });
    }

    /*
    * Move a mesh object based on World Axis
    * PRIVATE
    * name: String
    * newPos: Object {x, y, z}
    */
    function _moveMeshAbsolutely(name, newPos = {}) {
        let mesh = _getMesh(name);

        if (!mesh) return;

        mesh.position.x = newPos.x != undefined ? newPos.x : mesh.position.x;
        mesh.position.y = newPos.y != undefined ? newPos.y : mesh.position.y;
        mesh.position.z = newPos.z != undefined ? newPos.z : mesh.position.z;
    }

    /*
    * Move a mesh object based on Local Axis
    * PRIVATE
    * name: String
    * newPos: Object {x, y, z}
    */
    function _moveMeshRelatively(name, newPos = {}) {
        let mesh = _getMesh(name);

        if (!mesh) return;

        mesh.position.x = mesh.position.x + newPos.x;
        mesh.position.y = mesh.position.y + newPos.y;
        mesh.position.z = mesh.position.z + newPos.z;
    }

    /*
    * Rotate a mesh object based on World Rotation
    * PRIVATE
    * name: String
    * rotation: Object {x, y, z}
    */
    function _rotateMeshToWorldAxis(name, rotation = {}) {
        let mesh = _getMesh(name);

        if (!mesh) return;

        mesh.rotation.x = rotation.x != undefined ? rotation.x : 0;
        mesh.rotation.y = rotation.y != undefined ? rotation.y : 0;
        mesh.rotation.z = rotation.z != undefined ? rotation.z : 0;
    }

    /*
    * Rotate a mesh object based on Local Rotation
    * PRIVATE
    * name: String
    * rotation: Object {x, y, z}
    */
    function _rotateMeshToLocalAxis(name, rotation) {
        let mesh = _getMesh(name);

        if (!mesh) return;

        let localRotation = [
            rotation.x != undefined ? rotation.x : 0,
            rotation.y != undefined ? rotation.y : 0,
            rotation.z != undefined ? rotation.z : 0
        ]
        mesh.addRotation(...localRotation);
    }

    /*
    * Scale a mesh object
    * PRIVATE
    * name: String
    * scaling: Object {x, y, z}
    */
    function _scaleMesh(name, scaling) {
        let mesh = _getMesh(name);

        if (!mesh) return;

        mesh.scaling.x = scaling.x != undefined ? scaling.x : mesh.scaling.x;
        mesh.scaling.y = scaling.y != undefined ? scaling.y : mesh.scaling.y;
        mesh.scaling.z = scaling.z != undefined ? scaling.z : mesh.scaling.z;
    }


    // * ------------- */
    // *  MESH MANAGEMENT
    // * ------------- */


    /*
    * Add an action to the Mesh Mangement updater
    * PUBLIC
    * actionType: DEFS.ACTIONTYPES
    * name: String
    * options: Object
    */
    function _addAction(actionType, name, options) {
        _actionList.push({
            actionType: actionType,
            name: name,
            options: options
        })
    }

    /*
    * Process the action list
    * PRIVATE
    */
    function _processActionList() {
        while (_actionList.length > 0) {
            _actionList.shift();
        }
    }

    /*
    * Update the Mesh Manager
    * PUBLIC
    */
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

        addSimpleMesh: _addSimpleMesh,
        addCompoundMesh:_addCompoundMesh,

        getMesh: _getMesh,

        addAction: _addAction,
        update: _update,
        initialise: _init,
    }
})();

export default MeshManager;