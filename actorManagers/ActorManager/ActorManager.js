import * as DEFS from './../../DEFS/defs.js';

import MeshManager from './../meshes/mesh_manager.js';

// todo - Add Debugging options

const ActorManager = (function ActorManager() {

    const _actors = [];

    var _isInitialised = false,
        _sceneManagerRef;

    // * Actor Template
    var actorTemplate = {
        // ! REQUIRED PROPERTIES
        actorName: '',
        meshes: [{
            meshName: '',
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
    function _creatMesh(meshObject) {

    }

    /*
    *   Create An Actor
    *   PUBLIC
    *   actorOptions: Object describing the actor
    */
    function _createActor(actorObject) {

        if (!_validateActorObject(actorObject)) return null;

        // *    Check what processing needs doing on the Actor

        // *    Flag if more than 1 mesh
        actorObject.doMerge = actorObject.meshes.length > 1;

        // *    Check non-required options and apply defaults if not specified
        actorObject.meshes.forEach((mesh, i) => {
            mesh.meshName = mesh.meshName == undefined || mesh.meshName == "" ? actorObject.meshName + "_" + i : mesh.meshName;
            mesh.updatable = mesh.updatable === true ? mesh.updatable : false;
            mesh.receiveShadows = mesh.receiveShadows === true ? mesh.receiveShadows : false;
        });

        /*
        *   Texture applied to entire Actor?
        *   If no texture base options applied, we can assume texture per mesh and ignore creating an overall texture
        *   If there is to be no texture per mesh, this can be handled later per mesh
        */
        actorObject.hasFullMeshTexture = _checkIsValid(actorObject.textureOptions);

        /*
        *   Check if physics options applied
        */
        actorObject.hasPhysics = _checkIsValid(actorObject.physicsOptions)

        // * Step 1 .. create Meshes
        // * Step 2 .. create Textures
        // * Step 3 .. Apply Textures
        // * Step 4 .. Merge Meshes
        // * Step 5 .. Apply Physics

        actorObject.meshes.forEach(mesh => {
            _createMesh(mesh);
        })
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