# SNDLimp — Gerador de Páginas por Cidade
# Lê cidades.json e gera um .html para cada cidade a partir do template
# Uso: .\gerar-cidades.ps1

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsonPath  = Join-Path $scriptDir "cidades.json"
$tmplPath  = Join-Path $scriptDir "template-cidade.html"
$outDir    = Join-Path $scriptDir "cidades"

# Cria diretório de saída se não existir
if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# Lê o JSON
$cidades = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Lê o template
$template = Get-Content $tmplPath -Raw -Encoding UTF8

$count = 0
foreach ($c in $cidades) {
  $slug    = $c.slug
  $nome    = $c.nome
  $regiao  = $c.regiao
  $waMsg   = $c.whatsapp_msg
  $profile = $c.profile
  $ordem   = ($c.ordem | ConvertTo-Json -Compress)

  # Monta o bloco de dados da cidade (JSON inline)
  $cidadeData = @{
    slug        = $slug
    nome        = $nome
    regiao      = $regiao
    profile     = $profile
    ordem       = $c.ordem
    whatsapp_msg = $waMsg
  } | ConvertTo-Json -Compress

  $dataScript = "<script id=`"cidade-data`" type=`"application/json`">$cidadeData</script>"

  # Substitui placeholders no template
  $html = $template
  $html = $html -replace '\{\{CIDADE_SLUG\}\}', $slug
  $html = $html -replace '\{\{CIDADE_NOME\}\}', $nome
  $html = $html -replace '\{\{REGIAO\}\}', $regiao
  $html = $html -replace '\{\{WHATSAPP_MSG\}\}', ([uri]::EscapeDataString($waMsg))
  $html = $html -replace '<!-- INJECT-CIDADE-DATA -->', $dataScript

  # Salva o arquivo
  $outPath = Join-Path $outDir "$slug.html"
  [System.IO.File]::WriteAllText($outPath, $html, [System.Text.UTF8Encoding]::new($false))
  Write-Host "✔ $slug.html ($nome — $regiao, profile=$profile, ordem=$($c.ordem -join ','))"
  $count++
}

Write-Host ""
Write-Host "✅ $count páginas geradas em: $outDir"