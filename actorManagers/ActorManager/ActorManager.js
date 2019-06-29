import * as DEFS from './../../DEFS/defs.js';

const ActorManager = (function ActorManager() {

    const _actors;

    var _isInitialised = false,
        _sceneManagerRef;

    function _checkIsValid(item) {
        if (item == undefined || item == null || item == '' || item.length == 0) {
            return false;
        }
        return true;
    }

    /*
    *   Check Actor Object
    *   PRIVATE
    *   actorObject: Object describing the actor
    *   return: validated actor object || false
    */
    function _validateActorObject(actorObject) {

        // * Check Actor has name and basic details
        if (
            !_checkIsValid(actorObject.actorName)
            && !_checkIsValid(actorObject.meshes)
            && !_checkIsValid(actorObject.actorType)
        ) return false;

    }

    /*
    *   Create An Actor
    *   PUBLIC
    *   actorOptions: Object describing the actor
    */
    function _createActor(actorObject) {

        // * TODOS - Array of mesh types for building mesh - if multiple, needs to merge
        /*
                * Texture applied to entire Actor or per actor?
        */
        // * Actor Template
        var actor = {
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

        if (actor.meshes.length > 1) {
            // * Merge Meshes
        }

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