/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import Image from "next/image";

const FeatureGrid = ({ gridItems }) => (
  <div className="columns is-multiline">
    {gridItems.map((item) => (
      <div key={item.text} className="column is-6">
        <section className="section">
          <div className="has-text-centered">
            <div className="w-[240px] inline-block">
              <Image
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
