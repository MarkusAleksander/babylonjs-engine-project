import * as DEFS from './../../DEFS/defs.js';

import MeshManager from './../meshes/mesh_manager.js';

// todo - Add Debugging options

/*
*   All actor management will be handled via the Actor Manager
*   - Creating Actors
*   - Updating Actor position, rotation, scale etc
*   All internal management will be handled by other smaller managers
*   - Mesh Management
*   - Animation Management
*   All will be dealt with directly through the Actor Manager
*/

const ActorManager = (function ActorManager() {

    const _actors = [];

    var _isInitialised = false,
        _sceneManagerRef;

    // * Actor Template
    var actorTemplate = {
        // ! REQUIRED PROPERTIES
        actorName: '',
        meshes: [{
            actorName: '',
            meshShape: DEFS.MESHSHAPES.BOX,
            meshOptions: {},
            multifaceOption: null || {},
            textureOptions: {
                diffuseTexture: '',
                specularTexture: '',
                bumpMap: ''
            }
        }],
        actorType: DEFS.ACTORTYPES.STATIC || DEFS.ACTORTYPES.PHYSICAL,

        // ! OPTIONAL
        animation: null || {},
        textureOptions: null || {},
        physicsOptions: null || {},
        hasCollisions: false
    }

    function _checkIsValid(item) {
        // * Check if object passed is not empty
        if (typeof item === "object" && item != null) {
            return Boolean(Object.keys(item).length);
        }
        // * If not object, check other empty types
        if (item == undefined || item == null || item == '' || item.length == 0) {
            return false;
        }
        return true;
    }

    /*
    *   Check Actor Object
    *   PRIVATE
    *   actorObject: Object describing the actor
    *   return true if actor meets minimum requirements or false if not
    */
    function _validateActorObject(actorObject) {

        let isInvalidObject = false;

        // * Check Actor has name and basic details
        isInvalidObject =
            !_checkIsValid(actorObject.actorName)
            || !_checkIsValid(actorObject.meshes)
            || !_checkIsValid(actorObject.actorType);
        if (isInvalidObject) return false;

        // * Do meshes have a Shape and Options object?
        actorObject.meshes.forEach(mesh => {
            isInvalidObject = !_checkIsValid(mesh.meshShape) && !_checkIsValid(mesh.meshOptions);
        });
        if (isInvalidObject) return false;

        // * Actor is valid object
        return true;
    }

    /*
    *   Create a Mesh
    *   PRIVATE
    *   Call to MeshManager to create meshes
    */
    function _createMesh(meshObject) {
        return MeshManager.createMesh(meshObject);
    }

    /*
    *   Create An Actor
    *   PUBLIC
    *   actorOptions: Object describing the actor
    */
    function _createActor(actorObject) {

        if (!_isInitialised) return;

        // * Check Actor doesn't already exist with same name
        if (_getActorByName(actorObject.name)) return;

        // *    Validate that actor meets minimum requirements 
        if (!_validateActorObject(actorObject)) return null;

        // *    Check what processing needs doing on the Actor

        // *    Flag if more than 1 mesh
        actorObject.doMerge = actorObject.meshes.length > 1;

        // *    Check non-required options and apply defaults if not specified
        actorObject.meshes.forEach((mesh, i) => {
            mesh.meshName = mesh.meshName != undefined && mesh.meshName != "" ? mesh.meshName : actorObject.actorName + "_" + i;
            mesh.meshOptions.updatable = actorObject.updatable != undefined ? actorObject.updatable : false;
            mesh.meshOptions.receiveShadows = actorObject.receiveShadows != undefined ? actorObject.receiveShadows : false;
            mesh.meshOptions.checkCollisions = actorObject.checkCollisions !== undefined ? actorObject.checkCollisions : false;
        });

        /*
        *   Texture applied to entire Actor?
        *   If no texture base options applied, we can assume texture per mesh and ignore creating an overall texture
        *   If there is to be no texture per mesh, this can be handled later per mesh
        */
        actorObject.hasBaseMeshTexture = _checkIsValid(actorObject.textureOptions);

        /*
        *   Check if physics options applied
        */
        actorObject.hasPhysics = _checkIsValid(actorObject.physicsOptions)

        // * Step 1 .. create Meshes
        // * Step 2 .. create Textures (full mesh texture and individual textures)
        // * Step 3 .. Apply Textures (full mesh texture and individual textures)
        // * Step 4 .. Merge Meshes (if required)
        // * Step 5 .. Register Final Actor Mesh
        // * Step 6 .. Apply Physics

        let meshes = [];

        // *    STEP 1
        actorObject.meshes.forEach(mesh => {
            meshes.push(_createMesh(mesh));
        });

        // *    STEP 2 and 3
        // *    Check if full texture before individual mesh textures
        if (actorObject.hasBaseMeshTexture) {

            // *    Attach name to texture
            if (!actorObject.textureOptions.textureName) actorObject.textureOptions.textureName = actorObject.actorName + "_base_texture";

            // *    Create texture
            let texture = MeshManager.createTexture(actorObject.textureOptions);

            // *    For each mesh, apply the base texture
            meshes.forEach(mesh => {
                MeshManager.applyTextureByObject(mesh, texture);
            });

            // *    Register the texture to the MeshManager
            MeshManager.registerTexture(texture);
        }
        // *    Go through each mesh and if there is a texture options present, apply it
        actorObject.meshes.forEach((mesh, i) => {

            // *    First check if there is a texture to apply
            if (mesh.textureOptions) {

                // *    Attach a texture name if required
                if (!mesh.textureOptions.textureName) mesh.textureOptions.textureName = mesh.meshName + "_texture";

                // *    Create the texture
                let texture = MeshManager.createTexture(mesh.textureOptions);

                // *    Apply the texture to the object
                MeshManager.applyTextureByObject(meshes[i], texture);
            }

        });

        // *    STEP 4 and 5
        if (actorObject.doMerge) {
            MeshManager.registerMesh(MeshManager.mergeMeshes(meshes));
        } else {
            MeshManager.registerMesh(meshes[0]);
        }



    }

    function _getActorByName(name) {
        if (!_isInitialised) return;

        return _actors.find(function findActorByName(actor) {
            return actor.name == name;
        });


    }

    /*
    *   Update the ActorManager
    *   PUBLIC
    *   Register with System Manager to run timely updates
    */
    function _update() {
        // * Do update here
        // * TODO ...
    }

    /*
    *   Initialise the Actor Manager
    *   PUBLIC
    *   sceneManager: SceneManager
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

        createActor: _createActor
    }

})();

export default ActorManager;