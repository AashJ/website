import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";

export const Route = createFileRoute("/writing/$slug")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const post = allPosts.find((post) => post.slug === params.slug);

    if (!post) {
      throw redirect({
        to: "/",
      });
    }

    return {
      post,
    };
  },
});

function RouteComponent() {
  const { post } = useRouteContext({ from: "/writing/$slug" });
  return <MDXContent code={post.mdx} />;
}
