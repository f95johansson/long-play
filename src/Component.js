import autoBind from 'auto-bind';

class Component {
    constructor(template) {
        this.template = template;
        this.events = {};

        autoBind(this);
    }

    render(data) {
        return this.template(data);
    }

    update() {}
}

export default Component;