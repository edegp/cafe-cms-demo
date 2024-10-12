/* eslint-disable tailwindcss/no-custom-classname */
import { Col, Row, Typography } from "antd";
import Image from "next/image";
import Layout from "../../components/Layout";
import { client } from "../../libs/client";
import { GetServerSideProps } from "next";
import { blogs } from "types/cms-types";

export default function BlogId({ blog }: { blog: blogs<"patch"> }) {
  return (
    <Layout title={blog.title} description=''>
      <section className='section'>
        <div className='content container'>
          <Row>
            <Col span={22} offset={2}>
              <Typography.Title level={2}>{blog.title}</Typography.Title>
              <Typography.Paragraph>
                {blog.publishedAt?.split("T")[0]}
              </Typography.Paragraph>
              <div>
                {blog.eyecatch?.url && (
                  <Image
                    src={blog.eyecatch?.url}
                    width={blog.eyecatch.width}
                    height={blog.eyecatch.height}
                    alt={blog.title}
                  />
                )}
              </div>
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
  const data: blogs<"gets">
   = await client.get({ endpoint: "blogs" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps: GetServerSideProps  = async (context) => {
  const id = context?.params?.id;
  if (typeof id !== "string") {
    throw Error("id is not string");
  }
  const data: blogs<"gets"> = await client.get({ endpoint: "blogs", contentId: id });
  return {
    props: {
      blog: data,
    },
    revalidate: 60,
  };
};
