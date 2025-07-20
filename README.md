> ⚠️ **This project is under active development and not ready for production.**

# Reactish-Query

> Atomic state-powered, lightweight React query library

[![NPM](https://img.shields.io/npm/v/reactish-query.svg)](https://www.npmjs.com/package/reactish-query) [![bundlephobia](https://img.shields.io/bundlephobia/minzip/reactish-query)](https://bundlephobia.com/package/reactish-query)

## ✨Highlights✨

- Declarative data fetching for React
- Automatic request deduplication
- Atomic state-powered global cache
- JavaScript engine-backed cache garbage collection
- Lightweight

## Install

```bash
npm install reactish-query
```

## Usage

```jsx
import { useQuery } from "reactish-query";

const Profile = ({ userName }: { userName: string }) => {
  const { isPending, error, data } = useQuery<{ name: string }>({
    key: ['users', userName],
    fetcher: () =>
      fetch(`https://api.github.com/users/${userName}`).then((res) => res.json())
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Failed to load: {error.message}</div>;

  return <h1>Hi, {data.name}</h1>;
};
```
