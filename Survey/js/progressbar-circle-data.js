var bar1_1 = new ProgressBar.Circle(attentionGrabbing, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#d50000', width: 1 },
  to: { color: '#d50000', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);


    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});

var bar1_2 = new ProgressBar.Circle(engrossing, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aa00ff', width: 1 },
  to: { color: '#aa00ff', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});

var bar1_3 = new ProgressBar.Circle(cinematic, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#c51162', width: 1 },
  to: { color: '#c51162', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});

var bar2_1 = new ProgressBar.Circle(easyToRead, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#0091ea', width: 1 },
  to: { color: '#0091ea', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});

var bar2_2 = new ProgressBar.Circle(highQuality, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#00b8d4', width: 1 },
  to: { color: '#00b8d4', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});

var bar3_1 = new ProgressBar.Circle(contemporary, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#00bfa5', width: 1 },
  to: { color: '#00bfa5', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar3_2 = new ProgressBar.Circle(stylish, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#00c853', width: 1 },
  to: { color: '#00c853', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar3_3 = new ProgressBar.Circle(original, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#64dd17', width: 1 },
  to: { color: '#64dd17', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar4_1 = new ProgressBar.Circle(authority, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#aeea00', width: 1 },
  to: { color: '#aeea00', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar4_2 = new ProgressBar.Circle(thrilling, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#ffd600', width: 1 },
  to: { color: '#ffd600', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar4_3 = new ProgressBar.Circle(scary, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#ffab00', width: 1 },
  to: { color: '#ffab00', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar4_4 = new ProgressBar.Circle(exciting, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#ff6d00', width: 1 },
  to: { color: '#ff6d00', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});
var bar4_5 = new ProgressBar.Circle(fun, {
  color: '#aaa',
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 4,
  trailWidth: 1,
  easing: 'easeInOut',
  duration: 1400,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#dd2c00', width: 1 },
  to: { color: '#dd2c00', width: 4 },
  // Set default step function for all animate calls
  step: function(state, circle) {
    circle.path.setAttribute('stroke', state.color);
    circle.path.setAttribute('stroke-width', state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText('');
    } else {
      circle.setText(value + "%");
    }

  }
});


$(document).ready(function(){
  $('#attentionGrabbing').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar1_1.animate(0.78);
    }
  });
  $('#engrossing').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar1_2.animate(0.58);
    }
  });
  $('#cinematic').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar1_3.animate(0.76);
    }
  });
  $('#easyToRead').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar2_1.animate(0.75);
    }
  });
  $('#highQuality').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar2_2.animate(0.78);
    }
  });
  $('#contemporary').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar3_1.animate(0.75);
    }
  });
  $('#stylish').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar3_2.animate(0.69);
    }
  });
  $('#original').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar3_3.animate(0.65);
    }
  });
  $('#authority').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar4_1.animate(0.71);
    }
  });
  $('#thrilling').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar4_2.animate(0.68);
    }
  });
   $('#scary').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar4_3.animate(0.66);
    }
  });
   $('#exciting').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar4_4.animate(0.65);
    }
  });
   $('#fun').viewportChecker({
  // Class to add to the elements when they are visible
    classToAdd: 'visible',
    // The offset of the elements (let them appear earlier or later)
    offset: 100,
    // Add the possibility to remove the class if the elements are not visible
    repeat: false,
   // Callback to do after a class was added to an element. Action will return "add" or "remove", depending if the class was added or removed
    callbackFunction: function(elem, action){
      bar4_5.animate(0.55);
    }
  });
});