/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";

export default function FullWidthImage(props) {
  const {
    height = 400,
    img,
    title,
    subheading,
    imgPosition = "top left",
  } = props;
  return (
    <>
      <div
        className='full-width-image-container mt-0'
        style={{
          alignItems: "center",
          backgroundImage: `url(${img.src})`,
          backgroundPosition: imgPosition,
        }}
      >
        <div className='flex h-[150px] flex-col justify-around text-start leading-4'>
          {title && (
            <h1
              className='text-3xl font-bold tablet:text-2xl laptop:text-xl'
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
              className='text-md font-bold'
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
