const images = (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((o, k, i) => { o[k.replace('./', '')] = values[i]; return o; }, {});
})(require.context('assets/images', true, /.*/));

module.exports = function(image, context) {
    return images[image];
};