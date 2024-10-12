/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogs } from "types/cms-types";

export default function BlogRoll({ blogs }: { blogs: blogs<"gets">["contents"] }) {
  return (
    <div className='grid grid-cols-1 gap-6  laptop:grid-cols-2'>
      {blogs &&
        blogs.map((blog) => (
          <div key={blog.id}>
            <article className='blog-list-item box notification bg-amber-700/20 '>
              <header>
                {blog.eyecatch ? (
                  <div className='featured-thumbnail h-full'>
                    <div className='w-full min-w-[40px] max-w-[120px] first:overflow-hidden first:rounded-sm'>
                      <Image
                        src={blog.eyecatch.url}
                        width={blog.eyecatch.width}
                        height={blog.eyecatch.height}
                        alt={blog.title}
                      />
                    </div>
                  </div>
                ) : null}
                <div className='post-meta'>
                  <Link href={`/blog/${blog.id}`}>
                    <a className='title text-sm text-primary'>{blog.title}</a>
                  </Link>
                  <br />
                  <span className='subtitle block text-xs'>
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
                </div>
              </header>
              <div className='text-xs'>
                {blog.content
                  .match(/[^\<\>]+(?=\<[^\<\>]+\>)|[^\<\>]+$/g)
                  ?.join(" ")
                  .substr(0, 150) + "…"}
                <br />
                <br />
                <Link className='button' href={`/blog/${blog.id}`}>
                  続きを読む →
                </Link>
              </div>
            </article>
          </div>
        ))}
    </div>
  );
}
