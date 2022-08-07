import Link from "next/link";
import { client } from "../../libs/client";
import Layout from "../../components/Layout";
import BlogRoll from "../../components/BlogRoll";
import { Typography } from "antd";

export default function Home({ blogs }) {
  return (
    <Layout title={"ブログ"} description={"ブログ一覧"}>
      <div
        className="full-width-image-container margin-top-0"
        style={{
          backgroundImage: `url('/blog-index.jpg')`,
        }}
      >
        <Typography.Title
          level={2}
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
            backgroundColor: "#f40",
            color: "white",
            padding: "1rem",
          }}
        >
          Latest Stories
        </Typography.Title>
      </div>
      <section className="section">
        <div className="container">
          <div className="content">
            <BlogRoll blogs={blogs} />
          </div>
        </div>
      </section>
    </Layout>
  );
}

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blogs" });

  return {
    props: {
      blogs: data.contents,
    },
  };
};
