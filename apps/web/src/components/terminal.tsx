import { useEffect, useRef } from "react";
import { Terminal, type ITheme } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebContainer } from "@webcontainer/api";
import "xterm/css/xterm.css";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { getCssVariable } from "@/hooks/get-css-variable";
import { isPost, oklchStringToHex } from "@/lib/utils";

const cssVarToHex = (varName: string, fallback: string): string => {
  const value = getCssVariable(varName);
  if (!value) return fallback;
  return value.startsWith("#") ? value : oklchStringToHex(value);
};

const buildTerminalTheme = (): ITheme => ({
  background: cssVarToHex("--background", "#ffffff"),
  foreground: cssVarToHex("--foreground", "#000000"),
  cursor: cssVarToHex("--terminal-cursor", "#58a6ff"),
  black: cssVarToHex("--terminal-black", "#484f58"),
  red: cssVarToHex("--terminal-red", "#f85149"),
  green: cssVarToHex("--terminal-green", "#3fb950"),
  yellow: cssVarToHex("--terminal-yellow", "#d29922"),
  blue: cssVarToHex("--terminal-blue", "#58a6ff"),
  magenta: cssVarToHex("--terminal-magenta", "#bc8cff"),
  cyan: cssVarToHex("--terminal-cyan", "#39c5cf"),
  white: cssVarToHex("--terminal-white", "#b1bac4"),
  brightBlack: cssVarToHex("--terminal-bright-black", "#6e7681"),
  brightRed: cssVarToHex("--terminal-bright-red", "#ff7b72"),
  brightGreen: cssVarToHex("--terminal-bright-green", "#56d364"),
  brightYellow: cssVarToHex("--terminal-bright-yellow", "#e3b341"),
  brightBlue: cssVarToHex("--terminal-bright-blue", "#79c0ff"),
  brightMagenta: cssVarToHex("--terminal-bright-magenta", "#d2a8ff"),
  brightCyan: cssVarToHex("--terminal-bright-cyan", "#56d4dd"),
  brightWhite: cssVarToHex("--terminal-bright-white", "#f0f6fc"),
});

interface TerminalComponentProps {
  webContainer: WebContainer | null;
}

export default function TerminalComponent({
  webContainer,
}: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const shellProcessRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const terminal = new Terminal({
      theme: buildTerminalTheme(),
      fontSize: 14,
      fontFamily: "Monaco, Menlo, 'Ubuntu Mono', monospace",
      cursorBlink: true,
      cursorStyle: "block",
    });

    // Initialize fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // Open terminal in container
    terminal.open(terminalRef.current);

    // Fit terminal to container
    fitAddon.fit();

    // Store refs
    terminalInstanceRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      terminal.dispose();
    };
  }, []);

  useEffect(() => {
    if (!terminalInstanceRef.current) return;
    if (!resolvedTheme) return;

    const rafId = window.requestAnimationFrame(() => {
      const terminal = terminalInstanceRef.current;
      if (!terminal) return;

      const theme = buildTerminalTheme();
      terminal.options.theme = theme;
      terminal.refresh(0, terminal.rows - 1);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [resolvedTheme]);

  const navigate = useNavigate();

  // Connect to WebContainer when it's ready
  useEffect(() => {
    if (!webContainer || !terminalInstanceRef.current) return;

    const terminal = terminalInstanceRef.current;
    let inputWriter: WritableStreamDefaultWriter<string> | null = null;

    const connectToShell = async () => {
      try {
        // Spawn a shell process (jsh is the JavaScript shell)
        const shellProcess = await webContainer.spawn("sh", []);
        shellProcessRef.current = shellProcess;

        // Get input writer once
        inputWriter = shellProcess.input.getWriter();

        // Connect shell output to terminal
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              const post = isPost(data);
              if (post) {
                navigate({
                  to: "/index/writing/$slug",
                  params: {
                    slug: post.slug,
                  },
                  mask: {
                    to: "/writing/$slug",
                    params: { slug: post.slug },
                  },
                });
              } else {
                terminal.write(data);
              }
            },
          })
        );

        // Handle terminal input - send to shell
        terminal.onData((data) => {
          if (inputWriter) {
            inputWriter.write(data);
          }
        });

        // Display welcome instructions
        terminal.writeln("Welcome! Try these commands:");
        terminal.writeln("- ls - List files and directories");
        terminal.writeln("- cat <filename> - Read a file");
        terminal.writeln("");
      } catch (error) {
        terminal.writeln(`Error: ${error}`);
        terminal.writeln("Failed to start shell");
      }
    };

    connectToShell();

    // Cleanup shell process on unmount
    return () => {
      if (inputWriter) {
        inputWriter.releaseLock();
      }
      if (shellProcessRef.current) {
        shellProcessRef.current.kill();
      }
    };
  }, [webContainer]);

  return (
    <div className="h-screen w-screen bg-background p-4">
      <div
        ref={terminalRef}
        className="h-full w-full"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
