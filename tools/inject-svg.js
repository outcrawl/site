var fs = require('fs');
var replace = require('gulp-replace');

module.exports = function () {
  return replace(/<img .*src="(.*svg)".*>/g, function (element, file) {
    // get attributes
    var width = /width=\"([^"]*)\"/.exec(element);
    var height = /height=\"([^"]*)\"/.exec(element);
    var clazz = /class=\"([^"]*)\"/.exec(element);

    // read svg file
    var svg = fs.readFileSync('dist' + file, 'utf8').replace(/\r?\n|\r/g, '');

    // inject attributes in svg element if they exist
    if (width) {
      svg = svg.replace(/<svg/, '<svg ' + width[0]);
    }
    if (height) {
      svg = svg.replace(/<svg/, '<svg ' + height[0]);
    }
    if (clazz) {
      svg = svg.replace(/<svg/, '<svg ' + clazz[0]);
    }

    return svg;
  });
};