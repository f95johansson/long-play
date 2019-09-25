module.exports = function(ms, context) {
    var minutes = Math.floor(ms / 60000);
      var seconds = ((ms % 60000) / 1000).toFixed(0);
      return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
};