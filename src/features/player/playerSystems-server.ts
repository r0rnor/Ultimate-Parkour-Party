import { Phase } from "@rbxts/planck";
import { Players } from "@rbxts/services";
import { scheduler } from "app/ecs/shared/scheduler";
import world from "app/ecs/shared/world";
import { c } from "core/components/shared";

function processPlayer(player: Player) {
	const character = player.Character ?? (player.CharacterAdded.Wait() as unknown as Model);
	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	const playerId = tostring(player.UserId);

	const entity = world.entity();
	world.set(entity, c.Model, character);
	world.set(entity, c.Humanoid, humanoid);
	world.set(entity, c.Player, playerId);

	print(entity, character, humanoid, playerId);
}

function playerInitializing() {
	Players.PlayerAdded.Connect((player) => processPlayer(player));
	Players.GetPlayers().forEach((player) => processPlayer(player));
}

scheduler.addSystem(playerInitializing, Phase.Startup);
