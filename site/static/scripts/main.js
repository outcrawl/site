function buildNewsletterForm() {
  var $newsletterSuccess = $('#newsletterSuccess');
  var $newsletterError = $('#newsletterError');

  $('#subscribeButton').click(function () {
    var email = $('#emailInput').val();
    var pt = 'tQswM96k127VkJZ88mor2HFLYaDFOgjp';
    var url = 'https://outcrawl-newsletter.appspot.com/subscribe?email=' + email + '&token=' + pt;

    $.post(url)
      .done(function (data) {
        $newsletterError.hide();
        $newsletterSuccess.show();
      })
      .fail(function (xhr, status, error) {
        $newsletterSuccess.hide();
        $newsletterError.show();
      });
  });
}

$(document).ready(function () {
  $('.katex').each(function (i, obj) {
    obj.innerHTML = katex.renderToString(obj.innerText);
  });

  progressively.init();

  buildNewsletterForm();
});
