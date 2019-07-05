import { MESHSHAPES, ACTIONTYPES } from '../../definitions/definitions.js';

// TODO - Reduce functionality and move Mesh Interface to Actor Manager as an Actor Interface
// TODO - MERGE MESH FUNCTIONALIT

const MeshManager = (function MeshManager() {

    const _meshes = [],
        _materials = [],
        _textures = [],
        _multifaceTextureOptions = [];

    const _actionList = [];

    var _isInitialised = false,
        _sceneManagerRef;

    // TODO
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
    function _createMeshObject(meshObject) {
        if (!_isInitialised) return;

        switch (meshObject.meshShape) {
            case MESHSHAPES.SPHERE:
                return BABYLON.MeshBuilder.CreateSphere(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
            case MESHSHAPES.BOX:
                return BABYLON.MeshBuilder.CreateBox(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
            case MESHSHAPES.PLANE:
                return BABYLON.MeshBuilder.CreatePlane(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
            case MESHSHAPES.GROUND:
                return BABYLON.MeshBuilder.CreateGround(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
            case MESHSHAPES.CYLINDER:
                return BABYLON.MeshBuilder.CreateCylinder(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
            default:
                return BABYLON.MeshBuilder.CreateSphere(meshObject.meshName, meshObject.meshOptions, _sceneManagerRef.getScene());
        }
    }

    /*
    * Add a simple mesh object
    * PUBLIC
    * type: DEF.MESHSHAPES
    * name: String
    * options: Object describing mesh
    */
    function _createMesh(meshObject) {
        if (!_isInitialised) return;

        // *    Check Mesh doesn't already exists then return new mesh
        if (!_getMeshByName(meshObject.meshName)) {
            let newMesh, multifaceOption;

            // * Check if mesh requires multiface option applying
            if (meshObject.multifaceOption) {
                multifaceOption = _createMultfaceOptionObject(meshObject.multifaceOption);
                meshObject.meshOptions.faceUV = multifaceOption.faceUV;
                meshObject.meshOptions.wrap = multifaceOption.wrap;
            }

            newMesh = _createMeshObject(meshObject);
            newMesh.checkCollisions = meshObject.meshOptions.checkCollisions;
            newMesh.receiveShadows = meshObject.meshOptions.receiveShadows;

            return newMesh;
        }

        return null;
    }

    /*
    *   Register Meshes to the MeshManager
    *   PUBLIC
    *   meshObject: Mesh to Register
    */
    function _registerMesh(meshObject) {
        if (!_isInitialised) return;

        _meshes.push({ meshObject: meshObject });
    }

    /*
    * Get a mesh object by name
    * PUBLIC
    * name: String
    */
    function _getMeshByName(name) {
        if (!_isInitialised) return;

        return _meshes.find(function findMeshByName(el) {
            return el.meshObject.name == name;
        });
    }

    /*
    *   Merge Mesh Objects
    *   PUBLIC
    *   meshArray: Array of Meshes to Merge
    *   return compounded Mesh
    */
    function _compoundMeshes(meshArray) {
        let compoundMesh = new BABYLON.Mesh("", _sceneManagerRef.getScene());

        for (let i = 0; i < meshArray.length; i++) {
            compoundMesh.addChild(meshArray[i]);
        }

        return compoundMesh;

        //return BABYLON.Mesh.MergeMeshes(meshArray, true, true, undefined, false, true);
    }


    // * ------------- */
    // *  TEXTURE CREATION
    // * ------------- */

    /*
    *   Create a Texture object
    *   PUBLIC
    *   textureObject: Object describing the texture
    */
    function _createTextureObject(textureObject) {
        if (!_isInitialised) return;

        let texture = new BABYLON.StandardMaterial(textureObject.textureName, _sceneManagerRef.getScene());

        texture.diffuseColor = textureObject.diffuseColor != undefined ? textureObject.diffuseColor : texture.diffuseColor;
        texture.specularColor = textureObject.specularColor != undefined ? textureObject.specularColor : texture.specularColor;
        texture.emissiveColor = textureObject.emissiveColor != undefined ? textureObject.emissiveColor : texture.emissiveColor;
        texture.ambientColor = textureObject.ambientColor != undefined ? textureObject.ambientColor : texture.ambientColor;
        texture.pointsCloud = textureObject.pointsCloud != undefined ? textureObject.pointsCloud : texture.pointsCloud;

        texture.diffuseTexture = textureObject.diffuseTexture != undefined ? new BABYLON.Texture(textureObject.diffuseTexture, _sceneManagerRef.getScene()) : texture.diffuseTexture;

        if (texture.diffuseTexture) {
            texture.diffuseTexture.hasAlpha = textureObject.hasAlpha != undefined ? textureObject.hasAlpha : false;
            texture.diffuseTexture.uScale = textureObject.uScale != undefined ? textureObject.uScale : texture.diffuseTexture.uScale;
            texture.diffuseTexture.vScale = textureObject.vScale != undefined ? textureObject.vScale : texture.diffuseTexture.vScale;
            texture.diffuseTexture.uOffset = textureObject.uOffset != undefined ? textureObject.uOffset : texture.diffuseTexture.uOffset;
            texture.diffuseTexture.vOffset = textureObject.vOffset != undefined ? textureObject.vOffset : texture.diffuseTexture.vOffset;
        }

        texture.specularTexture = textureObject.specularTexture != undefined ? new BABYLON.Texture(textureObject.specularTexture, _sceneManagerRef.getScene()) : texture.specularTexture;
        texture.emissiveTexture = textureObject.emissiveTexture != undefined ? new BABYLON.Texture(textureObject.emissiveTexture, _sceneManagerRef.getScene()) : texture.emissiveTexture;
        texture.ambientTexture = textureObject.ambientTexture != undefined ? new BABYLON.Texture(textureObject.ambientTexture, _sceneManagerRef.getScene()) : texture.ambientTexture;
        texture.alpha = textureObject.alpha != undefined ? textureObject.alpha : 1;
        texture.backFaceCulling = textureObject.backFaceCulling != undefined ? textureObject.backFaceCulling : texture.backFaceCulling;
        texture.opacityTexture = textureObject.opacityTexture != undefined ? new BABYLON.Texture(textureObject.opacityTexture, _sceneManagerRef.getScene()) : texture.opacityTexture;

        texture.bumpTexture = textureObject.bumpTexture != undefined ? new BABYLON.Texture(textureObject.bumpTexture, _sceneManagerRef.getScene()) : texture.bumpTexture;
        return texture;
    }

    /*
    *   Create Texture
    *   PUBLIC
    *   textureObject: object describing the texture
    */
    function _createTexture(textureObject) {
        if (!_isInitialised) return;

        // *    Check texture doesn't already exist then return new texture
        if (!_getTextureByName(textureObject.textureName)) {
            return _createTextureObject(textureObject);
        }

        return null;
    }

    /*
    *   Register Texture to the MeshManager
    *   PUBLIC
    *   textureObject: textureObject to Register
    */
    function _registerTexture(textureObject) {
        if (!_isInitialised) return;

        _textures.push({ textureObject: textureObject });
    }

    /*
    * Get a texture object by name
    * PRIVATE
    * name: String
    */
    function _getTextureByName(name) {
        if (!_isInitialised) return;

        return _textures.find(function findTextureByName(el) {
            return el.textureObject.name == name;
        });
    }

    /*
    *   Apply a texture to a material before registration
    *   PUBLIC
    *   meshObject: Mesh Object
    *   textureObject: Texture Object
    */
    function _applyTextureByObject(meshObject, textureObject) {
        // TODO - Overrides previous mesh textures - could they be blended?

        if (!textureObject || !meshObject) return;

        meshObject.material = textureObject;
    }

    /*
    *   Apply a texture to a material after registration
    *   PUBLIC
    *   meshName: String
    *   textureName: String
    */
    function _applyTextureByName(meshName, textureName) {
        let textureObject = _getTextureByName(textureName),
            meshObject = _getMeshByName(meshName);

        if (!textureObject || !meshObject) return;

        meshObject.material = textureObject.texture;
    }

    /*
    * Add a multiface texture obkect
    * PRIVATE
    * name: String,
    * options: Object
    * cols: int,
    * rows: int,
    * faces: array of [col, row]
    */
    function _createMultfaceOptionObject(multifaceOptions) {

        let faceUV = new Array(multifaceOptions.faces.length),
            colDivision = 1 / multifaceOptions.cols,
            rowDivision = 1 / multifaceOptions.rows;

        for (let i = 0; i < multifaceOptions.faces.length; i++) {
            faceUV[i] = new BABYLON.Vector4(
                multifaceOptions.faces[i][0] * colDivision,
                multifaceOptions.faces[i][1] * rowDivision,
                (multifaceOptions.faces[i][0] + 1) * colDivision,
                (multifaceOptions.faces[i][1] + 1) * rowDivision
            );
        }

        return {
            faceUV: faceUV,
            wrap: multifaceOptions.wrap
        };
    }


    // * ------------- */
    // *  MESH MANIPULATION
    // * ------------- */


    function _setMeshPosition(meshObject, newPos = {}) {
        if (!_isInitialised || !meshObject) return;

        meshObject.position = new BABYLON.Vector3(newPos.x, newPos.y, newPos.z);
    }

    function _setMeshRotation(meshObject, newRotation = {}) {
        if (!_isInitialised || !meshObject) return;

        meshObject.rotation = new BABYLON.Vector3(newRotation.x, newRotation.y, newRotation.z);
    }

    function _setMeshScale () {

    }

    // * ------------- */
    // *  MATERIALS AND TEXTURES
    // *  TODO
    // * ------------- */


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

        createMesh: _createMesh,
        registerMesh: _registerMesh,
        compoundMeshes: _compoundMeshes,

        createTexture: _createTexture,
        registerTexture: _registerTexture,
        applyTextureByObject: _applyTextureByObject,
        applyTextureByName: _applyTextureByName,

        setMeshPositionByObject: _setMeshPosition,
        setMeshRotationByObject: _setMeshRotation,

        getMeshByName: _getMeshByName,

        //update: _update,
        initialise: _init,

    }
})();

export default MeshManager;