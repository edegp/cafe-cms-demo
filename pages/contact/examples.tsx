/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { List, Typography } from "antd";

export default function Index() {
  return (
    <Layout
      title="例"
      description="これは、microCMSのフォーム処理とNextを統合したサイトの例です。"
    >
      <section className="section">
        <div className="container">
          <Typography.Title level={2}>こんにちは！！</Typography.Title>
          <Typography.Paragraph>
            これは、microCMSのフォーム処理とNextを統合したサイトの例です。
          </Typography.Paragraph>
          <List>
            <List.Item>
              <Link href="/contact">基本お問い合わせフォーム</Link>
            </List.Item>
          </List>
        </div>
      </section>
    </Layout>
  );
}
