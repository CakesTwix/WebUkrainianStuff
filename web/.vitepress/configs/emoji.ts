import type { MarkdownRenderer } from "vitepress";
import type { IconifyJSON } from "@iconify-json/octicon";

// Icons that need to be used should be imported here
import { icons as mdi } from "@iconify-json/mdi";
import { icons as octicon } from "@iconify-json/octicon";
// 1. Install emoji pack with `pnpm add -g @iconify-json/<icon>`
// 2. Import them like I did above
// 3. Add it to this emojis array, like I did for octicon, and add a prefix
const emojis: { pack: IconifyJSON; prefix?: string }[] = [
  // octicon emojis, prefixed with "octicon-"
  { pack: octicon, prefix: "octicon-" },
  { pack: mdi, prefix: "mdi-" },
];

const defs: Record<string, string> = {};

for (const elem of emojis) {
  for (const key in elem.pack.icons) {
    if (elem.prefix) defs[elem.prefix + key] = "";
    else defs[key] = "";
  }
}

export { defs };

export function emojiRender(md: MarkdownRenderer) {
  md.renderer.rules.emoji = (tokens, idx) => {
    for (const emoji of emojis) {
      if (tokens[idx].markup.startsWith(emoji.prefix!)) {
        return `<span class="i-${tokens[idx].markup}"></span>`;
      }
    }

    return `<span class="i-twemoji-${tokens[idx].markup}"></span>`;
  };
}
