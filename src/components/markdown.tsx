"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * Assistant text rendered as Markdown.
 *
 * memo matters here: while a reply streams, the parent re-renders on every
 * token. Without memo every already-rendered turn would re-parse its Markdown
 * on each of those renders, which is the classic reason a chat UI gets slower
 * the longer the conversation runs.
 *
 * rehype-highlight runs at render time. That is acceptable for turn-sized text;
 * if very long code blocks ever become common, this is the first thing to move
 * off the main thread.
 */
function MarkdownImpl({ text }: { text: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          // No custom `code` renderer: react-markdown v10 dropped the `inline`
          // prop, so styling must key off the parent <pre> instead. globals.css
          // already does that (`.md code` vs `.md pre code`), which is both
          // simpler and correct for both forms.
          //
          // External links open in a new tab, and rel prevents the opened page
          // from getting a handle on this one.
          a({ href, children, ...props }) {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export const Markdown = memo(MarkdownImpl);
