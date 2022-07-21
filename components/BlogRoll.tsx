/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import Image from "next/image";
import Link from "next/link";

// const htmlToText = (html) => {
//   const getNodes = function* (doc, filter) {
//     const iter = doc.createNodeIterator(doc, filter);
//     let node;
//     while ((node = iter.nextNode()) !== null) {
//       yield node;
//     }
//   };

//   const doc = new DOMParser().parseFromString(html, "text/html");
//   return Array.from(
//     getNodes(doc, NodeFilter.SHOW_TEXT),
//     (x) => x.nodeValue
//   ).join("");
// };
export default function BlogRoll({ blogs }) {
  return (
    <div className="columns is-multiline">
      {blogs &&
        blogs.map((blog) => (
          <div className="is-parent column is-6" key={blog.id}>
            <article
              className="blog-list-item tile is-child box notification"
              //  ${
              //   blog.frontmatter.featuredpost ? "is-featured" : ""
              // }`}
            >
              <header>
                {blog.eyecatch ? (
                  <div className="featured-thumbnail h-full">
                    <div className="first:rounded-sm max-w-[120px] w-full first:overflow-hidden min-w-[40px]">
                      <Image
                        src={blog.eyecatch.url}
                        width={blog.eyecatch.width}
                        height={blog.eyecatch.height}
                        alt={blog.title}
                      />
                    </div>
                  </div>
                ) : null}
                <p className="post-meta">
                  <Link href={`/blog/${blog.id}`}>
                    <a className="title has-text-primary text-sm">
                      {blog.title}
                    </a>
                  </Link>
                  <br />
                  <span className="subtitle is-block text-xs">
                    {blog.publishedAt
                      ?.split("T")[0]
                      .split("-")
                      .map((e, i) =>
                        i === 0
                          ? e + "年"
                          : i === 1
                          ? e + "月"
                          : i === 2 && e + "日"
                      )}
                  </span>
                </p>
              </header>
              <p className="text-xs">
                {/* {htmlToText(blog.content).substr(0, 150) + "…"} */}

                {blog.content
                  .match(/[^\<\>]+(?=\<[^\<\>]+\>)|[^\<\>]+$/g)
                  .join(" ")
                  .substr(0, 150) + "…"}
                <br />
                <br />
                <Link className="button" href={`/blog/${blog.id}`}>
                  続きを読む →
                </Link>
              </p>
            </article>
          </div>
        ))}
    </div>
  );
}
