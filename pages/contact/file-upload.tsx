import * as React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

function encode(data) {
  const formData = new FormData();

  for (const key of Object.keys(data)) {
    formData.append(key, data[key]);
  }

  return formData;
}

export default function Contact() {
  const router = useRouter();
  const [state, setState] = React.useState({
    botField: "",
    name: "",
    attachment: null,
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAttachment = (e) => {
    setState({ ...state, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch("/", {
      method: "POST",
      body: encode({
        "form-name": form.getAttribute("name"),
        ...state,
      }),
    })
      .then(() => router.push(form.getAttribute("action")))
      .catch((error) => alert(error));
  };

  return (
    <Layout title="ファイル送信" description="ファイル送信ページ">
      <section className="section">
        <div className="container">
          <div className="content">
            <h1>File Upload</h1>
            <form
              name="file-upload"
              method="post"
              action="/contact/thanks/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="file-upload" />
              <div hidden>
                <label>
                  Don’t fill this out:{" "}
                  <input name="bot-field" onChange={handleChange} />
                </label>
              </div>
              <div className="field">
                <label className="label" htmlFor={"name"}>
                  Your name
                </label>
                <div className="control">
                  <input
                    className="input"
                    type={"text"}
                    name={"name"}
                    onChange={handleChange}
                    id={"name"}
                    required={true}
                  />
                </div>
              </div>
              <div className="field">
                <div className="file">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      name="attachment"
                      onChange={handleAttachment}
                    />
                    <span className="file-cta">
                      <span className="file-label">Choose a file…</span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="field">
                <button className="button is-link" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
