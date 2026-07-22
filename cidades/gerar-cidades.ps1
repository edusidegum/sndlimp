# SNDLimp — Gerador de Páginas por Cidade (PowerShell)
# Lê cidades.json e gera um .html para cada cidade a partir do template

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$jsonPath = Join-Path $scriptDir "cidades.json"
$templatePath = Join-Path $scriptDir "template-cidade.html"
$outputDir = $scriptDir  # gera os HTMLs na mesma pasta

if (-not (Test-Path $jsonPath)) {
    Write-Error "cidades.json não encontrado em: $jsonPath"
    exit 1
}
if (-not (Test-Path $templatePath)) {
    Write-Error "template-cidade.html não encontrado em: $templatePath"
    exit 1
}

$cidades = Get-Content $jsonPath -Raw | ConvertFrom-Json
$template = Get-Content $templatePath -Raw

$geradas = 0
$erros = 0

foreach ($cidade in $cidades) {
    try {
        $slug = $cidade.slug
        $nome = $cidade.nome
        $regiao = $cidade.regiao
        $seed = $cidade.content_seed
        $whatsapp = if ($cidade.whatsapp) { $cidade.whatsapp } else { "555196033200" }

        # Monta o JSON de dados da cidade para o injector.js
        $cidadeData = @{
            nome = $nome
            slug = $slug
            regiao = $regiao
            content_seed = [int]$seed
            whatsapp = $whatsapp
        } | ConvertTo-Json -Compress

        $cidadeDataScript = "<script id=`"cidade-data`" type=`"application/json`">$cidadeData</script>"

        # Substitui placeholders no template
        $html = $template
        $html = $html -replace '\{\{CIDADE_SLUG\}\}', $slug
        $html = $html -replace '\{\{CIDADE_NOME\}\}', $nome
        $html = $html -replace '\{\{REGIAO\}\}', $regiao
        $html = $html -replace '\{\{CONTENT_SEED\}\}', $seed
        $html = $html -replace '<!-- INJECT-CIDADE-DATA -->', $cidadeDataScript

        $outputPath = Join-Path $outputDir "$slug.html"
        $html | Out-File -FilePath $outputPath -Encoding utf8 -NoNewline

        Write-Host "✅ $slug.html ($nome | $regiao | seed=$seed)"
        $geradas++
    }
    catch {
        Write-Warning "❌ Erro ao gerar $($cidade.slug): $_"
        $erros++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════"
Write-Host "  TOTAL: $geradas páginas geradas"
if ($erros -gt 0) { Write-Host "  ERROS: $erros" }
Write-Host "═══════════════════════════════════════"