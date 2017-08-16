import Chartist from 'chartist';

const charts = {};

charts.classes = {
  'line': Chartist.Line,
  'bar': Chartist.Bar,
  'pie': Chartist.Pie
};

charts.init = () => {
  for (let name of Object.keys(charts.classes)) {
    const chartElements = document.querySelectorAll('.page__chart--' + name);
    for (let c of chartElements) {
      let data = eval('(' + c.innerText + ')');
      let options = {
        fullWidth: true,
      };

      options.high = data.high;
      options.low = data.low;
      options.showArea = data.showArea || false;
      options.showLine = data.showLine || true;
      options.showPoint = data.showPoint || true;
      options.stackBars = data.stackBars || false;
      options.reverseData = data.reverseData || false;
      options.horizontalBars = data.horizontalBars || false;
      options.distributeSeries = data.distributeSeries || false;
      options.showLabel = data.showLabel || true;

      c.innerText = '';
      new charts.classes[name](c, data, options);
    }
  }
}

export default charts;
