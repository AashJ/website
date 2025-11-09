import TerminalComponent from "@/components/terminal";
import useWebcontainer from "@/hooks/use-webcontainer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { webContainer } = useWebcontainer();

  return (
    <div>
      <TerminalComponent webContainer={webContainer} />
      <Outlet />
    </div>
  );
}
