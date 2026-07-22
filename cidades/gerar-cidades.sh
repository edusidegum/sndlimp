#!/bin/bash
# SNDLimp — Gerador de Páginas por Cidade (Bash)
# Lê cidades.json e gera um .html para cada cidade a partir do template
# Requer: jq (sudo apt install jq / brew install jq)

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

JSON="$SCRIPT_DIR/cidades.json"
TEMPLATE="$SCRIPT_DIR/template-cidade.html"
OUTDIR="$SCRIPT_DIR"

if [ ! -f "$JSON" ]; then echo "❌ cidades.json não encontrado: $JSON"; exit 1; fi
if [ ! -f "$TEMPLATE" ]; then echo "❌ template-cidade.html não encontrado: $TEMPLATE"; exit 1; fi
if ! command -v jq &>/dev/null; then echo "❌ jq não instalado. Instale: sudo apt install jq"; exit 1; fi

GERADAS=0
ERROS=0

for row in $(jq -c '.[]' "$JSON"); do
  slug=$(echo "$row" | jq -r '.slug')
  nome=$(echo "$row" | jq -r '.nome')
  regiao=$(echo "$row" | jq -r '.regiao')
  seed=$(echo "$row" | jq -r '.content_seed')
  whatsapp=$(echo "$row" | jq -r '.whatsapp // "555196033200"')

  cidade_data=$(jq -nc --arg n "$nome" --arg s "$slug" --arg r "$regiao" --argjson sd "$seed" --arg w "$whatsapp" \
    '{nome:$n, slug:$s, regiao:$r, content_seed:$sd, whatsapp:$w}')

  cidade_data_script="<script id=\"cidade-data\" type=\"application/json\">$cidade_data</script>"

  cp "$TEMPLATE" "$OUTDIR/${slug}.html"

  sed -i "s|{{CIDADE_SLUG}}|$slug|g" "$OUTDIR/${slug}.html"
  sed -i "s|{{CIDADE_NOME}}|$nome|g" "$OUTDIR/${slug}.html"
  sed -i "s|{{REGIAO}}|$regiao|g" "$OUTDIR/${slug}.html"
  sed -i "s|{{CONTENT_SEED}}|$seed|g" "$OUTDIR/${slug}.html"
  sed -i "s|<!-- INJECT-CIDADE-DATA -->|$cidade_data_script|g" "$OUTDIR/${slug}.html"

  echo "✅ ${slug}.html ($nome | $regiao | seed=$seed)"
  ((GERADAS++))
done

echo ""
echo "═══════════════════════════════════════"
echo "  TOTAL: $GERADAS páginas geradas"
echo "═══════════════════════════════════════"