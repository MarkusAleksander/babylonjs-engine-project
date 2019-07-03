/*
 * Definitions
*/
const LIGHTTYPES = {
    HEMISPHERIC: "hemispheric",
    POINT: "point",
    DIRECTIONAL: "directional",
    SPOT: "spot"
};

const MESHSHAPES = {
    SPHERE: "sphere",
    BOX: "box",
    PLANE: "plane",
    GROUND: "ground",
    CYLINDER: "cylinder"
};

const LINETYPES = {
    SOLID: "solid",
    DASHED: "dashed"
};

const ACTIONTYPES = {
    MOVERELATIVE: "move_relatively",
    MOVEABSOLUTE: "move_absolutely",
    ROTATETOWORLD: "rotate_to_world",
    ROTATETOLOCAL: "rotate_to_local",
    SCALE: "scale"
};

const CAMERATYPES = {
    UNIVERSAL: "universal",
    ARCROTATE: "arcrotate",
    FOLLOW: "follow",
    FLY: "fly",
    FREE: "free"
}

const ACTORTYPES = {
    STATIC: "static",
    PHYSICAL: "physical"
}

const PHYSICSIMPOSTERS = {
    BOX: "box",
    SPHERE: "sphere",
    MESH: "mesh",
    CYLINDER: "cylinder",
    NOIMPOSTER: "noimposter"
}

export { LIGHTTYPES, MESHSHAPES, LINETYPES, ACTIONTYPES, CAMERATYPES, ACTORTYPES, PHYSICSIMPOSTERS };