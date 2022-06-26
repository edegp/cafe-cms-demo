import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogRoll({ blogs }) {
  // const excerpt = (content) => {
  //   const p = (
  //     <p
  //       dangerouslySetInnerHTML={{
  //         __html: content,
  //       }}
  //     />
  //   );
  //   return p.textContent;
  // };
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
                  <div className="featured-thumbnail">
                    <div className="rounded-2xl w-[120px]">
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
                    <a className="title has-text-primary is-size-4">
                      {blog.title}
                    </a>
                  </Link>
                  <br />
                  <span className="subtitle is-size-5 is-block">
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
              <p>
                {/* {excerpt(blog.content)} */}

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
