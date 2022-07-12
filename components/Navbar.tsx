import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import github from "public/img/github-icon.svg";
import logo from "public/img/logo.svg";

function Navbar() {
  const [active, setActive] = useState(false);
  const [navBarActiveClass, setNavBarActiveClass] = useState("");
  const toggleHamburger = () => {
    setActive(!active);
    active ? setNavBarActiveClass("is-active") : setNavBarActiveClass("");
  };
  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link href="/" className="navbar-item" title="Logo">
            <Image src={logo} alt="Kaldi" width={"88px"} />
          </Link>
          {/* Hamburger menu */}
          <div
            className={`navbar-burger burger ${navBarActiveClass}`}
            data-target="navMenu"
            role="menuitem"
            tabIndex={0}
            onKeyPress={() => toggleHamburger()}
            onClick={() => toggleHamburger()}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div id="navMenu" className={`navbar-menu ${navBarActiveClass}`}>
          <div className="navbar-start has-text-centered">
            <Link href="/about">
              <a className="navbar-item">About</a>
            </Link>
            <Link href="/products">
              <a className="navbar-item">Products</a>
            </Link>
            <Link href="/blog">
              <a className="navbar-item">Blog</a>
            </Link>
            <Link href="/contact">
              <a className="navbar-item">Contact</a>
            </Link>
            <Link href="/contact/examples">
              <a className="navbar-item">Form Examples</a>
            </Link>
          </div>
          <div className="navbar-end has-text-centered">
            <a
              className="navbar-item"
              href="https://github.com/netlify-templates/gatsby-starter-netlify-cms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon">
                <Image src={github} alt="Github" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
