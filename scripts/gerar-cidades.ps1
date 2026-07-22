# gerar-cidades.ps1 — v2 (autocontido)
# Coloque ESTE script + cidades-data.json + template_cidade.html NA MESMA PASTA e execute

$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = Get-Location }

$dataPath    = Join-Path $scriptDir "cidades-data.json"
$templatePath = Join-Path $scriptDir "template_cidade.html"
$outputDir   = Join-Path $scriptDir "cidades"

# Validações
if (-not (Test-Path $dataPath))    { Write-Host "ERRO: cidades-data.json não encontrado em $scriptDir" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $templatePath)) { Write-Host "ERRO: template_cidade.html não encontrado em $scriptDir" -ForegroundColor Red; exit 1 }

$data     = Get-Content $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json
$template = Get-Content $templatePath -Raw -Encoding UTF8

if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

$valeMap = @{
  "novo-hamburgo" = "Sinos"   ; "sao-leopoldo"  = "Sinos"
  "canoas"        = "Sinos"   ; "campo-bom"     = "Sinos"
  "sapiranga"     = "Sinos"   ; "esteio"        = "Sinos"
  "estancia-velha"= "Sinos"   ; "dois-irmaos"   = "Sinos"
  "ivoti"         = "Sinos"   ; "sapucaia-do-sul" = "Sinos"
  "nova-hartz"    = "Sinos"   ; "nova-santa-rita" = "Sinos"
  "portao"        = "Sinos"   ; "ararica"       = "Sinos"
  "teutonia"      = "Taquari" ; "colinas"       = "Taquari"
  "imigrante"     = "Taquari" ; "westfalia"     = "Taquari"
  "marata"        = "Taquari"
}

$geoMap = @{
  "novo-hamburgo" = "-29.6875;-51.1328"  ; "sao-leopoldo"  = "-29.7611;-51.1475"
  "canoas"        = "-29.9194;-51.1833"  ; "campo-bom"     = "-29.6797;-51.0569"
  "sapiranga"     = "-29.6392;-51.0072"  ; "esteio"        = "-29.8619;-51.1794"
  "estancia-velha"= "-29.6519;-51.1742"  ; "dois-irmaos"   = "-29.5781;-51.0856"
  "ivoti"         = "-29.5908;-51.1594"  ; "sapucaia-do-sul" = "-29.8397;-51.1458"
  "nova-hartz"    = "-29.5831;-50.9056"  ; "nova-santa-rita" = "-29.8575;-51.2750"
  "portao"        = "-29.7019;-51.2417"  ; "ararica"       = "-29.6136;-50.9267"
  "teutonia"      = "-29.4489;-51.8069"  ; "colinas"       = "-29.3819;-51.8736"
  "imigrante"     = "-29.3553;-51.7775"  ; "westfalia"     = "-29.4194;-51.7992"
  "marata"        = "-29.4508;-51.8311"
}

# Seções de conteúdo
$sectionPrejuizo = @'
<section class="section section-dark reveal"><div class="container">
<h2 class="section-title">📉 O <em>prejuízo</em> escondido na sua laje</h2>
<p class="section-sub">A diferença entre uma placa limpa e uma suja pode chegar a <strong style="color:var(--sol);">25% de perda</strong> e esse rombo cresce todo mês na sua conta.</p>
<div class="stats-row"><div class="card"><div class="stat-num">até 25%</div><div class="stat-label">perda de eficiência</div></div><div class="card"><div class="stat-num">até R$50</div><div class="stat-label">perda mensal por placa</div></div><div class="card"><div class="stat-num">2 limpezas/ano</div><div class="stat-label">investimento mínimo necessário</div></div></div>
<p style="text-align:center;color:var(--texto2);font-size:0.88rem;margin-top:20px;">Fonte: WEG, Portal Solar, STEMIS — dados de operação 2025-2026.</p>
</div></section>
'@

$sectionProblema = @'
<section class="section reveal"><div class="container">
<h2 class="section-title">😤 Por que a placa <em>perde força</em>?</h2>
<p class="section-sub">Poeira, fuligem industrial, fezes de aves e poluição urbana formam uma camada que bloqueia a luz solar. O que a chuva não tira, a SNDLimp remove com técnica e equipamento certo.</p>
<div class="grid-2"><div class="card"><div class="card-icon">🏭</div><h3>Polução urbana</h3><p>Fuligem de veículos e indústrias cria película oleosa que gruda na superfície do painel.</p></div><div class="card"><div class="card-icon">🐦</div><h3>Fezes de aves</h3><p>Crostas ressecadas formam barreira física que a água pura não dissolve sem ação química.</p></div><div class="card"><div class="card-icon">🌿</div><h3>Pólen e resíduos</h3><p>Material orgânico acumulado retém umidade e acelera formação de musgo e algas.</p></div><div class="card"><div class="card-icon">🌫️</div><h3>Nevoa seca</h3><p>Partículas finas em suspensão aderem ao vidro e reduzem a transmissão de luz.</p></div></div>
</div></section>
'@

