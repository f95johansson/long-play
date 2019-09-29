import autoBind from 'auto-bind';
import { DiffDOM } from "diff-dom"

class Component {
    constructor(template) {
        this.template = template;
        this.events = {};

        this._differ = new DiffDOM({
            preDiffApply: function (info) {
                console.log(info);
                if (info.node && info.node.classList.contains('component')) {
                    return true;
                }
            }
        });

        autoBind(this);
    }

    render(data) {
        return this.template(data);
    }

    update(data) {
        const diff = this._differ.diff(this.root, this.template(data))
        this._differ.apply(this.root, diff);
    }
}

export default Component;