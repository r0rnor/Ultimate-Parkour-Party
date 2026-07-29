import world from "app/ecs/shared/world";
import { damageComponents } from "./damageComponents";
import { Name } from "@rbxts/jecs";
import Replecs from "@rbxts/replecs";
import { playerComponents } from "./playerComponents";
import { spacialComponents } from "./spacialComponents";

export const c = {
	...damageComponents,
    ...playerComponents,
    ...spacialComponents
};

for (const [name, comp] of pairs(c)) {
	world.set(comp, Name, name);
	world.add(comp, Replecs.Shared);
}
