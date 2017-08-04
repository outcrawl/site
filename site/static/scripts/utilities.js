function httpGet(url, token) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'GET',
      crossDomain: true,
      dataType: 'json',
      beforeSend: xhr => {
        if (token) {
          xhr.setRequestHeader('X-Token', token);
        }
      },
      success: resolve,
      error: (xhr, status) => {
        reject(xhr);
      }
    });
  });
}

function httpPost(url, token) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'POST',
      crossDomain: true,
      dataType: 'json',
      beforeSend: xhr => {
        if (token) {
          xhr.setRequestHeader('X-Token', token);
        }
      },
      success: resolve,
      error: (xhr, status) => {
        reject(xhr);
      }
    });
  });
}
