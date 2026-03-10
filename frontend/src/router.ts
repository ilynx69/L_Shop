type RouteHandler = () => void;

interface Route {
    path: string;
    handler: RouteHandler;
}

class Router {
    private routes: Route[] = [];
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    addRoute(path: string, handler: RouteHandler) {
        this.routes.push({ path, handler });
    }

    navigateTo(url: string) {
        history.pushState(null, '', url);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path);
        if (route) {
            this.container.innerHTML = '';
            route.handler();
        } else {
            this.navigateTo('/');
        }
    }

    start() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    }
}

export let router: Router;

export function initRouter(container: HTMLElement): Router {
    router = new Router(container);
    return router;
}