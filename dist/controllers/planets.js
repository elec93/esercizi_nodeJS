import Joi from "joi";
let planets = [
    { id: 1, name: "Earth" },
    { id: 2, name: "Mars" },
];
/**********************************/
const getAll = (request, response) => {
    response.status(200).json(planets);
};
const getOneById = (request, response) => {
    const { id } = request.params;
    const planet = planets.find((p) => p.id === Number(id));
    response.status(200).json(planet);
};
const planetSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
});
const create = (request, response) => {
    const { id, name } = request.body;
    const newPlanet = { id, name };
    const validateNewPlanet = planetSchema.validate(newPlanet);
    if (validateNewPlanet.error) {
        return response
            .status(400)
            .json({ msg: validateNewPlanet.error.details[0].message });
    }
    else {
        planets = [...planets, newPlanet];
        console.log(planets);
        response.status(201).json({ msg: "planet created!" });
    }
};
const updateById = (request, response) => {
    const { id } = request.params;
    const { name } = request.body;
    planets = planets.map((p) => (p.id === Number(id) ? Object.assign(Object.assign({}, p), { name }) : p));
    response.status(200).json({ msg: "planet updated!" });
};
const deleteById = (request, response) => {
    const { id } = request.params;
    planets = planets.filter((p) => p.id !== Number(id));
    console.log(planets);
    response.status(200).json({ msg: "planet deleted!" });
};
export { getAll, getOneById, create, updateById, deleteById };
