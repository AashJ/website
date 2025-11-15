import { useEffect, useRef, useState } from "react";
import { WebContainer, type FileSystemTree } from "@webcontainer/api";
import { allPosts } from "content-collections";

const useWebcontainer = () => {
  const webContainerInitialized = useRef(false);
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  const initializeWebcontainer = async () => {
    if (webContainerInitialized.current) return;

    const webcontainer = await WebContainer.boot({ workdirName: "web" });
    webcontainer.mount({
      "about.txt": {
        file: {
          contents:
            "- Name: Aash Jain\n- Location: San Francisco, CA\n- Experience: YC W24, Retool, Stripe, Kleiner Perkins\n- Education: UPenn\n- Contact: aash.jain99@gmail.com",
        },
      },
      writing: {
        directory: allPosts
          .filter((post) => !post.draft)
          .reduce<FileSystemTree>((acc, curr) => {
            return {
              ...acc,
              [`${curr.slug}`]: {
                file: {
                  contents: `---
title: "${curr.title}"
slug: "${curr.slug}"
---

${curr.content}`,
                },
              },
            };
          }, {}),
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
