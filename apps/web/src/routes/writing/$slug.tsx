import {
  createFileRoute,
  Link,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";
import MDXArticle from "@/components/mdx-article";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/writing/$slug")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const post = allPosts
      .filter((p) => !p.draft)
      .find((post) => post.slug === params.slug);

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
    <div className="max-w-6xl mx-auto py-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">
          <ArrowLeft /> Back
        </Link>
      </Button>

      <MDXArticle
        code={post.mdx}
        title={post.title}
        date={post.date.toISOString()}
      />
    </div>
  );
}
