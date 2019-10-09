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


/**
 * To ease using lambdas with add event listener and updating, and
 * id can be specified (after the type paramater) to keep track of
 * the specific listener. A listener with and id can be removed
 * using the same id. And id must be a number or and string unique
 * to the specific HTMLElement.
 */
const superAddEventListener = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.addEventListener = function(type, id, listener, ...options) {
    if (typeof id === 'number' || typeof id === 'string') {
        if (!this._eventListeners) {
            this._eventListeners = {};
        }
        this._eventListeners[id] = listener;
        superAddEventListener.call(this, type, listener, ...options)
    } else {
        superAddEventListener.call(this, type, id, listener, ...options)
    }
}

const superRemoveEventListener = HTMLElement.prototype.removeEventListener;
HTMLElement.prototype.removeEventListener = function(type, id, ...options) {
    if (typeof id === 'number' || typeof id === 'string') {
        if (this._eventListeners) {
            const listener = this._eventListeners[id];
            superRemoveEventListener.call(this, type, listener, ...options)
        }
    } else {
        superRemoveEventListener.call(this, type, id, ...options)
    }
}

export default Component;