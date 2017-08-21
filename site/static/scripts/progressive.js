const progressive = {};

progressive.init = () => {
  const $window = $(window);
  const images = $('.progressive').toArray();

  for (let i = 0; i < images.length; i++) {
    if (check($window.height(), $(images[i]))) {
      images.splice(i, 1);
    }
  }

  $window.on('scroll', () => {
    const dy = $window.scrollTop();
    const h = $window.height();

    for (let i = 0; i < images.length; i++) {
      const $image = $(images[i]);
      if (check(dy + h, $image)) {
        images.splice(i, 1);
      }
    }

    if (images.length == 0) {
      $window.off('scroll');
    }
  });
};

function check(scroll, $image) {
  if (scroll > $image.offset().top) {
    $image.attr('src', $image.data('final-image'))
      .on('load', () => {
        $image.addClass('progressive--loaded');
      });
  }
}

export default progressive;
