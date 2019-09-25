function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

module.exports = function(component, data) {
     //console.log(component);
     console.log(data.data.root);
     if (component) {
         component.update();
         return htmlToElement(component.view);
     } else {
         return '';
     }
};