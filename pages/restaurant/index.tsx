import React from "react";
import { Layout } from "antd";
import { Button } from "antd/lib/radio";
import { RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import RestaurantLayout from "components/RestaurantLayout";
import Link from "next/link";
import { useLocale } from "utils/useLocale";

export default function Restaurant() {
  const { Content, Footer } = Layout;
  const { t } = useLocale();
  return (
    <RestaurantLayout>
      <Layout className="h-full min-h-screen bg-white">
        {/* <div className="h-full relative w-full"> */}
        <Image
          src={
            "https://media.istockphoto.com/photos/stylish-dinner-picture-id1178092305"
          }
          height="100%"
          width="100%"
          alt="Restaurant"
          layout="responsive"
          // objectFit="contain"
        />
        {/* </div> */}
        <Content>
          <div className="mx-5 mt-5 text-neutral-600">
            <span className="px-3 py-0 text-lg text-neutral-600 border-l-[12px] border-l-[#00ba00]">
              {t.top.title}
            </span>
            <ul className="text-xs list-disc">
              <li className="mt-5">{t.top.msg001}</li>
              <li className="mt-5">{t.top.msg002}</li>
            </ul>
          </div>
          <div className="p-2 mt-5 mb-16 leading-5">
            <div className="mx-5 mb-0 text-xs text-neutral-500">
              {t.top.msg003}
              <br />
              {t.top.msg004}
              <br />
              <br />
              {t.top.msg005}
            </div>
          </div>
        </Content>
        <Footer className="p-0 fixed bottom-0 w-full">
          <Link href="/restaurant/areas">
            <Button
              type="large"
              className="p-0 bg-[#00ba00] text-white 
              flex flex-[1_0_auto] justify-center 
              leading-loose h-full"
              block
            >
              <span className="relative flex flex-[1_0_auto] justify-center text-lg font-bold items-center">
                {t.top.msg006}
                <RightOutlined className="flex items-center text-md h-fit" />
              </span>
            </Button>
          </Link>
        </Footer>
      </Layout>
    </RestaurantLayout>
  );
}
