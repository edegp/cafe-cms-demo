import React from "react";
import Image from "next/image";
import Layout from "components/Layout";
import Features from "components/Features";
import Testimonials from "components/Testimonials";
import Pricing from "components/Pricing";
import FullWidthImage from "components/FullWidthImage";
import fullImage from "public/img/products-full-width.jpg";
import HeroImage from "public/img/jumbotron.jpg";
import Main1 from "public/img/products-grid3.jpg";
import Main2 from "public/img/products-grid2.jpg";
import Main3 from "public/img/products-grid1.jpg";
import Coffee from "public/img/coffee.png";
import Gear from "public/img/coffee-gear.png";
import Tutorials from "public/img/tutorials.png";
import Meeting from "public/img/meeting-space.png";

const title = "Our Coffee";
const blurbs = [
  {
    image: Coffee,
    text: "契約農家や農協から直接調達したグリーンコーヒー豆とローストコーヒー豆を販売しています。 環境や地域社会に細心の注意を払って栽培されたさまざまなコーヒー豆を提供できることを誇りに思います。 現在の在庫状況については、投稿を確認するか、直接お問い合わせください。",
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
const plans = [
  {
    description: "1日1〜2杯を楽しむのが好きな方に最適です。",
    items: [
      " 月額 1.3kgのコーヒー",
      "生豆または焙煎豆",
      "1つまたは2つの種類の豆",
    ],
    plan: "Small",
    price: "50",
  },
  {
    description:
      "熱心なコーヒー愛好家の方、カップルでJavaを楽しみたい方、大人数に最適",
    items: ["月に2.7kgのコーヒー", "生豆または焙煎豆", "最大4種類の豆"],
    plan: "Big",
    price: "80",
  },
  {
    description:
      "さまざまな品種から小分けのコーヒーが必要な方 カスタムプランをお試しください",
    items: ["あなたに必要なものは何でも", "生豆または焙煎豆", "無制限の品種"],
    plan: "Custom",
    price: "??",
  },
];
const ProductPage = ({ data }) => {
  return (
    <Layout title="商品紹介" description="カルディの商品紹介ページ">
      <div className="content">
        <FullWidthImage img={HeroImage} title={title} imgPosition="bottom" />
        <section className="section section--gradient">
          <div className="container">
            <div className="section">
              <div className="columns">
                <div className="column is-7 is-offset-1">
                  <h3 className="has-text-weight-semibold is-size-2">
                    良心とともに素晴らしいコーヒーを
                  </h3>
                  <p>
                    カルディは、ジャワの起源について学び、ジャワを育てた農家を支援したいコーヒー愛好家にとって究極の場所です。
                    私たちはコーヒーの生産、焙煎、醸造を真剣に受け止めており、その知識を誰にでも伝えて喜んでいます。
                  </p>
                </div>
              </div>
              <div className="columns">
                <div className="column is-10 is-offset-1">
                  <Features gridItems={blurbs} />
                  <div className="columns">
                    <div className="column is-7">
                      <h3 className="has-text-weight-semibold is-size-3">
                        妥協のないすぐれたコーヒー
                      </h3>
                      <p>
                        低木からカップまで、コーヒーを最高水準に保ちます。
                        だからこそ、私たちはコーヒーの旅の各ステップについて細心の注意を払い、透明性を保っています。
                        私たちは各農場を個人的に訪問し、植物、農家、地域の環境に最適な条件であることをチェックしています。
                      </p>
                    </div>
                  </div>
                  <div className="tile is-ancestor">
                    <div className="tile is-vertical">
                      <div className="tile">
                        <div className="tile is-parent is-vertical">
                          <article className="tile is-child overflow-hidden rounded-lg">
                            <Image
                              alt="プロダクト1"
                              quality={80}
                              src={Main1}
                              layout="responsive"
                              objectFit="cover"
                            />
                          </article>
                        </div>
                        <div className="tile is-parent ">
                          <article className="tile is-child overflow-hidden rounded-lg">
                            <Image
                              alt="プロダクト2"
                              src={Main2}
                              layout="responsive"
                              objectFit="cover"
                            />
                          </article>
                        </div>
                      </div>
                      <div className="tile is-parent">
                        <article className="tile is-child overflow-hidden rounded-lg">
                          <Image
                            alt="プロダクト3"
                            src={Main3}
                            layout="responsive"
                            objectFit="cover"
                          />
                        </article>
                      </div>
                    </div>
                  </div>
                  <Testimonials
                    className="mb-5"
                    testimonials={[
                      {
                        author: "エリザベス・カウリスマキ",
                        quote:
                          "初めてカルディのコーヒーを試したとき、それが毎朝飲んでいたものと同じだとは信じられませんでした。",
                      },
                      {
                        author: "フィリップ・トロムラー",
                        quote:
                          "カルディは、最高品質のコーヒーが必要な場合に行く場所です。 農民に力を与え、透明性を高めるという彼らの姿勢が大好きです。",
                      },
                    ]}
                  />
                  <FullWidthImage img={fullImage} imgPosition={"bottom"} />
                  <h2 className="has-text-weight-semibold is-size-2">
                    サブスクリプション
                  </h2>
                  <p className="text-sm">
                    私たちはあなたの人生の一部として素晴らしいコーヒーを作るのを簡単にします。
                    毎月のサブスクリプションプランの1つを選択して、毎月玄関先でおいしいコーヒーを受け取ります。
                    詳細とお支払い情報についてはお問い合わせください。
                  </p>
                  <Pricing data={plans} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="section section--gradient">
          <div className="container">
            <div className="section">
              <div className="columns">
                <div className="column is-10 is-offset-1"></div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </Layout>
  );
};

export default ProductPage;
