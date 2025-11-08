import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebContainer } from "@webcontainer/api";
import "xterm/css/xterm.css";

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

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const terminal = new Terminal({
      theme: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        cursor: "#58a6ff",
        black: "#484f58",
        red: "#f85149",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#58a6ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#b1bac4",
        brightBlack: "#6e7681",
        brightRed: "#ff7b72",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#d2a8ff",
        brightCyan: "#56d4dd",
        brightWhite: "#f0f6fc",
      },
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
              terminal.write(data);
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
        terminal.writeln("  • ls - List files and directories");
        terminal.writeln("  • cat <filename> - Display file contents");
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
    <div className="h-screen w-screen bg-[#0d1117] p-4">
      <div
        ref={terminalRef}
        className="h-full w-full"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
