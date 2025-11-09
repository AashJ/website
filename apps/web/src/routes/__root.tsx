import { Toaster } from "@/components/ui/sonner";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Aash Jain",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <div className="fixed bottom-0 right-0">
        <ModeToggle />
      </div>
      <HeadContent />
      <Outlet />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-left" />
    </ThemeProvider>
  );
}
