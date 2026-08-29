

## Pour demarrer

pour installer les dependances frontend
```aiignore
cd frontend/

# Installer pnpm globally si vous n'en avez pas
npm install -g pnpm

# Installer pnpm pour le monorepo
pnpm install
pnpm install --no-frozen-lockfile --no-strict-peer-dependencies

```


pour demarrer le serveur de dev
```aiignore
pnpm dev
```

pour demarrer seulement le ui web
```aiignore
pnpm --filter app-web dev
```
ou pour le mobile
```aiignore
pnpm --filter app-mobile dev

```


