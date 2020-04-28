
  import React, { useState, useEffect } from 'react';
  import Swiper from 'react-id-swiper';

  const Gallery = () => {
    const [gallerySwiper, getGallerySwiper] = useState(null);
    const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
    const gallerySwiperParams = {
      getSwiper: getGallerySwiper,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    };

    const thumbnailSwiperParams = {
      getSwiper: getThumbnailSwiper,
      spaceBetween: 10,
      centeredSlides: true,
      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true
    };

    useEffect(() => {
      if (
        gallerySwiper !== null &&
        gallerySwiper.controller &&
        thumbnailSwiper !== null &&
        thumbnailSwiper.controller
      ) {
        gallerySwiper.controller.control = thumbnailSwiper;
        thumbnailSwiper.controller.control = gallerySwiper;
      }
    }, [gallerySwiper, thumbnailSwiper]);

    return (
      <div>
        <Swiper {...gallerySwiperParams}>
          <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/1)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/2)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/3)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/4)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/600/600/nature/5)' }} />
        </Swiper>
        <Swiper {...thumbnailSwiperParams}>
          <div style={{ backgroundImage:'url(http://lorempixel.com/300/300/nature/1)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/300/300/nature/2)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/300/300/nature/3)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/300/300/nature/4)' }} />
          <div style={{ backgroundImage:'url(http://lorempixel.com/300/300/nature/5)' }} />
        </Swiper>
      </div>
    );
  };

  export default Gallery;
    