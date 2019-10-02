import autoBind from 'auto-bind';
import { DiffDOM } from "diff-dom"

class Component {
    constructor(template, root) {
        this.template = template;
        this.root = root;
        this.events = {};

        this._differ = new DiffDOM({
            valueDiffing: false,
            // preDiffApply: function (info) {},
            filterOuterDiff: function(t1, t2, diffs) {
                // can change current outer diffs by returning a new array,
                // or by mutating outerDiffs.
                //const fdiffs = diffs.filter(diff => !(diff.action === 'modifyAttribute' || diff.name === 'name'));

                if (!diffs.length && ((t1.nodeName.toLowerCase() == 'a-component' && t2.nodeName == t1.nodeName) || 
                                      (t1.attributes && t1.attributes['data-component'] && t2.attributes && t2.attributes['data-component']))) {
                    // will not change <a-component/>'s, or components with the data-componenent attribute
                    t1.innerDone = true;
                }
            }

        });

        autoBind(this);
    }

    render(data) {
        return this.template(data);
    }

    renderElement(data) {
        return htmlToElement(this.render(data));
    }

    update(data) {
        const diff = this._differ.diff(this.root, this.template(data).trim())
        this._differ.apply(this.root, diff);
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export default Component;