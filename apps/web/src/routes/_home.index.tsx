import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_home/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <></>;
}
