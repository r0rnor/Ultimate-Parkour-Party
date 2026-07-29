import { Scheduler } from "@rbxts/planck";
import PlanckJabby from "@rbxts/planck-jabby";
import { Plugin as PlanckRunService } from "@rbxts/planck-runservice";

import { NetworkRoutes } from "../../../infrastructure/network/shared/network";
import world from "./world";

export const scheduler = new Scheduler(world, NetworkRoutes);

scheduler.addPlugin(new PlanckJabby()).addPlugin(new PlanckRunService());
