import * as DEFS from './../../definitions/definitions.js';

import MeshManager from '../meshes/MeshManager.js';
import AnimationManager from '../animation/AnimationManager.js';
import PhysicsManager from './../physics/PhysicsManager.js';
import LightManager from '../lights/LightManager.js';

import SceneManager from './../../managers/scene/SceneManager.js';

// todo - Add Debugging options
// TODO - UPDATE MESH FUNCTIONALity

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

    const _actors = [],
        _actionList = [];

    var _isInitialised = false,
        _sceneManagerRef;

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
        //if (!_validateActorObject(actorObject)) return null;

        // *    Check what processing needs doing on the Actor

        // *    Check mesh updatable / receieveShadows and checkCollisions options and apply defaults if not specified
        actorObject.meshes.forEach((mesh, i) => {
            mesh.meshName = actorObject.actorName + "_mesh_" + i;
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

        // *    STEP 1 - Create Mesh
        // *    STEP 2 - Position and Rotate Mesh
        // *    STEP 3 - Configure Texturing
        // * Repeat for each mesh and combine to final compound mesh

        let actorMeshList = [];


        // *    STEP 1
        actorObject.meshes.forEach(mesh => {
            actorMeshList.push({
                ...mesh,
                meshObject: _createMesh(mesh)
            });
        });


        // *    STEP 2

        // * Set mesh relative position then rotation
        actorMeshList.forEach((meshData, i) => {
            if (meshData.relativePosition) MeshManager.setMeshPositionByObject(meshData.meshObject, meshData.relativePosition);
        });

        actorMeshList.forEach((meshData, i) => {
            // let overallRotation = {x:0, y:0, z:0}
            // if(actorObject.rotation != undefined) {
            //     overallRotation = actorObject.rotation;
            // }
            // if (meshData.relativeRotation) MeshManager.setMeshRotationByObject(meshData.meshObject, {
            //     x: meshData.relativeRotation.x + overallRotation.x,
            //     y: meshData.relativeRotation.y + overallRotation.y,
            //     z: meshData.relativeRotation.z + overallRotation.z
            // });

            if (meshData.relativeRotation) MeshManager.setMeshRotationByObject(meshData.meshObject, meshData.relativeRotation);
        });

        // *    STEP 3

        // *    Check if full texture before individual mesh textures
        if (actorObject.textureOptions != undefined) {
            // *    Attach name to texture
            actorObject.textureOptions.textureName = actorObject.actorName + "_base_texture";

            // *    Create texture
            let texture = MeshManager.createTexture(actorObject.textureOptions);

            // *    For each mesh, apply the base texture
            actorMeshList.forEach(mesh => {
                MeshManager.applyTextureByObject(mesh.meshObject, texture);
            });

            // *    Register the texture to the MeshManager
            //MeshManager.registerTexture(texture);
        }
        // *    Go through each mesh and if there is a texture options present, apply it
        actorMeshList.forEach((mesh, i) => {
            // *    First check if there is a texture to apply
            if (mesh.textureOptions != undefined) {

                // *    Attach a texture name if required
                mesh.textureOptions.textureName = mesh.meshName + "_texture";

                // *    Create the texture
                let texture = MeshManager.createTexture(mesh.textureOptions);

                // *    Apply the texture to the object
                MeshManager.applyTextureByObject(mesh.meshObject, texture);
            }
        });

        //  * Add meshes to shadow maps - has to be per mesh, not compound

        if (actorObject.castShadows && actorObject.addToShadowMaps && actorObject.addToShadowMaps.length > 0) {
            actorMeshList.forEach(mesh => {
                actorObject.addToShadowMaps.forEach(function addToShadowMap(shadowMapLight) {
                    LightManager.addMeshToShadowMap(shadowMapLight, mesh.meshObject);
                });
            })
        }

        let compoundActorMesh;

        // *    STEP 4 and 5
        compoundActorMesh = actorObject.meshes.length > 1 ? MeshManager.compoundMeshes(actorMeshList.map((mesh) => { return mesh.meshObject })) : actorMeshList[0].meshObject;

        // *    Set Compound Position and Rotation
        if (actorObject.position) MeshManager.setMeshPositionByObject(compoundActorMesh, actorObject.position);
        // debugger;
        //if (actorObject.rotation) MeshManager.setMeshRotationByObject(compoundActorMesh, actorObject.rotation);
        //compoundActorMesh.rotate(BABYLON.Axis.Y, (Math.PI) / 400, BABYLON.Space.LOCAL);

        // * Testing animations
        // if (actorObject.animations && actorObject.animations.length > 0) {
        //     actorObject.animations.forEach(animation => {
        //         AnimationManager.addAnimationObject(animation.animationName, animation.animationOptions);
        //         AnimationManager.addAnimationToMesh(animation.animationName, processedMesh);
        //     });
        // }
        // debugger;

        if (actorObject.animations && actorObject.animations.length > 0) {
            actorObject.animations.forEach(animation => {
                AnimationManager.addAnimationObject(animation.animationName, animation.animationData);
                AnimationManager.addAnimationToMesh(compoundActorMesh, animation.animationName);
                //SceneManager.registerFunctionBeforeFrameRender(() => {
                //debugger;
                //compoundActorMesh.rotation.y += (Math.PI) / 100;
                //compoundActorMesh.rotate(BABYLON.Axis.Y, (Math.PI) / 200, BABYLON.Space.WORLD)
                //console.log(compoundActorMesh.rotationQuaternion);
                //});
            })
        }

        //debugger;

        // * Register Mesh
        MeshManager.registerMesh(compoundActorMesh);


        /*
        *   Check if physics options applied
        */
        actorMeshList.forEach((mesh, i) => {
            if (mesh.physicsOptions != undefined) {
                PhysicsManager.createPhyiscsObject(mesh.meshObject, mesh.physicsOptions);
            }
        });

        if (actorObject.physicsOptions != undefined) {
            PhysicsManager.createPhyiscsObject(compoundActorMesh, actorObject.physicsOptions);
        }

        // *    Rotation applied after Physics Initialised

        if (actorObject.rotation) {
            compoundActorMesh.rotate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);
        }


        _actors.push({
            actorName: actorObject.actorName,
            meshObject: compoundActorMesh
        });
    }

    /*
    *   Get Actor By Name
    */
    function _getActorByName(actorName) {
        if (!_isInitialised) return;

        return _actors.find(function findActorByName(actor) {
            return actor.actorName == actorName;
        });
    }


    // * ------------- */
    // *  ACTOR ACTIONS
    // * ------------- */


    // * ------------- */
    // *  GENERAL MANAGEMENT
    // * ------------- */

    /*
    * Action Dispatch Table
    */
    var _actionDispatchTable = {
        // [ACTIONTYPES.MOVERELATIVE]: _moveMeshRelatively,
        // [ACTIONTYPES.MOVEABSOLUTE]: _moveMeshAbsolutely,
        // [ACTIONTYPES.ROTATETOWORLD]: _rotateMeshToWorldAxis,
        // [ACTIONTYPES.ROTATETOLOCAL]: _rotateMeshToLocalAxis,
        // [ACTIONTYPES.SCALE]: _scaleMesh,
        default: function () {/* * empty default function */ }
    };

    /*
    * Add an action to the Actor Mangement updater
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
    *   Update the ActorManager
    *   PUBLIC
    *   Register with System Manager to run timely updates
    */
    function _update() {
        // * Do update here
        _processActionList();
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

        createActor: _createActor,

        getActorByName: _getActorByName,

        addAction: _addAction,

    }

})();

export default ActorManager;