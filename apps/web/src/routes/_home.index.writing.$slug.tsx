import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { allPosts } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";

export const Route = createFileRoute("/_home/index/writing/$slug")({
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
  const navigate = useNavigate();
  const { post } = useRouteContext({ from: "/_home/index/writing/$slug" });
  return (
    <Drawer
      open={true}
      onClose={() => {
        navigate({ to: "/", replace: true });
      }}
    >
      <DrawerContent className="h-[80vh]">
        <div className="p-4 space-y-4">
          <DrawerTitle>{post.title}</DrawerTitle>
          <MDXContent code={post.mdx} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
