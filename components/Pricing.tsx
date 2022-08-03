/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";

const Pricing = ({ data }) => (
  <div className="grid grid-cols-1 tablet:grid-cols-3">
    {data.map((price) => (
      <div key={price.plan} className="column">
        <section className="section">
          <h4 className="text-center text-semibold">{price.plan}</h4>
          <h2 className="text-xl text-center text-primary text-bold">
            ${price.price}
          </h2>
          <p className="text-semibold">{price.description}</p>
          <ul>
            {price.items.map((item) => (
              <li key={item} className="text-xs">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    ))}
  </div>
);
export default Pricing;
