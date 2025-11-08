import TerminalComponent from "@/components/terminal";
import useWebcontainer from "@/hooks/use-webcontainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { webContainer } = useWebcontainer();

  return <TerminalComponent webContainer={webContainer} />;
}
