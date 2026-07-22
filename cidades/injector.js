/**
 * SNDLimp — Injector de Conteúdo Dinâmico por Cidade
 * 
 * Lê os dados da cidade do <script id="cidade-data"> (injetado pelo build script)
 * e aplica 3 variantes de conteúdo (seed 0, 1, 2) para ~40% de diferença entre cidades.
 * TopBar, Footer e estrutura visual são mantidos como identidade da marca.
 */

(function () {
  'use strict';

  // ── 1. Ler dados da cidade ──────────────────────────────────
  var dataScript = document.getElementById('cidade-data');
  if (!dataScript) { console.warn('[SNDLimp] cidade-data não encontrado.'); return; }

  var cidade;
  try { cidade = JSON.parse(dataScript.textContent); }
  catch (e) { console.error('[SNDLimp] Erro ao parsear cidade-data:', e); return; }

  var nome   = cidade.nome   || 'sua cidade';
  var slug   = cidade.slug   || '';
  var regiao = cidade.regiao || 'Vale do Sinos';
  var seed   = (typeof cidade.content_seed === 'number') ? cidade.content_seed : 0;
  var whatsapp = cidade.whatsapp || '555196033200';

  // ── 2. Banco de conteúdo por seed ───────────────────────────

  var hero = {
    heading: [
      'Você <em>instalou placas fotovoltaicas</em> para gerar energia <em>e economizar</em>, certo?',
      'Seus <em>painéis solares</em> estão rendendo <em>menos do que deveriam</em>?',
      'Investiu em <em>energia solar</em> mas a conta de luz <em>não caiu como esperava</em>?'
    ],
    sub: [
      'Poeira, fuligem e excrementos reduzem drasticamente a captação. A SNDLimp resolve isso em <strong>' + nome + '</strong> e região.',
      'O acúmulo de sujeira nos módulos pode estar custando caro. A SNDLimp atende <strong>' + nome + '</strong> com limpeza técnica profissional.',
      'Micropartículas invisíveis bloqueiam a radiação solar nos seus painéis. A SNDLimp recupera a eficiência do seu sistema em <strong>' + nome + '</strong>.'
    ],
    destaqueValor: ['💸 até R$50/mês', '⚠️ até 25% de perda', '📉 retorno comprometido'],
    destaqueLabel: [
      'É o que <strong>cada placa</strong> pode deixar de gerar por acúmulo de sujeira. Faça as contas.',
      'É a <strong>eficiência que você perde</strong> com painéis sujos. O investimento se paga mais rápido com limpeza regular.',
      'Seu <strong>payback pode dobrar</strong> sem a manutenção adequada. Não deixe seu dinheiro escapar pelo telhado.'
    ],
    cta: ['💬 Quero Parar de Perder Dinheiro', '💬 Recuperar Meu Rendimento', '💬 Maximizar Meu Investimento']
  };

  var prejuizo = {
    heading: [
      '📉 O prejuízo escondido na sua laje em ' + nome,
      '📉 Quanto a sujeira está custando para você em ' + nome,
      '📉 O custo invisível dos painéis sujos em ' + nome
    ],
    texto: [
      'A sujeira acumulada nos painéis solares forma uma camada que bloqueia a luz solar. Em regiões como ' + nome + ', com períodos de estiagem e poeira rural, o impacto pode ser ainda maior. Cada dia sem limpeza é dinheiro que deixa de entrar no seu bolso.',
      'Fuligem, fezes de aves e poeira de colheita criam uma barreira opaca sobre os módulos fotovoltaicos. Em ' + nome + ', esse acúmulo reduz a geração silenciosamente — você só percebe quando a conta de luz sobe. A limpeza profissional reverte esse quadro.',
      'Mesmo que você não veja, uma fina camada de micropartículas se deposita diariamente nos seus painéis. Em ' + nome + ', fatores como tráfego, agricultura e clima aceleram esse processo. O resultado: menos energia gerada, mais tempo para o retorno do investimento.'
    ]
  };

  var solucao = {
    heading: [
      '✅ A SNDLimp resolve em ' + nome,
      '✅ Como recuperamos a eficiência em ' + nome,
      '✅ Limpeza profissional que faz diferença em ' + nome
    ],
    texto: [
      'Usamos equipamento profissional, produtos biodegradáveis e técnica que <strong>não risca, não mancha e não danifica</strong> o vidro antirreflexo dos seus módulos. Limpeza feita por quem entende de geração. Atendemos <strong>' + nome + '</strong> e todo o <strong>' + regiao + '</strong>.',
      'Nossa limpeza utiliza <strong>água deionizada e escovas com cerdas especiais</strong>, eliminando qualquer risco de abrasão. O processo é rápido, silencioso e não interfere na sua rotina. Cobertura completa em <strong>' + nome + '</strong> e <strong>' + regiao + '</strong>.',
      'Com <strong>equipamento de osmose reversa e produtos 100% biodegradáveis</strong>, entregamos uma limpeza que preserva a camada antirreflexo dos seus módulos. Técnicos treinados atendem <strong>' + nome + '</strong> e todo o <strong>' + regiao + '</strong>.'
    ],
    cta: ['📅 Agendar Limpeza em ' + nome, '📅 Solicitar Orçamento em ' + nome, '📅 Falar com um Técnico em ' + nome]
  };

  var beneficios = {
    heading: [
      'Por que a <em>SNDLimp</em> em ' + nome + '?',
      'O que torna a <em>SNDLimp</em> diferente em ' + nome + '?',
      'Vantagens da <em>SNDLimp</em> para ' + nome
    ],
    cards: [
      [
        { icon: '🧼', title: 'Sem abrasivos', text: 'Nada de esponjas ásperas ou produtos caseiros. Cuidamos do seu investimento em ' + nome + '.' },
        { icon: '📊', title: 'Relatório fotográfico', text: 'Antes e depois para você ter certeza do serviço realizado.' },
        { icon: '⏱️', title: 'Rápido e sem bagunça', text: 'Em poucas horas seu sistema volta a produzir no máximo.' }
      ],
      [
        { icon: '🌱', title: 'Produtos biodegradáveis', text: 'Química segura para seu telhado e para o meio ambiente em ' + nome + '.' },
        { icon: '🛡️', title: 'Equipe segurada', text: 'Profissionais com EPIs e seguro contra imprevistos durante o serviço.' },
        { icon: '📋', title: 'Garantia de satisfação', text: 'Se não ficar satisfeito, voltamos sem custo adicional.' }
      ],
      [
        { icon: '📍', title: 'Técnicos locais', text: 'Equipe baseada em ' + nome + ' e ' + regiao + '. Chegada rápida e conhecimento da região.' },
        { icon: '📅', title: 'Agendamento flexível', text: 'Horário comercial, fins de semana e feriados. Adaptamos à sua rotina.' },
        { icon: '📈', title: 'Monitoramento pós-limpeza', text: 'Acompanhamos a curva de geração após o serviço para comprovar o resultado.' }
      ]
    ]
  };

  var faq = {
    heading: [
      'Dúvidas frequentes sobre limpeza solar em ' + nome,
      'Perguntas que todo mundo faz sobre limpeza de placas em ' + nome,
      'O que você precisa saber antes de limpar suas placas em ' + nome
    ],
    items: [
      [
        { q: 'Com que frequência devo limpar as placas em ' + nome + '?', a: 'Recomendamos limpeza a cada 3 a 6 meses, dependendo da exposição a poeira, fuligem e fezes de aves. Em ' + nome + ' e ' + regiao + ', a média ideal é a cada 4 meses.' },
        { q: 'A limpeza pode danificar as placas solares?', a: 'Não. Usamos água deionizada, escovas com cerdas especiais e produtos biodegradáveis. Nossa técnica preserva o vidro antirreflexo e não risca os módulos.' },
        { q: 'Vocês atendem ' + nome + ' e cidades vizinhas?', a: 'Sim! Atendemos ' + nome + ' e todas as cidades do ' + regiao + '. Consulte nossa área de cobertura ou chame no WhatsApp para confirmar.' }
      ],
      [
        { q: 'A chuva não limpa as placas naturalmente?', a: 'A chuva remove apenas parte da poeira superficial. Fuligem, fezes de aves e resíduos oleosos ficam grudados e formam uma crosta que a água da chuva não dissolve. Em ' + nome + ', a estiagem agrava o problema.' },
        { q: 'Quanto tempo dura a limpeza?', a: 'Uma residência padrão (até 20 placas) leva de 2 a 3 horas. Sistemas maiores são avaliados no orçamento. O serviço é silencioso e não interfere na rotina da casa.' },
        { q: 'Qual o valor da limpeza em ' + nome + '?', a: 'O valor depende do número de placas, altura do telhado e facilidade de acesso. Entre em contato pelo WhatsApp para um orçamento personalizado e sem compromisso.' }
      ],
      [
        { q: 'A limpeza tem garantia?', a: 'Sim! Garantimos a satisfação. Se em até 7 dias você notar que a geração não melhorou, voltamos sem custo adicional. Atendemos ' + nome + ' e todo o ' + regiao + ' com esse compromisso.' },
        { q: 'Como sei que minhas placas precisam de limpeza?', a: 'Se a conta de luz subiu sem explicação, se você vê manchas ou fezes de aves nos módulos, ou se faz mais de 6 meses desde a última limpeza — é hora de chamar. Fazemos uma avaliação gratuita em ' + nome + '.' },
        { q: 'Vocês limpam placas de qualquer fabricante?', a: 'Sim. Trabalhamos com todos os fabricantes e modelos do mercado. Nossa técnica é compatível com qualquer tipo de módulo fotovoltaico, inclusive os de tecnologia PERC e Half-Cell.' }
      ]
    ]
  };

  var ctaFinal = {
    heading: [
      'Recupere a eficiência das suas placas solares em ' + nome,
      'Não deixe seu investimento perder rendimento em ' + nome,
      'Seu sistema solar pode render muito mais em ' + nome
    ],
    texto: [
      'Atendimento profissional em ' + nome + ' e ' + regiao + '. Agende sua limpeza agora mesmo.',
      'Equipe especializada pronta para atender ' + nome + ' e todo o ' + regiao + '. Orçamento rápido pelo WhatsApp.',
      'Técnicos certificados em ' + nome + ' e ' + regiao + '. Avaliação gratuita e sem compromisso.'
    ],
    btn: ['💬 Falar com Especialista', '💬 Pedir Orçamento Agora', '💬 Agendar Avaliação Gratuita']
  };

  // ── 3. Aplicar conteúdo ─────────────────────────────────────

  function set(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // Hero
  set('hero-heading', hero.heading[seed]);
  set('hero-sub', hero.sub[seed]);
  set('destaque-valor', hero.destaqueValor[seed]);
  set('destaque-label', hero.destaqueLabel[seed]);
  set('hero-cta', hero.cta[seed]);

  // Prejuízo
  set('prejuizo-heading', prejuizo.heading[seed]);
  set('prejuizo-texto', prejuizo.texto[seed]);

  // Solução
  set('solucao-heading', solucao.heading[seed]);
  set('solucao-texto', solucao.texto[seed]);
  set('solucao-cta', solucao.cta[seed]);

  // Benefícios
  set('beneficios-heading', beneficios.heading[seed]);
  var bg = document.getElementById('beneficios-grid');
  if (bg) {
    var cards = beneficios.cards[seed];
    bg.innerHTML = cards.map(function (c) {
      return '<div class="beneficio-card"><span class="icon">' + c.icon + '</span><h3>' + c.title + '</h3><p>' + c.text + '</p></div>';
    }).join('');
  }

  // FAQ
  set('faq-heading', faq.heading[seed]);
  var fq = document.getElementById('faq-items');
  if (fq) {
    var items = faq.items[seed];
    fq.innerHTML = items.map(function (item) {
      return '<div style="background:var(--card-bg);border:1px solid rgba(245,166,35,0.15);border-radius:12px;padding:20px;margin-bottom:12px;"><h3 style="font-size:0.95rem;color:var(--primary);margin-bottom:8px;text-transform:none;letter-spacing:0;">' + item.q + '</h3><p style="color:#bbb;margin:0;font-size:0.85rem;">' + item.a + '</p></div>';
    }).join('');
  }

  // CTA Final
  set('cta-final-heading', ctaFinal.heading[seed]);
  set('cta-final-texto', ctaFinal.texto[seed]);
  set('cta-final-btn', ctaFinal.btn[seed]);

  // ── 4. Atualizar document.title ──────────────────────────────
  document.title = 'SNDLimp — Limpeza de Placas Solares em ' + nome + ' | ' + regiao;

  console.log('[SNDLimp] Página injetada: ' + nome + ' (seed ' + seed + ', ' + regiao + ')');
})();