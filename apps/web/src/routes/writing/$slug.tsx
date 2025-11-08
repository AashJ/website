import {
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";

export const Route = createFileRoute("/writing/$slug")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    console.log("=======");
    console.log(allPosts);

    console.log("=======");
    const post = allPosts.find((post) => post.title === params.slug);

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
  return <div>{post.content}</div>;
}
