import Net, { Route } from "@rbxts/yetanothernet";

const ReplecsReliableRoute = new Route<[buffer, Array<Array<unknown>>?]>();
const ReplecsUnreliableRoute = new Route<[buffer, Array<Array<unknown>>?]>();
const ReplecsInitialSyncRoute = new Route<[buffer, Array<Array<unknown>>?]>();

export const NetworkRoutes = {
	ReplecsInitialSyncRoute,
    ReplecsReliableRoute,
    ReplecsUnreliableRoute
};

export const AllRoutes = {
	...NetworkRoutes,
};

export const [beginFrame, endFrame] = Net.createHook(AllRoutes);
