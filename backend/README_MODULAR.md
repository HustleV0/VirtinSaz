# VirtinSaz Modular Theme & Plugin System

This project implements a modular architecture for themes and plugins in a multi-tenant environment.

## Key Concepts

- **Plugin**: Represents a business logic module (e.g., `menu`, `order`, `blog`).
- **Theme**: Purely a presentation layer. It can declare dependencies on one or more plugins via `required_plugins`.
- **Site**: A customer's website associated with one theme and multiple active plugins.
- **SitePlugin**: Manages the activation status of a plugin for a specific site.

## Flow: Theme -> Plugin -> Site

1. **Theme Selection**: When a user selects a `Theme` for their `Site`:
   - The `Theme` is assigned to the `Site`.
   - All `required_plugins` for that `Theme` are automatically added to `SitePlugin` and marked as `is_active=True`.
2. **Modular Data Access**:
   - Plugins (like `menu`) check if they are active for the current site before returning data via API.
   - Example: `/api/menu/public/<slug>/` returns empty data if the `menu` plugin is not active.
3. **Dynamic Dashboard**:
   - The dashboard sidebar should depend on the list of active plugins.
   - Use the `/api/sites/site/active-plugins/` endpoint to get the list of active plugin keys for the current user's site.
4. **Admin Panel**:
   - Django Admin is customized to show/hide inlines based on active plugins.
   - `ProductInline` is only visible if the `menu` plugin is active for the site.

## Initializing Data

Run the following command to initialize core plugins and link `minimal-cafe` to `menu` and `order`:

```bash
python init_plugins_themes.py
```
