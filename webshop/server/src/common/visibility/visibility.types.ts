export type SalesChannel = "b2c" | "b2b";

export type VisibilityContext = {
    channel: SalesChannel;
    includeInactive: boolean;
};
