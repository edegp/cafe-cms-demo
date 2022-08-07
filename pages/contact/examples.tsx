import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";

export default class Index extends React.Component {
  render() {
    return (
      <Layout
        title="例"
        description="これは、microCMSのフォーム処理とNextを統合したサイトの例です。"
      >
        <section className="section">
          <div className="container">
            <div className="content">
              <h1>Hi people</h1>
              <p>
                これは、microCMSのフォーム処理とNextを統合したサイトの例です。
              </p>
              <ul>
                <li>
                  <Link href="/contact">基本お問い合わせフォーム</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
