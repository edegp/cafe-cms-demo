/* eslint-disable tailwindcss/no-custom-classname */
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
  return (
    <>
      <div
        className={`${
          bgAttachment === "fixed"
            ? "full-width-image"
            : "full-width-image-container"
        } mt-0`}
        style={{
          alignItems: "center",
          backgroundImage: `url(${img.src})`,
          backgroundPosition: imgPosition,
          backgroundAttachment: bgAttachment,
        }}
      >
        <div className="flex flex-col justify-around h-[150px] leading-4 algin-start">
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
