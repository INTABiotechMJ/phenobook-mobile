navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
var onSuccess = function(position) {
  localStorage.setItem('latitude',position.coords.latitude);
  localStorage.setItem('longitude',position.coords.longitude);
  /*
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
            */
  };

  // onError Callback receives a PositionError object
  //
  function onError(error) {
    console.log("GPS Error: " + error.code + " - " + error.message);
  }
