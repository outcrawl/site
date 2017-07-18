$(document).ready(function () {
  $('.katex').each(function (i, obj) {
    obj.innerHTML = katex.renderToString(obj.innerText);
  });
});
