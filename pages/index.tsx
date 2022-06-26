import React from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "../libs/client";
import Layout from "../components/Layout";
import Features from "../components/Features";
import BlogRoll from "../components/BlogRoll";
import FullWidthImage from "../components/FullWidthImage";
import HeroImage from "../public/home-jumbotron.jpg";
import Coffee from "../public/coffee.png";
import Gear from "../public/coffee-gear.png";
import Tutorials from "../public/tutorials.png";
import Meeting from "../public/meeting-space.png";

const title = "良心とともに素晴らしいコーヒーを";
const subheading = "コーヒーを楽しみながら持続可能な農業をサポート";
const blurbs = [
  {
    image: Coffee,
    text: "独立系農家や農家協同組合から直接調達したグリーンコーヒー豆とローストコーヒー豆を販売しています。 環境や地域社会に細心の注意を払って栽培されたさまざまなコーヒー豆を提供できることを誇りに思います。 現在の在庫状況については、投稿を確認するか、直接お問い合わせください。",
  },
  {
    image: Gear,
    text: "私たちは、あらゆる好みや経験レベルに合わせて、小さいながらも慎重に厳選された醸造用具とツールを提供しています。 自分の豆をローストする場合でも、最初のフレンチプレスを購入したばかりの場合でも、当店ではお気に入りのガジェットを見つけることができます。",
  },
  {
    image: Tutorials,
    text: "素晴らしい一杯のコーヒーが大好きですが、それを作る方法を知らなかったのですか？ 派手な新しいChemexを購入しましたが、使用方法がわかりませんか？ 心配しないでください、私たちは助けるためにここにいます。 バリスタとのカスタム1対1のコンサルテーションをスケジュールして、コーヒーの焙煎と醸造について知りたいことを何でも学ぶことができます。 詳細については、メールでお問い合わせいただくか、ストアにお電話ください。",
  },
  {
    image: Meeting,
    text: "おいしいコーヒーには人々を結びつける力があると私たちは信じています。 そのため、当店の一角を居心地の良いミーティングスペースに変え、コーヒー愛好家の仲間と交流したり、コーヒー作りのテクニックを学んだりすることにしました。 展示されている作品はすべて売りに出されています。 あなたが支払う全額はアーティストに行きます。",
  },
];
const IndexPage = ({ blogs }) => {
  return (
    <Layout>
      <FullWidthImage img={HeroImage} title={title} subheading={subheading} />
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="content">
                  <div className="content">
                    <div className="tile">
                      <h1 className="title">なぜ、カルディなのか</h1>
                    </div>
                    <div className="tile">
                      <h3 className="subtitle">
                        カルディは、おいしいコーヒーだけでなく、社会の役に立っているコーヒーもあるべきだと信じているすべての人のためのコーヒーストアです。
                        私たちはすべての豆を小規模の持続可能な農家から直接調達し、利益の一部が農家に寄付されるようにします。
                      </h3>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-12">
                      <h3 className="has-text-weight-semibold is-size-2">
                        良心とともに素晴らしいコーヒーを
                      </h3>
                      <p>
                        カルディは、ジャバの起源について学び、ジャバを育てた農家をサポートしたいコーヒー愛好家にとって究極のスポットです。
                        私たちはコーヒーの生産、焙煎、醸造を真剣に受け止めており、その知識を誰にでも伝えられることを嬉しく思います。
                      </p>
                    </div>
                  </div>
                  <Features gridItems={blurbs} />
                  <div className="columns">
                    <div className="column is-12 has-text-centered">
                      <Link href="/products">
                        <a className="btn">すべての商品を見る</a>
                      </Link>
                    </div>
                  </div>
                  <div className="column is-12">
                    <h3 className="has-text-weight-semibold is-size-2">
                      最近の投稿
                    </h3>
                    <BlogRoll blogs={blogs} />
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" href="/blog">
                        もっと読む
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blogs" });

  return {
    props: {
      blogs: data.contents,
    },
  };
};
