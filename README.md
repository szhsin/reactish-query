# Reactish-Query

> Atomic state-powered, lightweight React query library

[![NPM](https://img.shields.io/npm/v/reactish-query.svg)](https://www.npmjs.com/package/reactish-query) [![bundlejs](https://deno.bundlejs.com/?q=reactish-query&treeshake=%5B*%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%5D%7D%7D&badge=simple)](https://bundlejs.com/?q=reactish-query&treeshake=%5B*%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%5D%7D%7D) [![bundlephobia](https://img.shields.io/bundlephobia/minzip/reactish-query)](https://bundlephobia.com/package/reactish-query)

## Install

```bash
npm install reactish-query
```

## ✨ Highlights ✨

- Simple, declarative data fetching for React
- Core features of TanStack Query at a fraction of the bundle size
- Supports queries, lazy queries, mutations & optimistic updates
- Lifecycle hooks for queries and mutations (onData / onError)
- Modular and composable API
- Built-in request and query data deduplication
- Cache management with atomic state for fine-grained reactivity
- Automatic cache cleanup via JavaScript garbage collection
- Fully compatible with React Compiler
- Ultra-lightweight: [~1.5KB](https://bundlejs.com/?q=reactish-query&treeshake=%5B*%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%5D%7D%7D) (state management + query/mutation)

## Cache Management

Cache management in large or long-running apps is tricky for query libraries. Many implementations, like TanStack Query, rely on a configurable timer (`gcTime`) to remove cache entries after all components using them have unmounted. While this works in some cases, choosing an ideal GC interval is difficult, and unused cache can still grow excessively depending on the device or runtime conditions.

This library takes a different approach by leveraging the native JavaScript engine for garbage collection, which is more sophisticated and efficient out of the box. Thanks to an atomic state–based cache architecture, cache entries are weakly held, allowing the engine to automatically reclaim them when no components reference the data. Unused cache is cleaned up **as needed based on runtime factors** such as access patterns, hot paths, and generational collection, without requiring manual timers.

![cache-comparison](https://github.com/user-attachments/assets/d8c639a3-19dc-4566-ad70-175abc7b7d74)

## Bundle size

Bundle size is a key consideration in the design of this library. Each line of code is carefully crafted in a strongly typed codebase to balance a simple, easy-to-use public API with minimal internal overhead. The API is also composable and semi-modular, letting consumers include only the features they need and keeping the final bundle lean.

## React Compiler

With the React Compiler in mind, the library is built for maximum compatibility. It fully respects React’s rules and is thoroughly tested with 100% unit coverage, both with and without the React Compiler in the test setup.

# Getting Started

- [Query](#query)
- [Lazy Query](#lazy-query)
- [Mutation](#mutation)
- [Optimistic Updates](#optimistic-updates)
- [Query Provider](#query-provider)
  - [Default options](#default-options)
  - [Middleware](#middleware)
- [Composable](#composable)
- [Prefetching](#prefetching)
- [Query Client](#query-client)
  - [In React scope](#in-react-scope)
  - [In global scope](#in-global-scope)
- [Options](#options)
- [Optimization](#optimization)
  - [The Reactish Query Approach](#the-reactish-query-approach)
- [useQueryData](#usequerydata)

## Query

The declarative **useQuery** hook requires a `queryKey` to identify the query, which can be any serializable value, and a `queryFn` that defines how the data should be fetched.

```tsx
import { useQuery } from "reactish-query";

const Profile = ({ userName }: { userName: string }) => {
  const { isPending, data, error } = useQuery<{ name: string }>({
    queryKey: ["users", userName],
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${userName}`);
      if (!res.ok) throw new Error(res.status.toString());
      return res.json();
    }
  });

  if (error) return <div>Failed to load: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;
  return <h1>Hi, {data.name}</h1>;
};
```

[Open in StackBlitz ↗](https://stackblitz.com/edit/reactish-query?file=src%2Fexamples%2FQuery.tsx)

You don’t always need to provide a `queryFn` to **useQuery**. This is useful when you only want your UI to subscribe to data in the shared query cache, letting other query hooks with the same `queryKey` handle the fetching.

```ts
const { isPending, data, error } = useQuery({ queryKey: ["users", userName] });
```

## Lazy Query

The **useLazyQuery** hook doesn’t run automatically—it’s triggered manually by a user action. It returns a `trigger` function and the `args` from the most recent trigger.

`queryKey` is optional for lazy queries. If provided, it is used together with `args` to identify the query for caching.

In the example below, clicking the search button triggers a fetch that uses the current input value:

```tsx
import { useState } from "react";
import { useLazyQuery } from "reactish-query";

const Example = () => {
  const { trigger, args, isFetching, data } = useLazyQuery<
    { items: { id: number; full_name: string }[] },
    string
  >({
    queryKey: "search-repos",
    queryFn: async ({ args }) => {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${args}`
      );
      if (!res.ok) throw new Error(res.status.toString());
      return res.json();
    }
  });
  const [value, setValue] = useState("");

  return (
    <>
      <h1>Search GitHub repositories</h1>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* Only trigger fetch when the user clicks the search button */}
      <button disabled={!value} onClick={() => trigger(value)}>
        Search
      </button>
      {args && (
        <h2>{`${isFetching ? "Searching" : "Search result"} for "${args}"`}</h2>
      )}
      <ul>
        {data?.items?.map((repo) => (
          <li key={repo.id}>{repo.full_name}</li>
        ))}
      </ul>
    </>
  );
};
```

[Open in StackBlitz ↗](https://stackblitz.com/edit/reactish-query?file=src%2Fexamples%2FLazyQuery.tsx)

## Mutation

Mutations work much like lazy queries and share the same API. The key difference is that they don’t use the shared cache across the app and don’t deduplicate concurrent mutations.

```tsx
import { useMutation } from "reactish-query";

const Example = () => {
  const { trigger, isPending, isFetching, args, error } = useMutation({
    queryFn: ({ args: newTodo }: { args: string }) =>
      axios.post("/todos", newTodo)
  });

  return (
    <>
      <button disabled={isFetching} onClick={() => trigger("Buy groceries")}>
        Create todo
      </button>
      {isFetching && <div>Creating...</div>}
      {!isPending && <div>Created a todo: "{args}"</div>}
      {error && <div>An error occurred: {error.message}</div>}
    </>
  );
};
```

## Optimistic Updates

You can optimistically update the UI before a mutation completes. This makes the app feel faster while keeping it in sync. Use the query client to update the shared cache, and all query hooks with the same `queryKey` will reflect the change immediately.

```tsx
import { useMutation, useQueryContext } from "reactish-query";

const Example = () => {
  // Retrieve the current query client from context
  const { client } = useQueryContext();
  const { trigger, isPending, isFetching, args, error } = useMutation({
    queryFn: ({ args: newTodo }: { args: string }) =>
      axios.post("/todos", newTodo)
  });

  return (
    <>
      <button
        disabled={isFetching}
        onClick={async () => {
          const newTodo = "Buy groceries";
          // Cancel any in-flight queries for the todo list
          client.cancel({ queryKey: "todos" });

          // Snapshot the current data for rollback if needed
          const previousTodos = client.getData({ queryKey: "todos" });

          // Optimistically update the todo list
          client.setData<string[]>({ queryKey: "todos" }, (todos) => [
            ...todos,
            newTodo
          ]);

          // Run the mutation to add the new todo
          const { error } = await trigger(newTodo);

          // Roll back to the snapshot if the mutation fails
          if (error) client.setData({ queryKey: "todos" }, previousTodos);

          // Always refetch the todo list after completion
          client.invalidate({ queryKey: "todos" });
        }}
      >
        Create todo
      </button>
      {!isPending && <div>Created a todo: "{args}"</div>}
      {error && <div>An error occurred: {error.message}</div>}
    </>
  );
};
```

## Query Provider

Using a `QueryProvider` is entirely optional, but it’s helpful if you want to set default options for all queries or add middleware.

### Default options

You can provide default settings that apply to every query in your app, such as `staleTime` or `cacheMode`.

```tsx
import { QueryProvider } from "reactish-query";

const Example = () => (
  <QueryProvider
    // Apply default options to all queries in the app
    defaultOptions={{ staleTime: Infinity, cacheMode: "persist" }}
  >
    <App />
  </QueryProvider>
);
```

### Middleware

Middleware lets you hook into query state updates to perform custom actions, such as logging or persisting data to localStorage.

The built-in `queryObserver` middleware allows you to subscribe to queries and mutations through lifecycle events like `onData` and `onError`.

```tsx
import { QueryProvider, createQueryClient } from "reactish-query";
import { queryObserver } from "reactish-query/middleware";

const queryClient = createQueryClient({
  middleware: queryObserver({
    // Log when data is successfully fetched
    onData: (data, metadata) =>
      console.log("Data received:", data, metadata.queryKey),

    // Log when an error occurs during fetching
    onError: (error, metadata) =>
      console.log("Error:", error.message, metadata.queryKey)
  })
});

const Example = () => (
  <QueryProvider
    // Provide the custom query client with middleware
    client={queryClient}
  >
    <App />
  </QueryProvider>
);
```

[Open in StackBlitz ↗](https://stackblitz.com/edit/reactish-query?file=src%2Fexamples%2FQueryObserver.tsx)

## Composable

The library provides a composable API pattern, allowing you to enhance default query and mutation hooks. This makes the API modular and flexible, and helps reduce bundle size by letting you include only what you need.

The built-in `useQueryObserver` works like the `queryObserver` middleware, subscribing to queries and mutations via lifecycle events (`onData` and `onError`), but it operates within a React scope rather than globally.

```tsx
import { useQuery } from "reactish-query";
import { useQueryObserver } from "reactish-query/composable";

const Example = () => {
  const { isPending, data: todos } = useQueryObserver(
    useQuery({ queryKey: "todos", queryFn }),
    {
      // Called when data is available
      onData: (data) => console.log("Data received:", data),
      // Called when there is an error
      onError: (error) => console.log("Error:", error.message)
    }
  );

  if (isPending) return <div>Loading...</div>;

  // Render the list of todos
};
```

[Open in StackBlitz ↗](https://stackblitz.com/edit/reactish-query?file=src%2Fexamples%2FComposable.tsx)

You can even create a reusable hook combining a query with an observer for convenience:

```tsx
import {
  useQuery,
  QueryHookOptions,
  QueryObserverOptions
} from "reactish-query";
import { useQueryObserver } from "reactish-query/composable";

// Reusable hook combining useQuery with observer
const useQueryWithObserver = <TData, TKey = unknown>({
  onData,
  onError,
  ...options
}: QueryHookOptions<TData, TKey> & QueryObserverOptions<TData>) =>
  useQueryObserver(useQuery(options), { onData, onError });

// Example usage
const { isPending, data } = useQueryWithObserver({
  queryKey: "todos",
  queryFn,
  onData: (data) => console.log("Data received:", data), // on success
  onError: (error) => console.log("Error:", error.message) // on error
});
```

## Prefetching

You can prefetch a query when it might take a long time to fetch and you expect it to be used soon.

```ts
queryClient.fetch({
  queryKey: "todos",
  queryFn: () => axios.get("/api/todos")
});
```

This fetches the todo list and populates an entry in the shared cache, so any component using the same query can render instantly on mount.

## Query Client

For features like prefetching or optimistic updates, you need access to the query client instance.

### In React scope

Always get the current query client via context:

```tsx
import { useQueryContext } from "reactish-query";

const Example = () => {
  const { client } = useQueryContext();
  // use the query client within the component...
};
```

### In global scope

If you create your own query client, you already have a reference:

```ts
import { createQueryClient } from "reactish-query";
const queryClient = createQueryClient();
```

If you don’t create a client, your app will use the default query client, which can be imported:

```ts
import { defaultQueryClient } from "reactish-query";
```

## Options

| Option | Type | Default | Description |
| --- | --- | :-: | --- |
| `cacheMode` | `'auto'`<br>`'persist'`<br>`'off'` | `'auto'` | Controls caching behavior (N/A for mutations): <br> - `auto` – when a query is not referenced by any component, it becomes weakly held in the cache and the JS engine can reclaim it.<br> - `persist` – keeps the query strongly held in the cache even if no component is referencing it.<br> - `off` – disables the shared cache and request deduplication for this hook. |
| `staleTime` | `number` (ms) | `0` | Time in milliseconds after a successful fetch during which cached data is considered fresh for this hook instance. Can be configured for infrequently changing data to avoid refetches. Only available on `useQuery`. |
| `enabled` | `boolean` | `true` | When `false`, automatic (declarative) fetching is disabled. Only available on `useQuery`. |

## Optimization

One of the main benefits of using a query library (instead of manually storing query state in React and passing it through props or context) is that it not only deduplicates network requests and query data across your app, but it can also reduce unnecessary re-renders.

For example, imagine a component that renders a user’s profile data. You care only about the **data**, not whether the request is fetching or failed:

```tsx
const Profile = () => {
  const { data } = useQuery({
    queryKey: "profile",
    queryFn: () => axios.get("/api/profile")
  });

  return <h1>Hi, {data?.firstName}</h1>;
};
```

Ideally, this component should only re-render when the fetched data changes, not when unrelated states like `isFetching` or `error` change. This behavior is often called **fine-grained reactivity**.

Libraries like TanStack Query and SWR achieve this by tracking which properties of the hook’s return object are accessed, and only re-render when those properties change. A simplified implementation[^1] looks like this:

```ts
const useQuery = () => {
  let data, error, isFetching;
  const isDataAccessed = useRef(false);
  const isErrorAccessed = useRef(false);
  const isFetchingAccessed = useRef(false);

  return {
    get data() {
      isDataAccessed.current = true;
      return data;
    },
    get error() {
      isErrorAccessed.current = true;
      return error;
    },
    get isFetching() {
      isFetchingAccessed.current = true;
      return isFetching;
    }
  };
};
```

While convenient, this approach introduces side effects during render, **making the render phase impure**. It may work in practice but breaks React’s rules and risks subtle bugs or incompatibility with the React Compiler or future React releases.

### The Reactish Query Approach

Instead, this library provides a different API that achieves a similar level of fine-grained reactivity while keeping the render phase **100% pure**. This ensures **maximum compatibility with the React Compiler and future versions of React**.

Special low-level hooks like `useQuery$` and `useLazyQuery$` return observables, which can then be combined with utility hooks such as `useData` and `useError` to create scoped subscriptions.

For example, this Profile component only re-renders when `data` changes (but not when `error` or `isFetching` changes):

```tsx
import { useQuery$, useData } from "reactish-query";

const Profile = () => {
  const { data } = useData(
    useQuery$({
      queryKey: "profile",
      queryFn: () => axios.get("/api/profile")
    })
  );
  return <h1>Hi, {data?.firstName}</h1>;
};
```

You can also combine multiple utility hooks:

```tsx
import { useQuery$, useData, useError } from "reactish-query";

const Profile = () => {
  const { data, error } = useError(
    useData(
      useQuery$({
        queryKey: "profile",
        queryFn: () => axios.get("/api/profile")
      })
    )
  );
  if (error) return <div>Something went wrong</div>;
  return <h1>Hi, {data?.firstName}</h1>;
};
```

And if you use this pattern frequently, you can encapsulate it into a custom hook:

```tsx
import { useQuery$, useData, useError, QueryHookOptions } from "reactish-query";

const useQueryDataAndError = <TData, TKey = unknown>(
  options: QueryHookOptions<TData, TKey>
) => useError(useData(useQuery$(options)));
```

## useQueryData

This built-in helper combines `useQuery$` and `useData`, subscribing only to data updates:

```ts
import { useQueryData } from "reactish-query";
useQueryData({ queryKey: "todos" });
```

is equivalent to:

```ts
import { useQuery$, useData } from "reactish-query";
useData(useQuery$({ queryKey: "todos" }));
```

[^1]: Reference implementations: [TanStack Query](https://github.com/TanStack/query/blob/7d370b91f9a2c572c49c669ffab28ce0ec6f2de2/packages/query-core/src/queryObserver.ts#L269-L284) and [SWR](https://github.com/vercel/swr/blob/0b3c2c757d9ce4f7e386a925f695adf93cf9065c/src/index/use-swr.ts#L753-L771)
