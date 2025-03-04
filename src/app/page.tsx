"use client";
import { QueryClient, useMutation, useQuery, useQueryClient, keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

const POSTS: Post[] = [
  { id: 1, post: "post1" },
  { id: 2, post: "post2" },
  { id: 3, post: "post3" },
  { id: 4, post: "post4" },
  { id: 5, post: "post5" },
  { id: 6, post: "post6" },
  { id: 7, post: "pos7" },
];

const DATA = "this is data";

type Post = { id: number | string; post: string };

async function queryFn(queryClient: QueryClient): Promise<Post[]> {
  await wait(1000);
  queryClient.invalidateQueries({ queryKey: ["data"] });
  return POSTS;
}

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["post"],
    queryFn: () => queryFn(queryClient),
  });

  const getDataAfterPost = useQuery({
    queryKey: ["data"],
    queryFn: () => wait(1000).then(() => DATA),
    enabled: postQuery.data !== undefined,
  });

  const newPostMutation = useMutation({
    mutationFn: (post: string) => wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), post })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
      queryClient.setQueryData(["post"], [{ id: "test", post: "assc" }]);
    },
  });

  const getPostByPage = useQuery({
    queryKey: ["post", { page }],
    placeholderData: keepPreviousData,
    queryFn: () => wait(1000).then(() => POSTS[page]),
  });

  const commentQuery = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({ pageParam }) =>
      wait(1000).then(() => {
        console.log(pageParam);
        return { nextPage: pageParam + 1, anything: "any" };
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const dataArray = commentQuery.data?.pages.map((item) => {
    console.log(item.anything);
  });
  void dataArray;
  if (postQuery.isLoading) return <>Loading...</>;
  if (postQuery.error) return <>{postQuery.error.message}</>;
  return (
    <div>
      {Array.isArray(postQuery.data) &&
        postQuery.data.map((item) => {
          return <div key={item.id}>{item.post}</div>;
        })}
      <div>
        {getDataAfterPost.isFetching ? "loading Data..." : getDataAfterPost.data}
        <button className="p-2 bg-black text-white" onClick={() => newPostMutation.mutate("New Posts")}>
          Add New
        </button>
        <Link href={"/test"}>test</Link>
      </div>

      <div>{getPostByPage.data?.post}</div>
      <div className="flex gap-4">
        <button disabled={getPostByPage.isPlaceholderData} onClick={() => setPage(page - 1)}>
          Pre
        </button>
        <button disabled={getPostByPage.isPlaceholderData} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
