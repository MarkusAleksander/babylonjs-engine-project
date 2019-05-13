import { LIGHTTYPES } from '../../DEFS/defs.js';

const LightManager = (function LightManager() {

    const lights = [];

    var _isInitialised = false,
        _sceneManagerRef;

    /*
    * Create light from BABYLON
    * PRIVATE
    * type: DEF.LIGHTTYPES
    * name: String
    * position: Babylon.Vector3
    */
    function _createLight(type, name, position) {

        switch (type) {
            case LIGHTTYPES.HEMISPHERIC:
                return new BABYLON.HemisphericLight(name, new BABYLON.Vector3(position), _sceneManagerRef.getScene());
            case LIGHTTYPES.POINT:
                return new BABYLON.PointLight(name, new BABYLON.Vector3(position), _sceneManagerRef.getScene());
            default:
                return new BABYLON.HemisphericLight(name, new BABYLON.Vector3(position), _sceneManagerRef.getScene());
        }
    }

    /*
    * Create a managable light object
    * PRIVATE
    * type: DEF.LIGHTTYPES
    * name: String
    * position: (intX, intY, intZ)
    */
    function _createLightObject(type, name, position) {
        return {
            name: name,
            type: type,
            position: position,
            light: _createLight(type, name, position),
            isLightOn: true,
            intensityValue: 1,
            rangeValue: 100,

            // * Swtich Light On or Off
            switchLight: function () { this.light.setEnabled(!this.isLightOn); this.isLightOn = !this.isLightOn; },

            // * Change Intensity of light
            changeIntensity: function (intensity) { this.light.intensity = intensity; this.intensityValue = intensity; },

            // * Change Range (Point and Spot lights Only)
            changeRange: function (range) { this.light.range = range; this.rangeValue = range; }
        }
    }

    /*
    * Add a light to the scene
    * PUBLIC
    * type: DEF.LIGHTTYPES
    * name: String
    * position: (intX, intY, intZ)
    */
    function _addLight(type, name, position) {
        if (!_isInitialised) return;

        if (_getLight(name) == undefined) {
            lights.push(_createLightObject(type, name, position));
        }
    }

    /*
    * get light by name
    * PUBLIC
    * name: String
    */
    function _getLight(name) {
        if (!_isInitialised) return;

        return lights.find(function findLightByName(el) {
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
        addLight: _addLight,
        getLight: _getLight
    }

})();

export default LightManager;