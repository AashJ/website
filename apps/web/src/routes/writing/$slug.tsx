import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";
import MDXArticle from "@/components/mdx-article";

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
  return (
    <MDXArticle
      code={post.mdx}
      title={post.title}
      date={post.date.toISOString()}
    />
  );
}
