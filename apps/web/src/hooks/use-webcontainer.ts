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
            "- Name: Aash Jain\n- Location: San Francisco, CA\n- Experience: YC W24, Retool, Stripe, Kleiner Perkins, UPenn",
        },
      },
      writing: {
        directory: allPosts.reduce<FileSystemTree>((acc, curr) => {
          return {
            ...acc,
            [curr.title]: {
              file: {
                contents: curr.content,
              },
            },
          };
        }, {}),
      },
    });

    await webcontainer.fs.writeFile(
      "/read.js",
      `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filepath = process.argv[2];
if (!filepath) {
  console.log('Usage: read <file>');
  process.exit(1);
}

// Resolve to absolute path
const absolutePath = path.resolve(filepath);

// Check if it's in the writing directory
if (absolutePath.includes('/writing/')) {
  const filename = path.basename(absolutePath);
  console.log('__OPEN_POST__:' + filename);
} else {
  // Fallback to cat
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    console.log(content);
  } catch (err) {
    console.error('Error reading file:', err.message);
    process.exit(1);
  }
}`,
      {
        encoding: "utf-8",
      }
    );

    await webcontainer.spawn("chmod", ["+x", "read.js"]);
    await webcontainer.spawn("mv", ["read.js", "/usr/bin/read"]);

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
