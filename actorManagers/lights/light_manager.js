import { LIGHTTYPES } from '../../DEFS/defs.js';

const LightManager = (function LightManager() {

    const lights = [],
        _shadowGenerators = [];

    var _isInitialised = false,
        _sceneManagerRef,
        _maxNumLights = 4;

    /*
    * Create light from BABYLON
    * PRIVATE
    * type: DEF.LIGHTTYPES
    * name: String
    * position: Babylon.Vector3
    */
    function _createLight(type, name, options) {

        switch (type) {
            case LIGHTTYPES.HEMISPHERIC:
                return new BABYLON.HemisphericLight(name, options.direction, _sceneManagerRef.getScene());
            case LIGHTTYPES.POINT:
                return new BABYLON.PointLight(name, options.position, _sceneManagerRef.getScene());
            case LIGHTTYPES.DIRECTIONAL:
                return new BABYLON.DirectionalLight(name, options.direction, _sceneManagerRef.getScene());
            case LIGHTTYPES.SPOT:
                return new BABYLON.SpotLight(name, options.position, options.direction, options.angle, options.exponent, _sceneManagerRef.getScene());
            default:
                return new BABYLON.HemisphericLight(name, new BABYLON.Vector3(0, 1, 0), _sceneManagerRef.getScene());
        }
    }

    /*
    * Create a managable light object
    * PRIVATE
    * type: DEF.LIGHTTYPES
    * name: String
    * position: Object (x, y, z)
    */
    function _createLightObject(type, name, options) {
        return {
            name: name,
            type: type,
            options: options,
            light: _createLight(type, name, options),
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
    function _addLight(type, name, options) {
        if (!_isInitialised) return;

        if (_getLight(name) == undefined && lights.length <= _maxNumLights) {
            lights.push(_createLightObject(type, name, options));
        }

        if (options.castShadows) {
            _createShadowGenerator(name, _getLight(name));
        }
    }

    /*
    * Set Diffuse colour of a light
    * name: String
    * colour: BABYLON.Color3()
    */
    function _setDiffuseColour(name, colour) {
        if (!_isInitialised) return;

        let light = _getLight(name);

        if (light != undefined) {
            light.light.diffuse = colour;
        }
    }

    /*
    * Set Specular colour of a light
    * name: String
    * colour: BABYLON.Color3()
    */
    function _setSpecularColour(name, colour) {
        if (!_isInitialised) return;

        let light = _getLight(name);

        if (light != undefined) {
            light.light.specular = colour;
        }
    }

    /*
    * Set Ground colour of a light
    * name: String
    * colour: BABYLON.Color3()
    */
    function _setGroundColour(name, colour) {
        if (!_isInitialised) return;

        let light = _getLight(name);

        if (light != undefined) {
            light.light.groundColor = colour;
        }
    }

    /*
    * Set Ground colour of a light
    * name: String
    * intensity: float
    */
    function _setLightIntensity(name, intensity) {
        if (!_isInitialised) return;

        let light = _getLight(name);

        if (light != undefined) {
            light.light.intensity = intensity;
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
    * Create a shadow generator
    * PRIVATE
    * name: String
    */
    function _createShadowGenerator(name, lightObj) {
        let shadowGenerator = new BABYLON.ShadowGenerator(1024, lightObj.light);

        _shadowGenerators.push({
            name: name,
            shadowGenerator: shadowGenerator
        });
    }

    /*
    * Add object to shadow map
    * PUBLIC
    * name: String
    */
    function _addMeshToShadowMap(name, meshObj) {
        let shadowGenerator = _getShadowGenerator(name);
        shadowGenerator.shadowGenerator.getShadowMap().renderList.push(meshObj);
    }

    /*
    * Get Shadow Generator
    * name: String
    */
    function _getShadowGenerator(name) {
        if (!_isInitialised) return;

        return _shadowGenerators.find(function findShadowGeneratorByName(el) {
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

        setDiffuseColour: _setDiffuseColour,
        setSpecularColour: _setSpecularColour,
        setGroundColour: _setGroundColour,
        setLightIntensity: _setLightIntensity,

        addMeshToShadowMap: _addMeshToShadowMap
    }

})();

export default LightManager;