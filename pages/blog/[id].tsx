/* eslint-disable tailwindcss/no-custom-classname */
import { Col, Row, Typography } from "antd";
import Image from "next/image";
import Layout from "../../components/Layout";
import { client } from "../../libs/client";

export default function BlogId({ blog }) {
  return (
    <Layout title={blog.title} description="">
      <section className="section">
        <div className="content container">
          <Row>
            <Col span={22} offset={2}>
              <Typography.Title level={2}>{blog.title}</Typography.Title>
              <Typography.Paragraph>
                {blog.publishedAt?.split("T")[0]}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {blog.eyecatch?.url && (
                  <Image
                    src={blog.eyecatch?.url}
                    width={blog.eyecatch.width}
                    height={blog.eyecatch.height}
                    alt={blog.title}
                  />
                )}
              </Typography.Paragraph>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${blog.content}`,
                }}
              />
            </Col>
          </Row>
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
