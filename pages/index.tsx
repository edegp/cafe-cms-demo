/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { client } from "libs/client";
import { Rate, Card, Avatar, Row, Col, Button } from "antd";
import Layout from "components/Layout";
import Features from "components/Features";
import BlogRoll from "components/BlogRoll";
import FullWidthImage from "components/FullWidthImage";
import HeroImage from "public/img/home-jumbotron.jpg";
import Coffee from "public/img/coffee.png";
import Gear from "public/img/coffee-gear.png";
import Tutorials from "public/img/tutorials.png";
import Meeting from "public/img/meeting-space.png";
import { Layout as AntdLayout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Typography } from "antd";

const title = "良心とともに素晴らしいコーヒーを";
const subheading = "コーヒーを楽しみながら持続可能な農業をサポート";
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
const IndexPage = ({ blogs, result }) => {
  const { Link: AntdLink, Paragraph, Title } = Typography;
  const button =
    "mb-vw-16 justify-self-center border-primary px-8 py-4 text-primary";
  return (
    <Layout
      title="カルディ非公式　ホームページ"
      description="カルディホームページのトップぺージです"
    >
      <AntdLayout>
        <FullWidthImage img={HeroImage} title={title} subheading={subheading} />
        <Content className="container">
          <div className="grid grid-flow-row gap-y-12">
            <div className="my-vw-16">
              <Title level={3} className="text-semibold text-2xl ">
                予約
              </Title>
              <Button
                className="my-8 flex min-h-[64px] w-full items-center justify-center rounded-md border-2 border-primary bg-white text-sm font-bold text-primary"
                href="/restaurant"
              >
                予約する
              </Button>
            </div>
            <div className="content">
              <Title
                level={1}
                className="title break-[wordbreak] font-black text-primary"
              >
                なぜ、カルディなのか
              </Title>
              <Title level={3} className="subtitle">
                カルディは、おいしいコーヒーだけでなく、社会の役に立っているコーヒーもあるべきだと信じているすべての人のためのコーヒーストアです。
                私たちはすべての豆を小規模の持続可能な農家から直接調達し、利益の一部が農家に寄付しています。
              </Title>
            </div>
            <div className="columns">
              <div className="basis-full">
                <Title level={3} className="text-3xl font-bold text-primary">
                  良心とともに素晴らしいコーヒーを
                </Title>
                <Paragraph>
                  カルディは、ジャバの起源について学び、ジャバを育てた農家をサポートしたいコーヒー愛好家にとって究極の場所です。
                  私たちはコーヒーの生産、焙煎、醸造を真剣に受け止めており、その知識を誰にでも伝えられることを嬉しく思います。
                </Paragraph>
              </div>
            </div>
            <div className="grid">
              <Features gridItems={blurbs} />
              <Link href="/products" passHref>
                <Button className={button}>すべての商品を見る</Button>
              </Link>
            </div>
            <div>
              <Title level={3} className="text-3xl font-semibold">
                お客様からの口コミ
              </Title>
              <Title level={3} className="mb-6 inline-block">
                総合評価:
              </Title>
              <Rate
                className="inline-block"
                disabled
                defaultValue={result.rating}
              />
              <Row gutter={[32, 32]} justify="space-around" className=" mb-10">
                {result.reviews.map((review, index) => {
                  return (
                    <Col key={index} md={24} lg={12} xl={8} className="w-full">
                      <Card hoverable className="min-h-[300px]">
                        <div className="grid grid-flow-row gap-y-4">
                          <Link href={review.author_url} passHref>
                            <AntdLink className="col-span-1">
                              <Avatar src={review.profile_photo_url} />
                              <Title level={5} className="ml-5 inline-block">
                                {review.author_name}
                              </Title>
                            </AntdLink>
                          </Link>
                          <Paragraph className="col-span-1 ml-6 text-gray-500">
                            {review.relative_time_description}
                          </Paragraph>
                          <Rate
                            className="col-span-1 justify-self-end"
                            disabled
                            defaultValue={review.rating}
                          />
                          <Paragraph className="row-span-6 self-center">
                            {review.text}
                          </Paragraph>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="grid gap-y-10">
              <Title level={3} className="text-3xl font-semibold">
                最近の投稿
              </Title>
              <BlogRoll blogs={blogs} />
              <Button className={button} href="/blog">
                もっと読む
              </Button>
            </div>
          </div>
        </Content>
      </AntdLayout>
    </Layout>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blogs" });
  const result = await axios
    .get(
      `https://maps.googleapis.com/maps/api/place/details/json?language=ja&place_id=ChIJD3OsNGDxGGAR-ZP3DqsU1DE&key=${process.env.GOOGLE_API_KEY}`
    )
    .then((result) => result.data?.result)
    .catch((err) => err);
  return {
    props: {
      blogs: data.contents,
      result,
    },
  };
};
