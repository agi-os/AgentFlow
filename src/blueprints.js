// Access the blueprints from the injected environment variable
if (!window.__BLUEPRINTS__) {
  window.__BLUEPRINTS__ = JSON.parse(process.env.BLUEPRINTS)
}

// Access the items from the injected environment variable
if (!window.__ITEMS__) {
  window.__ITEMS__ = JSON.parse(process.env.ITEMS)
}
