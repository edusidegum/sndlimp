# SNDLimp — Gerador de Páginas por Cidade (PowerShell)
# Lê cidades.json e gera um .html para cada cidade a partir do template

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# ── Carregar dados ────────────────────────────────────────────
$json = Get-Content -Raw -Path "cidades.json" | ConvertFrom-Json
$template = Get-Content -Raw -Path "template-cidade.html"

$whatsappBase = $json.whatsapp_base

# Criar pasta de saída se não existir
$outDir = "."
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$total = $json.cidades.Count
$i = 0

foreach ($cidade in $json.cidades) {
    $i++
    $slug = $cidade.slug
    $nome = $cidade.nome
    $regiaoSlug = $cidade.regiao
    $regiao = $json.regioes.$regiaoSlug
    $regiaoNome = $regiao.nome
    $contentSeed = $cidade.content_seed
    $fontFamily = $regiao.font_family
    $corDestaque = $regiao.cor_destaque

    # WhatsApp com texto customizado
    $whatsapp = $whatsappBase

    # Substituir placeholders
    $html = $template
    $html = $html -replace '\{\{CIDADE_SLUG\}\}', $slug
    $html = $html -replace '\{\{CIDADE_NOME\}\}', $nome
    $html = $html -replace '\{\{REGIAO_SLUG\}\}', $regiaoSlug
    $html = $html -replace '\{\{REGIAO_NOME\}\}', $regiaoNome
    $html = $html -replace '\{\{CONTENT_SEED\}\}', $contentSeed
    $html = $html -replace '\{\{WHATSAPP\}\}', $whatsapp
    $html = $html -replace '\{\{FONT_FAMILY\}\}', $fontFamily
    $html = $html -replace '\{\{COR_DESTAQUE\}\}', $corDestaque

    # Salvar
    $outPath = Join-Path $outDir "$slug.html"
    $html | Out-File -FilePath $outPath -Encoding utf8 -NoNewline

    Write-Host "[$i/$total] Gerado: $slug.html — $nome ($regiaoNome, seed=$contentSeed)"
}

Write-Host ""
Write-Host "✅ $total páginas geradas com sucesso!"
Write-Host "   TopBar e Footer: identidade fixa"
Write-Host "   Conteúdo: 3 variantes (seed 0/1/2) — ~40% diferente entre cidades vizinhas"
Write-Host "   Fontes e cores: variam por região"