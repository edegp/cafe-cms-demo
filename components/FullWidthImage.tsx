import React from "react";

export default function FullWidthImage(props) {
  const {
    height = 400,
    img,
    title,
    subheading,
    imgPosition = "top left",
    bgAttachment = "unset",
  } = props;
  const imageURL = `${
    process.env.NODE_ENV === "production"
      ? "https://cafe-cms-demo.vercel.app"
      : "http://localhost:3000"
  }${img.src}`;
  const bgClass =
    bgAttachment === "fixed"
      ? `full-width-image mt-0`
      : `full-width-image-container mt-0`;
  return (
    <>
      <div
        className={bgClass}
        style={{
          alignItems: "center",
          backgroundImage: `url(${img.src})`,
          backgroundPosition: imgPosition,
          backgroundAttachment: bgAttachment,
        }}
      >
        <div className="algin-start flex h-[150px] flex-col justify-around leading-4">
          {title && (
            <h1
              className="text-bold text-3xl tablet:text-2xl laptop:text-xl"
              style={{
                boxShadow:
                  "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                backgroundColor: "rgb(255, 68, 0)",
                color: "white",
                lineHeight: "1",
                padding: "0.25em",
              }}
            >
              {title}
            </h1>
          )}
          {subheading && (
            <h3
              className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
              style={{
                boxShadow:
                  "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                backgroundColor: "rgb(255, 68, 0)",
                color: "white",
                lineHeight: "1",
                padding: "0.25rem",
                marginTop: "0.5rem",
              }}
            >
              {subheading}
            </h3>
          )}
        </div>
      </div>
    </>
  );
}
