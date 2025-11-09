import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const Route = createFileRoute("/_home/index/writing/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <Drawer
      defaultOpen={true}
      onClose={() => {
        navigate({ to: "/", replace: true });
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
