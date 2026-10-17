export default class Router {
    configRoutes = window.Config.ROUTES;
    viewClasses = window.Config.VIEW_CLASSES;

    routes = [
        { path: this.configRoutes.CART, node: document.querySelector(this.viewClasses.CART) },
        { path: this.configRoutes.CHECKOUT, node: document.querySelector(this.viewClasses.CHECKOUT) },
        { path: this.configRoutes.SUCCESS, node: document.querySelector(this.viewClasses.SUCCESS) },
    ];


    render(path) {
        if (!this.routes.some(route => path === route.path)) {
            path = this.configRoutes.CART;
        }

        this.routes.forEach(route => {
            route.node.hidden = path !== route.path;
        });
    }

    init() {
        this.render(location.hash);
        window.addEventListener('hashchange', () => this.render(location.hash));
    }
}
