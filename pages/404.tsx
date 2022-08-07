import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 3000);
  });
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <main className="main">
      <p>ページがありません。</p>
      <p>三秒後にトップページに戻ります。</p>
    </main>
  );
}
