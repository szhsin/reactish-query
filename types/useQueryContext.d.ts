/**
 * Access the current query client and default options from React context.
 *
 * Returns the value provided by `QueryProvider`. Use this inside hooks and
 * components when you need to access the client or default options.
 */
declare const useQueryContext: () => import("./QueryContext").QueryContextType;
export { useQueryContext };
