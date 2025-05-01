import React, { useEffect, useRef, useState } from "react";
import { InlineWidget } from "react-calendly";
import classNames from "classnames";

import {
  contentIntro,
  contentPricing,
  email,
  heroBackgroundImage,
  heroCallUsButtonText,
  heroEmailUsButtonText,
  heroSubtitle,
  heroTextColor,
  heroTitle,
  phoneRaw,
} from "../../cms/data";
import { items as galleryItems } from "../../cms/gallery";
import Layout from "../components/Layout";
import WeatherWidget from "../components/WeatherWidgetEnvironmentCanada";
import styles from "../styles";
import { imagePathToSmallImagePath } from "../utilities";

const Macy = typeof window !== "undefined" ? require("macy") : null;

const urlify = (text) => {
  const regex = /(https?:\/\/[^\s]+)/gi;
  return text.replace(
    regex,
    (match) =>
      `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`
  );
};

const emailify = (text) => {
  // eslint-disable-next-line no-useless-escape
  const regex =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/gi;
  return text.replace(
    regex,
    (match) => `<a href="mailto:${match}">${match}</a>`
  );
};

const IndexPage = () => {
  const gallery = useRef(null);
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    window.document.addEventListener("keydown", handleKeydown, false);

    if (typeof window !== "undefined") {
      const macy = new Macy({
        container: "#gallery-container",
        columns: 4,
        margin: {
          y: 15,
          x: 15,
        },
        breakAt: {
          [styles.sizes.widescreen]: 4,
          [styles.sizes.desktop]: 3,
          [styles.sizes.tablet]: 2,
          [styles.sizes.phone]: 1,
        },
      });

      gallery.current = macy;
    }
  }, []);

  const handleKeydown = (event) => {
    if (event.keyCode === 27) {
      setSelectedImage(null);
    }
  };

  const handleClickNavbarItem = () => {
    const burger = window.document.querySelector(".navbar-burger");
    const menu = window.document.querySelector(".navbar-menu");
    if (burger && menu) {
      burger.classList.remove("is-active");
      menu.classList.remove("is-active");
    }
  };

  const handleClickImage = (imageObject) => {
    setSelectedImage(imageObject);
  };

  const handleClickModalClose = () => {
    setSelectedImage(null);
  };

  const handleBurgerClick = () => {
    const burger = window.document.querySelector(".navbar-burger");
    const menu = window.document.querySelector(".navbar-menu");
    if (burger && menu) {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    }
  };

  return (
    <>
      <Layout>
        <section className="hero is-medium">
          <div className="hero-head">
            <nav
              className="navbar is-fixed-top"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="container">
                <div className="navbar-brand">
                  <span className="navbar-item">
                    <img src="/images/logo-brand.svg" alt="Logo" />
                  </span>
                  <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={handleBurgerClick}
                  >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                  </a>
                </div>
                <div className="navbar-menu">
                  <div className="navbar-end">
                    <a
                      className="navbar-item"
                      onClick={handleClickNavbarItem}
                      href="#booking"
                    >
                      Booking
                    </a>
                    <a
                      className="navbar-item"
                      onClick={handleClickNavbarItem}
                      href="#pricing"
                    >
                      Pricing
                    </a>
                    <a
                      className="navbar-item"
                      onClick={handleClickNavbarItem}
                      href="#weather"
                    >
                      Weather
                    </a>
                    <a
                      className="navbar-item"
                      onClick={handleClickNavbarItem}
                      href="#location"
                    >
                      Getting Here
                    </a>
                    <a
                      className="navbar-item"
                      onClick={handleClickNavbarItem}
                      href="#gallery"
                    >
                      Gallery
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div
            className="hero-body"
            style={{
              backgroundImage: `url(${heroBackgroundImage})`,
            }}
          >
            <div className="container">
              <h1
                className="title"
                style={heroTextColor ? { color: heroTextColor } : {}}
              >
                {heroTitle}
              </h1>
              <h2
                className="subtitle"
                style={heroTextColor ? { color: heroTextColor } : {}}
              >
                {heroSubtitle}
              </h2>

              <div className="hero-contact-button">
                <a className="button is-medium" href={`tel:${phoneRaw}`}>
                  <strong>{heroCallUsButtonText}</strong>
                </a>
              </div>
              <div className="hero-contact-button">
                <a className="button is-medium" href={`mailto:${email}`}>
                  <strong>{heroEmailUsButtonText}</strong>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-1">
          <div className="container content">
            <h4>{contentIntro}</h4>
          </div>
        </section>

        <section id="booking" className="section-invisible" />
        <section className="section section-1">
          <div className="container content">
            <div>
              <h2>Book a time slot:</h2>
              <InlineWidget
                url="https://calendly.com/schacreslake"
                styles={{
                  height: "630px",
                  // maxWidth: "100px",
                  // width: "100%",
                }}
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="section-invisible" />
        <section className="section">
          <div className="container content">
            <h2>Pricing:</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: emailify(urlify(contentPricing)),
              }}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            />
          </div>
        </section>

        <section id="weather" className="section-invisible" />
        <section className="section section-2">
          <div className="container content">
            <h2>Local Weather:</h2>
            <WeatherWidget />
          </div>
        </section>

        <section id="location" className="section-invisible" />
        <section className="section">
          <div className="container content">
            <h2>Location:</h2>
            <iframe
              title="Map Widget"
              allowFullScreen
              frameBorder="0"
              loading="lazy"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2429.9132120632153!2d-113.76414954852592!3d52.48070707970767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53750426db5f53b1%3A0x959a09c11b0842c7!2sSchacres%20Lake!5e0!3m2!1sen!2sca!4v1618178132883!5m2!1sen!2sca"
              style={{
                border: "none",
                height: "300px",
                width: "100%",
              }}
              title="Google Maps View"
            />
          </div>
        </section>

        <section id="gallery" className="section-invisible" />
        <section className="section">
          <div className="container content">
            <h2>Gallery</h2>

            <div id="gallery-container" className="gallery-container">
              {galleryItems.map(
                ({ image: galleryItemImageSrc, title: galleryItemTitle }) => (
                  <div
                    className="gallery-item"
                    key={galleryItemTitle}
                    onClick={() => {
                      handleClickImage({
                        src: galleryItemImageSrc,
                        title: galleryItemTitle,
                      });
                    }}
                  >
                    <img
                      className="gallery-item-image"
                      src={imagePathToSmallImagePath(galleryItemImageSrc)}
                      alt={galleryItemTitle}
                    />
                  </div>
                )
              )}
            </div>

            {selectedImage && (
              <div
                className={classNames(
                  "modal",
                  selectedImage ? "is-active" : null
                )}
              >
                <div
                  className="modal-background"
                  onClick={handleClickModalClose}
                />
                <div className="modal-content">
                  <div className="modal-title">{selectedImage.title}</div>
                  <p className="image">
                    <img src={selectedImage.src} alt={selectedImage.title} />
                  </p>
                </div>
                <button
                  className="modal-close is-large"
                  onClick={handleClickModalClose}
                  aria-label="close"
                  type="button"
                />
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <div className="content has-text-centered">
            <div>
              <span>© Schacres Lake</span>
            </div>
          </div>
        </footer>
      </Layout>
    </>
  );
};

export default IndexPage;