$sectionSolucao = @'
<section class="section section-dark reveal"><div class="container">
<h2 class="section-title">🔧 A <em>solução</em> SNDLimp</h2>
<p class="section-sub">Não é água e pano. É processo técnico com equipamentos adequados para devolver a eficiência original dos seus painéis.</p>
<div class="grid-2"><div class="card"><div class="card-icon">🧪</div><h3>Detergente biodegradável</h3><p>pH neutro específico para vidro fotovoltaico. Não danifica o tratamento antirreflexo.</p></div><div class="card"><div class="card-icon">💧</div><h3>Água deionizada</h3><p>Sem minerais que mancham ou deixam resíduos sobre os módulos após a secagem.</p></div><div class="card"><div class="card-icon">🪥</div><h3>Escovas de poliuretano</h3><p>Cerdas macias que não retêm partículas abrasivas. Sem risco de micro riscos.</p></div><div class="card"><div class="card-icon">📋</div><h3>Relatório antes/depois</h3><p>Registro fotográfico do serviço com evidência da eficiência recuperada.</p></div></div>
</div></section>
'@

$sectionProcesso = @'
<section class="section reveal"><div class="container">
<h2 class="section-title">📋 Como <em>fazemos</em></h2>
<p class="section-sub">Processo em 3 etapas, sem improviso. Cada passo pensado para maximizar resultado sem danificar seu equipamento.</p>
<div class="grid-2"><div class="card"><div class="card-icon">🔍</div><h3>1. Inspeção</h3><p>Diagnóstico visual do estado das placas, identificação de pontos de sujeira crítica e hot spots.</p></div><div class="card"><div class="card-icon">🧽</div><h3>2. Limpeza técnica</h3><p>Aplicação controlada de detergente biodegradável + água deionizada com escovas específicas.</p></div><div class="card"><div class="card-icon">📸</div><h3>3. Verificação</h3><p>Enxágue completo, secagem natural e registro fotográfico do resultado final.</p></div><div class="card"><div class="card-icon">📊</div><h3>4. Relatório</h3><p>Entrega de relatório com fotos antes/depois para comprovação do serviço realizado.</p></div></div>
</div></section>
'@

$sectionDiferenciais = @'
<section class="section section-dark reveal"><div class="container">
<h2 class="section-title">✅ Por que a <em>SNDLimp</em>?</h2>
<p class="section-sub">Microempresa com padrão profissional. O que nos diferencia não é promessa — é processo.</p>
<div class="grid-2"><div class="card"><div class="card-icon">🛡️</div><h3>Sem danos ao vidro</h3><p>Escovas específicas + pressão controlada. <strong>Não risca, não mancha, não trinca.</strong></p></div><div class="card"><div class="card-icon">🌱</div><h3>Produtos biodegradáveis</h3><p>Detergente pH neutro que não agride o meio ambiente nem sua lavoura.</p></div><div class="card"><div class="card-icon">👨‍🔧</div><h3>Equipamentos adequados</h3><p>Água deionizada, escovas de poliuretano, técnica de pressão controlada.</p></div><div class="card"><div class="card-icon">📞</div><h3>Atendimento local</h3><p>Estamos no Vale do Sinos e Vale do Taquari. Resposta rápida sem taxa de deslocamento abusiva.</p></div></div>
</div></section>
'@

$sectionDepoimento = @'
<section class="section reveal"><div class="container">
<h2 class="section-title">🗣️ Quem <em>contratou</em>, aprova</h2>
<div style="max-width:600px;margin:0 auto;text-align:center;background:var(--carbon);border:1px solid rgba(255,255,255,0.04);border-radius:var(--radius-lg);padding:36px 28px;">
<p style="font-size:1.05rem;color:var(--texto);line-height:1.6;font-style:italic;">"Achei que meus painéis estavam normais. Depois da limpeza, a geração subiu 22% no monitoramento do inversor. O serviço foi rápido e profissional."</p>
<p style="margin-top:16px;color:var(--sol);font-weight:600;">— Cliente atendido em CIDADE_PLACEHOLDER</p>
</div>
</div></section>
'@

