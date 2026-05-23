# Add Page Playbook

1. Add or update the page spec under `docs/product/pages/`.
2. Add the route to `src/routes.ts`.
3. Create a page slice under `src/pages/<PageName>/`.
4. Put mock access in a DataSource.
5. Put state, actions, and derived display values in a ViewModel.
6. Keep React views thin.
7. Update `docs/product/page-inventory.md`.
8. Run `npm run verify`.
