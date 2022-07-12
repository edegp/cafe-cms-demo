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
    <footer className="footer has-background-black has-text-white-ter">
      <div className="content has-text-centered">
        <Image
          src={logo}
          alt="Kaldi"
          style={{ width: "14em", height: "10em" }}
        />
      </div>
      <div className="content has-text-centered has-background-black has-text-white-ter">
        <div className="container has-background-black has-text-white-ter">
          <div style={{ maxWidth: "100vw" }} className="columns">
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
            <div className="column is-4 social">
              <a title="facebook" href="https://facebook.com">
                <Image
                  src={facebook}
                  alt="Facebook"
                  style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="twitter" href="https://twitter.com">
                <Image
                  className="fas fa-lg"
                  src={twitter}
                  alt="Twitter"
                  style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="instagram" href="https://instagram.com">
                <Image
                  src={instagram}
                  alt="Instagram"
                  style={{ width: "1em", height: "1em" }}
                />
              </a>
              <a title="vimeo" href="https://vimeo.com">
                <Image
                  src={vimeo}
                  alt="Vimeo"
                  style={{ width: "1em", height: "1em" }}
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
