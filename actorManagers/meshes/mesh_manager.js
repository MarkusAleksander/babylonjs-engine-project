import { MESHSHAPES, ACTIONTYPES } from '../../DEFS/defs.js';

const MeshManager = (function MeshManager() {

    const _meshes = [],
        _materials = [],
        _textures = [];

    const _actionList = [];

    var _isInitialised = false,
        _sceneManagerRef;

    const STATUS = {
        IDLE: 'idle',
        MOVING: 'moving',
        FALLING: 'falling'
    }

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
        if (!_isInitialised) return;

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
            status: STATUS.IDLE,

            moveAbsolutely: function (newPos) {
                this.mesh.position.x = newPos.x != undefined ? newPos.x : this.mesh.position.x;
                this.mesh.position.y = newPos.y != undefined ? newPos.y : this.mesh.position.y;
                this.mesh.position.z = newPos.z != undefined ? newPos.z : this.mesh.position.z;
            },
            moveRelatively: function (newPos) {
                this.mesh.position.x = this.mesh.position.x + (newPos.x != undefined ? newPos.x : 0);
                this.mesh.position.y = this.mesh.position.y + (newPos.y != undefined ? newPos.y : 0);
                this.mesh.position.z = this.mesh.position.z + (newPos.z != undefined ? newPos.z : 0);
            }

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
            _meshes.push(_createSimpleMeshObject(type, name, options));
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

        return _meshes.find(function findMeshByName(el) {
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
        let meshObj = _getMesh(name);

        if (meshObj) meshObj.moveAbsolutely(newPos);
    }

    /*
    * Move a mesh object based on Local Axis
    * PRIVATE
    * name: String
    * newPos: Object {x, y, z}
    */
    function _moveMeshRelatively(name, newPos = {}) {
        let meshObj = _getMesh(name);

        if (meshObj) meshObj.moveRelatively(newPos);
    }

    /*
    * Rotate a mesh object based on World Rotation
    * PRIVATE
    * name: String
    * rotation: Object {x, y, z}
    */
    function _rotateMeshToWorldAxis(name, rotation = {}) {
        let meshObj = _getMesh(name);

        if (!meshObj) return;

        meshObj.mesh.rotation.x = rotation.x != undefined ? rotation.x : 0;
        meshObj.mesh.rotation.y = rotation.y != undefined ? rotation.y : 0;
        meshObj.mesh.rotation.z = rotation.z != undefined ? rotation.z : 0;
    }

    /*
    * Rotate a mesh object based on Local Rotation
    * PRIVATE
    * name: String
    * rotation: Object {x, y, z}
    */
    function _rotateMeshToLocalAxis(name, rotation) {
        let meshObj = _getMesh(name);

        if (!meshObj) return;

        let localRotation = [
            rotation.x != undefined ? rotation.x : 0,
            rotation.y != undefined ? rotation.y : 0,
            rotation.z != undefined ? rotation.z : 0
        ]
        meshObj.mesh.addRotation(...localRotation);
    }

    /*
    * Scale a mesh object
    * PRIVATE
    * name: String
    * scaling: Object {x, y, z}
    */
    function _scaleMesh(name, scaling) {
        let meshObj = _getMesh(name);

        if (!meshObj) return;

        meshObj.mesh.scaling.x = scaling.x != undefined ? scaling.x : meshObj.mesh.scaling.x;
        meshObj.mesh.scaling.y = scaling.y != undefined ? scaling.y : meshObj.mesh.scaling.y;
        meshObj.mesh.scaling.z = scaling.z != undefined ? scaling.z : meshObj.mesh.scaling.z;
    }


    // * ------------- */
    // *  MATERIALS AND TEXTURES
    // * ------------- */


    /*
    * Create a Material from Babylon
    * PRIVATE
    * name: String
    * options: Object
    */
    function _createMaterial(name, options) {
        let material = new BABYLON.StandardMaterial(name, _sceneManagerRef.getScene());

        material.diffuseColor = options.diffuseColor != undefined ? options.diffuseColor : material.diffuseColor;
        material.specularColor = options.specularColor != undefined ? options.specularColor : material.specularColor;
        material.emissiveColor = options.emissiveColor != undefined ? options.emissiveColor : material.emissiveColor;
        material.ambientColor = options.ambientColor != undefined ? options.ambientColor : material.ambientColor;
        material.alpha = options.alpha != undefined ? options.alpha : 1;
        material.pointsCloud = options.pointsCloud != undefined ? options.pointsCloud : material.pointsCloud;

        return material;
    }

    /*
    * Create a Texture from Babylon
    * PRIVATE
    * name: String
    * options: Object
    */
    function _createTexture(name, options) {
        let texture = new BABYLON.StandardMaterial(name, _sceneManagerRef.getScene());

        texture.diffuseTexture = options.diffuseTexture != undefined ? new BABYLON.Texture(options.diffuseTexture, _sceneManagerRef.getScene()) : texture.diffuseTexture;
        texture.diffuseTexture.hasAlpha = options.hasAlpha != undefined ? options.hasAlpha : false;

        texture.diffuseTexture.uScale = options.uScale != undefined ? options.uScale : texture.diffuseTexture.uScale;
        texture.diffuseTexture.vScale = options.vScale != undefined ? options.vScale : texture.diffuseTexture.vScale;
        texture.diffuseTexture.uOffset = options.uOffset != undefined ? options.uOffset : texture.diffuseTexture.uOffset;
        texture.diffuseTexture.vOffset = options.vOffset != undefined ? options.vOffset : texture.diffuseTexture.vOffset;

        texture.specularTexture = options.specularTexture != undefined ? new BABYLON.Texture(options.specularTexture, _sceneManagerRef.getScene()) : texture.specularTexture;
        texture.emissiveTexture = options.emissiveTexture != undefined ? new BABYLON.Texture(options.emissiveTexture, _sceneManagerRef.getScene()) : texture.emissiveTexture;
        texture.ambientTexture = options.ambientTexture != undefined ? new BABYLON.Texture(options.ambientTexture, _sceneManagerRef.getScene()) : texture.ambientTexture;
        texture.alpha = options.alpha != undefined ? options.alpha : 1;
        texture.backFaceCulling = options.backFaceCulling != undefined ? options.backFaceCulling : texture.backFaceCulling;
        texture.opacityTexture = options.opacityTexture != undefined ? new BABYLON.Texture(options.opacityTexture, _sceneManagerRef.getScene()) : texture.opacityTexture;

        texture.bumpTexture = options.bumpTexture != undefined ? new BABYLON.Texture(options.bumpTexture, _sceneManagerRef.getScene()) : texture.bumpTexture;

        return texture;
    }

    /*
    * Add a Material object
    * PUBLIC
    * name: String
    * options: Object
    */
    function _addMaterial(name, options) {
        if (!_isInitialised) return;

        if (_getMaterial(name) == undefined) {
            _materials.push({
                name: name,
                options: options,
                material: _createMaterial(name, options)
            });
        }
    }

    /*
    * Add a Texture object
    * PUBLIC
    * name: String
    * options: Object
    */
    function _addTexture(name, options) {
        if (!_isInitialised) return;

        if (_getTexture(name) == undefined) {
            _textures.push({
                name: name,
                options: options,
                texture: _createTexture(name, options)
            });
        }
    }

    /*
    * Apply a material to a material
    * PUBLIC
    * materialName: String
    * meshName: String
    */
    function _applyMaterial(materialName, meshName) {
        let materialObj = _getMaterial(materialName),
            meshObj = _getMesh(meshName);

        if (!materialObj || !meshObj) return;

        meshObj.mesh.material = materialObj.material;
    }

    /*
    * Apply a texture to a material
    * PUBLIC
    * textureName: String
    * meshName: String
    */
    function _applyTexture(textureName, meshName) {
        let textureObj = _getTexture(textureName),
            meshObj = _getMesh(meshName);

        if (!textureObj || !meshObj) return;

        meshObj.mesh.material = textureObj.texture;
    }

    /*
    * Get a material object by name
    * PRIVATE
    * name: String
    */
    function _getMaterial(name) {
        if (!_isInitialised) return;

        return _materials.find(function findMaterialByName(el) {
            return el.name == name;
        })
    }

    /*
    * Get a texture object by name
    * PRIVATE
    * name: String
    */
    function _getTexture(name) {
        if (!_isInitialised) return;

        return _textures.find(function findTextureByName(el) {
            return el.name == name;
        });
    }


    // * ------------- */
    // *  MESH MANAGEMENT
    // * ------------- */

    /*
    * Action Dispatch Table
    */
    var _actionDispatchTable = {
        [ACTIONTYPES.MOVERELATIVE]: _moveMeshRelatively,
        [ACTIONTYPES.MOVEABSOLUTE]: _moveMeshAbsolutely,
        [ACTIONTYPES.ROTATETOWORLD]: _rotateMeshToWorldAxis,
        [ACTIONTYPES.ROTATETOLOCAL]: _rotateMeshToLocalAxis,
        [ACTIONTYPES.SCALE]: _scaleMesh,
        default: function () {/* * empty default function */ }
    };

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
            let action = _actionList.shift();
            _actionDispatchTable.hasOwnProperty(action.actionType)
                ? _actionDispatchTable[action.actionType](action.name, action.options)
                : _actionDispatchTable['default']();
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
        addCompoundMesh: _addCompoundMesh,

        getMesh: _getMesh,

        addAction: _addAction,
        update: _update,
        initialise: _init,

        addMaterial: _addMaterial,
        addTexture: _addTexture,
        applyMaterial: _applyMaterial,
        applyTexture: _applyTexture
    }
})();

export default MeshManager;