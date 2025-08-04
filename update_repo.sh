#!/usr/bin/env bash
set -e

# update_repo.sh: sincroniza, commitea y sube al remoto

# 1. En qué rama estamos (asume main)
BRANCH="main"

echo "🌳 Cambiando a la rama $BRANCH"
git checkout $BRANCH

echo "🔄 Obteniendo últimos cambios de origin/$BRANCH"
git pull --rebase origin $BRANCH

echo "➕ Añadiendo cambios al área de staging"
git add .

# Puedes editar este mensaje si quieres más detalle
COMMIT_MSG="Sync latest marketplace & backend changes"

echo "💾 Commit con mensaje: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || echo "⚠️ No hay nada nuevo para commitear"

echo "🚀 Enviando a origin/$BRANCH"
git push origin $BRANCH

echo "✅ Actualización completada"
