import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Button, Input, Form, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function Index() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log(values);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "contact",
        ...values,
      }),
    })
      .then(() => router.push("/contact/thanks/"))
      .catch((error) => alert(error));
  };
  return (
    <Layout title="コンタクト" description="コンタクトページ">
      <section className="section">
        <div className="container">
          <Typography.Title level={2}>お問い合わせ</Typography.Title>
          <Form
            form={form}
            layout="vertical"
            name="contact"
            onFinish={handleSubmit}
          >
            <Form.Item label="名前" name="name" id="name" required={true}>
              <Input type="text" />
            </Form.Item>
            <Form.Item label="メール" name="email" id="email" required={true}>
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="お問い合わせ内容"
              name="message"
              id="message"
              required={true}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                送る
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </Layout>
  );
}
