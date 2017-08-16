var fs = require('fs');
var replace = require('gulp-replace');

module.exports = function () {
  return replace(/<img .*src="(.*svg)".*>/g, function (element, file) {
    // read svg file
    var svg = fs.readFileSync('dist' + file, 'utf8').replace(/\r?\n|\r/g, '');

    // copy attributes
    var attrs = /(width|height|style|class)=\"(.*?)\"/gi.exec(element);

    console.log(element);
    for (var i = 0; i < attrs.length; i++) {
      console.log(attrs[i]);
    }

    /*
    if (width) {
      svg = svg.replace(/<svg/, '<svg ' + width[0]);
    }
    if (height) {
      svg = svg.replace(/<svg/, '<svg ' + height[0]);
    }
    if (clazz) {
      svg = svg.replace(/<svg/, '<svg ' + clazz[0]);
    }
    */

    return svg;
  });
};
