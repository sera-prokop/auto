// $(document).ready(function(){
//
//
//
// });

var swiper = new Swiper('.header-slider', {
    pagination: '.header-slider__toggle',
    paginationClickable: true,
    paginationCustomRender: function (swiper, current, total) {
      return current + ' of ' + total;
  },
});

var swiperTwo = new Swiper('.offers__slider', {
    slidesPerView: '3',
    spaceBetween: 50,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    breakpoints: {
      768: {
          slidesPerView: 2,
          spaceBetween: 30
      },
      640: {
          slidesPerView: 1,
          spaceBetween: 10
      }
    }
});
