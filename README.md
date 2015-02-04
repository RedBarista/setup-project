# Base pour projet

Base de projet avec Gulp et Compass intégré

## Fonctionnement du project

Les fichiers de travail JS et SASS vont dans COMPONENTS.

Les HTML vont dans BUILDS/DEVELOPMENT

Par défaut Gulp fonctionne en mode de développement.
env = process.env.NODE_ENV || 'development';

Pour faire un push en mode PRODUCTION, il faut démarrer gulp avec NODE_ENV en mode production.
$ NODE_ENV=production gulp