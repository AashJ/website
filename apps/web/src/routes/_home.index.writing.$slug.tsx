import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { allPosts } from "content-collections";
import MDXArticle from "@/components/mdx-article";

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
        <DrawerTitle className="hidden">{post.title}</DrawerTitle>
        <MDXArticle
          code={post.mdx}
          title={post.title}
          date={post.date.toISOString()}
        />
      </DrawerContent>
    </Drawer>
  );
}
