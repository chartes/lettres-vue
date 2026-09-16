# Lettres-vue

## Project setup
Dans un répertoire dédié au projet :
- Cloner le repository GitHub : `git clone https://github.com/chartes/lettres-vue.git`

**NB : après avoir lancé l'API et installé Elasticsearch :**

Voir [Readme de l'API](https://github.com/chartes/lettres-app/blob/dev/README.md)


Dans le sous-répertoire de l'application (lettres-vue), avec Node 22 à 24 :
```
yarn
yarn serve
```
`yarn serve` utilise `.env.development` (API locale lancée avec `python3 flask_app.py --config=local`).

## Build
- Serveur de staging (pré-production), variables de `.env.staging` :
```
yarn build:staging
```
- Serveur de production, variables de `.env.production` :
```
yarn build:prod
```
Le dossier `dist` produit est à déployer sur le serveur correspondant.

- Ouvrir l'application dans un navigateur et se connecter.

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
