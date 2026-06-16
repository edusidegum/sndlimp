SNDLimp — Projeto IEEE3S
=========================
Empresa: SNDLimp — Limpeza Técnica de Placas Solares
Parceiro Técnico: IEEE Produção Solar — Investimento Especial em Energia
Autor do Método: Eduardo Sidegum
Data: Junho/2026

PÁGINAS DO PROJETO
------------------
/ieee3s/ieee3s.html        → Calculadora avançada de perdas (acesso público simulado)
/ieee3s/metodoieee3s.html  → Metodologia e referências do cálculo (interno)

ARQUIVOS DE SUPORTE
-------------------
/ieee3s/ieee3s.css          → Estilos exclusivos da calculadora

SEO
---
/robots.txt                 → Restringe acesso à pasta /ieee3s/
/sitemap.xml                → Sitemap do projeto

ESTRUTURA DO CÁLCULO
--------------------
- Perda nominal: ajustada por indice de normal pluviometrica, teto 30%
- Fator de queda efetiva: 40% no teto
- Dados INMET 1991-2020 para 27 capitais
- Fallback para RS em caso de UF inválida
- Geração estimada: H_p = 4.5 h-pico/dia, PR = 0.78
