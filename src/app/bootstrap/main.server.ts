import { ServerScriptService } from "@rbxts/services";

ServerScriptService.GetDescendants().forEach((instance) => {
	if (!instance.IsA("ModuleScript")) {
		return;
	}

	if (!instance.Name.match("System")) {
		return;
	}

	require(instance);
});
