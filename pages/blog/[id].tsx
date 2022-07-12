import Image from "next/image";
import Layout from "../../components/Layout";
import { client } from "../../libs/client";

export default function BlogId({ blog }) {
  return (
    <Layout title={blog.title} description="">
      <section className="section">
        <div className="container content">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <h1>{blog.title}</h1>
              <p>{blog.publishedAt?.split("T")[0]}</p>
              <p>
                {blog.eyecatch?.url && (
                  <Image
                    src={blog.eyecatch?.url}
                    width={blog.eyecatch.width}
                    height={blog.eyecatch.height}
                    alt={blog.title}
                  />
                )}
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${blog.content}`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blogs" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blogs", contentId: id });

  return {
    props: {
      blog: data,
    },
    revalidate: 60,
  };
};
