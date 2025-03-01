# Get Started

```
npm i @tanstack/react-query
npm i @tanstack/react-query-devtools
```

## Wrap App in provider

```
"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Queryrovider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

```

## useQuery

```
type queryFn = Promise<data>
```

```
 const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: queryFn,
  });
```

### Query stays fresh by giving staleTime in ms

```
  const queryClient = new QueryClient({defaultOptions:{queries:{staleTime:1000}}});

```

```
  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: queryFn,
    staleTime: 1000 * 30,
  });
```

### Refetch Interval

```
  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: queryFn,
    refetchInterval: 1000,
  });
```

### Enabled

enable taked a boolean which fetch only after it true

```
  const getDataAfterPost = useQuery({
    queryKey: ["data"],
    queryFn: () => wait(1000).then(() => DATA),
    enabled: postQuery.data !== undefined,
  });
```

### PlaceHolderData

```
  const getPostByPage = useQuery({
    queryKey: ["post", { page }],
    placeholderData: keepPreviousData,
    queryFn: () => wait(1000).then(() => POSTS[page]),
  });
```

## useMutation

```
const newPostMutation = useMutation({
    mutationFn: (post: string) => wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), post })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

```

use useClient hook to invalidate query

```
  const queryClient = useQueryClient();
```

## Invalidate Exact Query

```
 queryClient.invalidateQueries({ queryKey: ["post"], exact: true });

```
