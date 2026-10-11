import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default function remarkSnippets() {
  return (tree) => {
    function walk(node) {
      if (node.type === 'code') {
        const match = node.meta?.match(/(?:^|\s)snippet=([^\s]+)/);
        if (match) {
          const snippetPath = match[1];
          const filename = path.resolve(projectRoot, 'examples', snippetPath);
          if (!filename.startsWith(`${path.join(projectRoot, 'examples')}${path.sep}`)) {
            throw new Error(`Snippet must stay inside examples/: ${snippetPath}`);
          }
          try {
            node.value = readFileSync(filename, 'utf8').trimEnd();
          } catch {
            throw new Error(`Could not read code snippet examples/${snippetPath}`);
          }
          node.meta = node.meta.replace(match[0], '').trim() || null;
        }
      }
      for (const child of node.children || []) walk(child);
    }
    walk(tree);
  };
}
