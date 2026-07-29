import world from "app/ecs/shared/world";

export const playerComponents = {
    Humanoid: world.component<Humanoid>(),
    Player: world.component<string>(),
}