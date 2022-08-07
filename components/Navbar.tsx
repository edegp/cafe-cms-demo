/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import github from "public/img/github-icon.svg";
import logo from "public/img/logo.svg";
import { Typography } from "antd";

function Navbar() {
  const [active, setActive] = useState(false);
  const toggleHamburger = () => {
    setActive(!active);
  };
  return (
    <nav
      className="navbar top-1 bg-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Typography.Link
            href="/"
            className="navbar-item hover:cursor-pointer"
            title="Logo"
          >
            <Image src={logo} alt="Kaldi" width={"88px"} />
          </Typography.Link>
          {/* Hamburger menu */}
          <div
            className={`navbar-burger burger laptop:hidden ${
              active ? "is-active" : ""
            }`}
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
        <div
          id="navMenu"
          className={`navbar-menu shrink-0 grow laptop:flex ${
            active ? "block" : "hidden"
          }`}
        >
          <div className="algin-items-center mr-auto mb-0 block justify-start text-center laptop:flex">
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
          <div className="ml-auto justify-self-end text-center">
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
