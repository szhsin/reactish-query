> ⚠️ **This project is under active development and not ready for production.**

# Reactish-Query

> Atomic state-powered, lightweight React query library

[![NPM](https://img.shields.io/npm/v/reactish-query.svg)](https://www.npmjs.com/package/reactish-query) [![bundlephobia](https://img.shields.io/bundlephobia/minzip/reactish-query)](https://bundlephobia.com/package/reactish-query)

## ✨Highlights✨

- Declarative data fetching for React
- Atomic state-powered global cache
- Automatic request deduplication
- Lightweight

## Install

```bash
npm install reactish-query
```

## Usage

```jsx
import { useQuery } from "reactish-query";

const Profile = ({ userName }: { userName: string }) => {
  const { isLoading, error, data } = useQuery(["users", userName], {
    fetcher: ([, userName]) =>
      fetch(`https://api.github.com/users/${userName}`).then((res) =>
        res.json()
      )
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Failed to load: {error.message}</div>;

  return <h1>Hi, {data?.name}</h1>;
};
```
