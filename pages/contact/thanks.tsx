import { Typography } from "antd";
import React from "react";
import Layout from "../../components/Layout";

// eslint-disable-next-line
export default () => (
  <Layout
    title="お問い合わせありがとうございます。"
    description="フォーム送信用のカスタムページです"
  >
    <section className="section">
      <div className="container">
        <Typography.Title level={2}>
          お問い合わせありがとうございます。!
        </Typography.Title>
        <Typography.Paragraph>
          フォーム送信用のカスタムページです
        </Typography.Paragraph>
      </div>
    </section>
  </Layout>
);