$sectionCta = @'
<section class="section section-dark reveal" style="text-align:center;"><div class="container">
<h2 class="section-title" style="margin-bottom:16px;">⚡ Agende sua <em>limpeza</em></h2>
<p class="section-sub" style="margin-bottom:32px;">Sem compromisso. Sem taxa de visita. Diagnóstico gratuito para entender o estado dos seus painéis.</p>
<a href="https://wa.me/555196033200?text=Ol%C3%A1!%20Quero%20agendar%20uma%20limpeza%20em%20CIDADE_PLACEHOLDER." class="btn-cta-hero" target="_blank" rel="noopener">💬 Falar no WhatsApp</a>
</div></section>
'@

# Mapa de seções por padrão
$patternMap = @{
  "A" = @("prejuizo","problema","solucao","processo","diferenciais","depoimento","cta")
  "B" = @("problema","prejuizo","processo","solucao","diferenciais","depoimento","cta")
  "C" = @("solucao","problema","prejuizo","diferenciais","processo","depoimento","cta")
  "D" = @("depoimento","problema","solucao","prejuizo","processo","diferenciais","cta")
}

$sectionContent = @{
  "prejuizo"      = $sectionPrejuizo
  "problema"      = $sectionProblema
  "solucao"       = $sectionSolucao
  "processo"      = $sectionProcesso
  "diferenciais"  = $sectionDiferenciais
  "depoimento"    = $sectionDepoimento
  "cta"           = $sectionCta
}

$h1Variants = @{
  "A" = 'Você instalou placas fotovoltaicas em <em>{cidade}</em> para economizar… certo?'
  "B" = 'Em <em>{cidade}</em>, placa solar limpa é mais dinheiro no fim do mês'
  "C" = 'A geração de energia em <em>{cidade}</em> caiu? O problema pode estar na sujeira'
  "D" = 'Economia real em <em>{cidade}</em>: sua placa solar pode render muito mais'
}

$total = $data.cities.Count
Write-Host "Gerando $total páginas..." -ForegroundColor Cyan

foreach ($city in $data.cities) {
  $slug = $city.slug
  $name = $city.name
  $pattern = $city.pattern
  $h1Var = $city.h1_variant

  $vale = $valeMap[$slug]
  if (-not $vale) { Write-Host "AVISO: $slug sem vale definido, usando Sinos" -ForegroundColor Yellow; $vale = "Sinos" }

  $geo = $geoMap[$slug]
  if (-not $geo) { $geo = "-29.5;-51.3" }
  $lat,$lng = $geo -split ";"

  $h1Html = ($h1Variants[$h1Var] -replace '{cidade}',$name)

  $sectionKeys = $patternMap[$pattern]
  if (-not $sectionKeys) { $sectionKeys = $patternMap["A"] }

  $sectionsHtml = ""
  foreach ($key in $sectionKeys) {
    $sectionHtml = $sectionContent[$key]
    $sectionHtml = $sectionHtml -replace 'CIDADE_PLACEHOLDER', $name
    $sectionsHtml += "`n" + $sectionHtml
  }

  # Construir meta description mais curta se a original for muito longa
  $metaDesc = $city.meta_desc
  if ($metaDesc.Length -gt 160) { $metaDesc = $metaDesc.Substring(0, 157) + "..." }

  $page = $template
  $page = $page -replace 'META_DESC_PLACEHOLDER', $metaDesc
  $page = $page -replace 'CIDADE_PLACEHOLDER', $name
  $page = $page -replace 'SLUG_PLACEHOLDER', $slug
  $page = $page -replace 'TITLE_PLACEHOLDER', $city.title
  $page = $page -replace 'VALE_PLACEHOLDER', $vale
  $page = $page -replace 'LAT_PLACEHOLDER', $lat
  $page = $page -replace 'LNG_PLACEHOLDER', $lng
  $page = $page -replace 'H1_PLACEHOLDER', $h1Html
  $page = $page -replace 'SECTIONS_PLACEHOLDER', $sectionsHtml

  $outputFile = Join-Path $outputDir "$slug.html"
  $page | Set-Content $outputFile -Encoding UTF8
  Write-Host "  ✓ $slug.html" -ForegroundColor Green
}

Write-Host "`n✅ $total páginas geradas em: $outputDir" -ForegroundColor Cyan