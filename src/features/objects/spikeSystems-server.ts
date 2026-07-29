import { Phase } from "@rbxts/planck";
import { CollectionService } from "@rbxts/services";
import { scheduler } from "app/ecs/shared/scheduler";
import world from "app/ecs/shared/world";
import { c } from "core/components/shared";

function spikeInitialization() {
    const spikes = CollectionService.GetTagged("Spikes")

    for (const spike of spikes) {
        if (!spike.IsA("Model")) {
            continue
        }

        const entity = world.entity();
        world.set(entity, c.Model, spike);
        world.set(entity, c.DealsDamage, 1);

        print(entity, spike)
    }
}

scheduler.addSystem(spikeInitialization, Phase.Startup)