/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import Layout from "components/Layout";

const AboutPage = () => {
  return (
    <Layout title="KALDIの価値" description="">
      <section className="section section--gradient">
        <div className="container">
          <div className="columns flex flex-row">
            <div className="basis-10/12">
              <div className="section">
                <h2 className="title text-3xl font-bold">KALDIの価値</h2>
                <div className="content">
                  <h3>日陰で育てられたコーヒー</h3>
                  <p>
                    {" "}
                    コーヒーは、野生の形で下層植生に生える小さな木または低木であり、伝統的に日陰を提供する他の木の下で商業的に栽培されていました。日陰のコーヒー農園の森のような構造は、多数の移動性および居住性の種の生息地を提供します。
                  </p>
                  <h3>シングルオリジン</h3>
                  <p>
                    シングルオリジンコーヒーは、単一の既知の地理的起源内で栽培されたコーヒーです。場合によっては、これは単一の農場または単一の国からの豆の特定のコレクションです。その場合、コーヒーの名前は通常、利用可能な程度にまで栽培された場所です。
                  </p>
                  <h3>持続可能な農業</h3>
                  <p>
                    持続可能な農業とは、生態系サービスの理解、生物とその環境との関係の研究に基づいた持続可能な方法での農業です。何がどこでどのように成長するかは、選択の問題であり、自然とコミュニティを慎重に検討する必要があります。
                  </p>
                  <h3>直接調達</h3>
                  <p>
                    直接取引は、一部のコーヒー焙煎業者が実践している調達の一形態です。直接取引慣行の支持者は、品質を奨励および奨励するシステムとともに、バイヤーと農家の間の直接のコミュニケーションと価格交渉を促進します。
                  </p>
                  <h3>利益を寄付する</h3>
                  <p>
                    私たちはあなたに素晴らしいコーヒーをもたらすコミュニティに真に力を与えたいと思っています。そのため、私たちは利益の20％を、コーヒーが栽培されているすべての場所の農場、地元の企業、学校に再投資しています。私たちのブログで、コミュニティが成長し、コーヒー生産についてさらに学ぶことができます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
