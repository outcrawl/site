import React from 'react';

exports.onRenderBody = ({
  setHeadComponents
}) => {
  setHeadComponents([
    <link key={0} href="https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:300,400,500,700" rel ="stylesheet" />,
    <script key={1} src="https://apis.google.com/js/api.js"></script>
  ]);
};
