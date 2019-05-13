import * as DEFS from '../DEFS/defs.js';

const lightManager = (function lightManager() {

    const lights = [];

    /*
    * Create light from BABYLON
    * type: DEF.LIGHTTYPES
    * name: String
    * position: Babylon.Vector3
    */
    function _createLight (type, name, position) {

        switch (type) {
            case DEFS.LIGHTTYPES.HEMISPHERIC:
                return new BABYLON.HemisphericLight(name, new BABYLON.Vector3(position), _systemManagerRef.getScene());
                break;
            case DEFS.LIGHTTYPES.POINT:
                return new BABYLON.PointLight(name, new BABYLON.Vector3(position), _systemManagerRef.getScene());
                break;
            default:
                return new BABYLON.HemisphericLight(name, new BABYLON.Vector3(position), _systemManagerRef.getScene());
        }
    }

    /*
    * Create a managable light object
    * type: DEF.LIGHTTYPES
    * name: String
    * position: (intX, intY, intZ)
    */
    function _createLightObject (type, name, position) {
        return {
            name: name,
            type: type,
            position: position,
            light: _createLight(type, name, position),
            isLightOn: true,
            intensityValue: 1,
            rangeValue: 100,

            // * Swtich Light On or Off
            switchLight: function () { light.setEnabled(!isLightOn); isLightOn = !isLightOn; },

            // * Change Intensity of light
            changeIntensity: function (intensity) { light.intensity = intensity; intensityValue = intensity; },

            // * Change Range (Point and Spot lights Only)
            changeRange: function (range) { light.range = range; rangeValue = range;  }
        }
    }

    /*
    * Add a light to the scene
    * type: DEF.LIGHTTYPES
    * name: String
    * position: (intX, intY, intZ)
    */
    function _addLight (type, name, position) {
        if(_getLight(name) == undefined) {
            actors.lights.push(_createLightObject(type, name, position));
        }
    }

    /*
    * get light by name
    * name: String
    */
    function _getLight (name) {
        let light = lights.find(function findLightByName (el) {
            return el.name = name;
        });
        return light;
    }

    return {
        addLight: _addLight,
        getLight: _getLight
    }

})();

export default lightManager;