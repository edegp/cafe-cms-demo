/* eslint-disable tailwindcss/no-custom-classname */
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "public/img/logo.svg";
import facebook from "public/social/facebook.svg";
import instagram from "public/social/instagram.svg";
import twitter from "public/social/twitter.svg";
import vimeo from "public/social/vimeo.svg";

function Footer() {
  return (
    <footer className="footer bg-neutral-800 text-whiteTer">
      <div className="content text-center">
        <Image
          src={logo}
          alt="Kaldi"
          style={{ width: "14em", height: "10em" }}
        />
      </div>
      <div className="content bg-neutral-800 text-center text-whiteTer">
        <div className="container bg-neutral-800 text-whiteTer">
          <div className="max-w-screen grid grid-cols-3">
            <div className="column is-4">
              <section className="menu">
                <ul className="menu-list">
                  <li>
                    <Link href="/" className="navbar-item">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="navbar-item" href="/about">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link className="navbar-item" href="/products">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link className="navbar-item" href="/contact/examples">
                      Form Examples
                    </Link>
                  </li>
                  <li>
                    <a
                      className="navbar-item"
                      href="/admin/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Admin
                    </a>
                  </li>
                </ul>
              </section>
            </div>
            <div className="column is-4">
              <section>
                <ul className="menu-list">
                  <li>
                    <Link className="navbar-item" href="/blog">
                      Latest Stories
                    </Link>
                  </li>
                  <li>
                    <Link className="navbar-item" href="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
            <div className="flex place-content-between align-middle">
              <a title="facebook" href="https://facebook.com">
                <Image
                  src={facebook}
                  alt="Facebook"
                  // layout="fill"
                  width="24"
                  height="24"
                  // style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="twitter" href="https://twitter.com">
                <Image
                  className="fas fa-lg"
                  src={twitter}
                  // layout="fill"
                  alt="Twitter"
                  width="24"
                  height="24"
                  // style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="instagram" href="https://instagram.com">
                <Image
                  src={instagram}
                  alt="Instagram"
                  // layout="fill"
                  width="24"
                  height="24"
                  // style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="vimeo" href="https://vimeo.com">
                <Image
                  src={vimeo}
                  alt="Vimeo"
                  // layout="fill"
                  width="24"
                  height="24"
                  // style={{ width: "1em", height: "1em" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
