/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import Image from "next/image";

const FeatureGrid = ({ gridItems }) => (
  <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4">
    {gridItems.map((item) => (
      <div key={item.text}>
        <section className="section">
          <div className="text-center">
            <div className="inline-block w-[240px]">
              <Image
                alt={item.text}
                src={item.image}
                objectFit="contain"
                layout="intrinsic"
                width="240"
                height="190"
              />
            </div>
          </div>
          <p className="text-xs">{item.text}</p>
        </section>
      </div>
    ))}
  </div>
);

export default FeatureGrid;
