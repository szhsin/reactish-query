declare const QueryContext: import("react").Context<{
    getCache: () => import("./queryCache").QueryCache;
    getState: () => <T, A>(initialValue: T, actionBuilder?: import("reactish-state").ActionBuilder<T, A>, config?: import("reactish-state").Config) => import("reactish-state").StateWithAction<T, A>;
}>;
export { QueryContext };
