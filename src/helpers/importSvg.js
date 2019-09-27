const svgs = (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((o, k, i) => { o[k.replace('./', '')] = values[i]; return o; }, {});
})(require.context('assets/svgs', true, /.*/));

module.exports = function(svg, context) {
    return svgs[svg];
};