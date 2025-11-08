import { useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";

const useWebcontainer = () => {
  const webContainerInitialized = useRef(false);
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  const initializeWebcontainer = async () => {
    if (webContainerInitialized.current) return;

    const webcontainer = await WebContainer.boot();
    webcontainer.mount({
      "about.txt": {
        file: {
          contents:
            "- Name: Aash Jain\n- Location: San Francisco, CA\n- Experience: YC W24, Retool, Stripe",
        },
      },
      writing: {
        directory: {
          "test.md": {
            file: {
              contents: "This is a test file.",
            },
          },
        },
      },
    });
    webContainerInitialized.current = true;
    setWebContainer(webcontainer);
  };

  useEffect(() => {
    initializeWebcontainer();

    return () => {
      webContainerInitialized.current = false;
    };
  }, []);

  return { webContainer };
};

export default useWebcontainer;
