/**
 * SNDLimp — Injector de Conteúdo Variável por Cidade
 * 
 * Lê o bloco <script id="cidade-data"> e substitui dinamicamente:
 *  - Placeholders {{...}} no HTML
 *  - Conteúdo variável por content_seed (0, 1, 2)
 *  - Fontes e cores por região
 *  - WhatsApp links customizados
 * 
 * TopBar e Footer são preservados como identidade fixa.
 */

(function () {
  'use strict';

  // ── 1. Ler dados da cidade ──────────────────────────────────
  const dataEl = document.getElementById('cidade-data');
  if (!dataEl) return console.warn('[SNDLimp] cidade-data não encontrado');

  let cidade;
  try {
    cidade = JSON.parse(dataEl.textContent);
  } catch (e) {
    return console.error('[SNDLimp] Erro ao parsear cidade-data:', e);
  }

  const seed = cidade.content_seed % 3; // 0, 1 ou 2

  // ── 2. Banco de conteúdo variável (3 seeds por seção) ──────
  const conteudo = {

    // ── HERO ──────────────────────────────────────────────────
    hero: [
      { // seed 0 — Original
        titulo: 'Você instalou placas fotovoltaicas para gerar energia e economizar, certo?',
        subtitulo: 'Poeira, fuligem e excrementos reduzem drasticamente a captação. A SNDLimp resolve isso em <strong>{{NOME}}</strong> e região.',
        preco: '💸 até R$50/mês — É o que cada placa pode deixar de gerar por acúmulo de sujeira. Faça as contas.',
        cta: '💬 Quero Parar de Perder Dinheiro'
      },
      { // seed 1 — Foco no rendimento
        titulo: 'Seus painéis solares estão gerando menos energia do que deveriam?',
        subtitulo: 'A sujeira invisível está sabotando seu investimento. A SNDLimp atende <strong>{{NOME}}</strong> com limpeza profissional que restaura o rendimento.',
        preco: '⚡ Até 25% de perda — A cada 4 placas, 1 pode estar gerando quase nada por causa da sujeira acumulada.',
        cta: '💬 Quero Recuperar Meu Rendimento'
      },
      { // seed 2 — Foco no investimento
        titulo: 'Investiu em energia solar mas a conta de luz não caiu como esperado?',
        subtitulo: 'Placa suja não gera energia. Placa limpa é economia real. A SNDLimp cuida do seu sistema em <strong>{{NOME}}</strong>.',
        preco: '📉 Retorno comprometido — A sujeira pode estar atrasando o payback do seu sistema em meses ou até anos.',
        cta: '💬 Quero Maximizar Meu Investimento'
      }
    ],

    // ── PREJUÍZO ──────────────────────────────────────────────
    prejuizo: [
      { // seed 0
        titulo: '📉 O prejuízo escondido na sua laje em {{NOME}}',
        texto: 'A sujeira acumulada nos painéis solares forma uma camada que bloqueia a luz solar. Em regiões como {{NOME}}, com períodos de estiagem e poeira rural, o impacto pode ser ainda maior. Cada dia sem limpeza é dinheiro que deixa de entrar no seu bolso.'
      },
      { // seed 1
        titulo: '📉 Quanto a sujeira está custando para você em {{NOME}}?',
        texto: 'Fuligem, poeira da colheita e dejetos de pássaros criam uma barreira opaca sobre as células fotovoltaicas. Em {{NOME}}, o acúmulo é acelerado pela combinação de períodos secos e atividade agrícola no entorno. O resultado: menos energia, mais conta de luz.'
      },
      { // seed 2
        titulo: '📉 O ladrão silencioso de energia em {{NOME}}',
        texto: 'Você olha para o telhado e as placas parecem limpas. Mas uma fina camada de micropartículas já reduz a captação solar. Em {{NOME}}, o clima da região acelera esse processo. A perda é silenciosa — mas aparece na fatura de energia.'
      }
    ],

    // ── SOLUÇÃO ───────────────────────────────────────────────
    solucao: [
      { // seed 0 — Foco Antes/Depois
        titulo: '✅ A SNDLimp resolve em {{NOME}}',
        texto: 'Usamos equipamento profissional, produtos biodegradáveis e técnica que não risca, não mancha e não danifica o vidro antirreflexo dos seus módulos. Limpeza feita por quem entende de geração. Atendemos <strong>{{NOME}}</strong> e todo o <strong>{{REGIAO}}</strong>.',
        resultado: 'Resultado: eficiência restaurada em até 98% logo após a limpeza.',
        cta: '📅 Agendar Limpeza em {{NOME}}'
      },
      { // seed 1 — Foco processo técnico
        titulo: '✅ Limpeza profissional que faz diferença em {{NOME}}',
        texto: 'Nossa equipe utiliza água deionizada — que não deixa manchas nem resíduos minerais — e escovas com cerdas de nylon especial. O processo completo inclui inspeção visual, limpeza com jato controlado e secagem natural. Tudo documentado para você acompanhar.',
        resultado: 'Resultado: seus painéis voltam a produzir como no primeiro dia de instalação.',
        cta: '📅 Solicitar Orçamento em {{NOME}}'
      },
      { // seed 2 — Foco equipamento
        titulo: '✅ Tecnologia e cuidado: a diferença SNDLimp em {{NOME}}',
        texto: 'Trabalhamos com sistema de purificação de água por osmose reversa, escovas rotativas de baixa pressão e produtos 100% biodegradáveis. Cada módulo recebe atenção individual. Atendemos residências, comércios e usinas em <strong>{{NOME}}</strong> e <strong>{{REGIAO}}</strong>.',
        resultado: 'Resultado: garantia de limpeza sem riscos, sem manchas e sem perda de garantia do fabricante.',
        cta: '📅 Falar com Especialista em {{NOME}}'
      }
    ],

    // ── BENEFÍCIOS ────────────────────────────────────────────
    beneficios: [
      { // seed 0 — Original
        titulo: 'Por que a SNDLimp em {{NOME}}?',
        cards: [
          { icone: '🧼', titulo: 'Sem abrasivos', texto: 'Nada de esponjas ásperas ou produtos caseiros. Cuidamos do seu investimento em {{NOME}}.' },
          { icone: '📊', titulo: 'Relatório fotográfico', texto: 'Antes e depois para você ter certeza do serviço realizado.' },
          { icone: '⏱️', titulo: 'Rápido e sem bagunça', texto: 'Em poucas horas seu sistema volta a produzir no máximo.' }
        ]
      },
      { // seed 1 — Foco ambiental + seguro
        titulo: 'Diferenciais que fazem a SNDLimp única em {{NOME}}',
        cards: [
          { icone: '🌱', titulo: 'Produtos biodegradáveis', texto: 'Cuidamos do seu telhado e do meio ambiente. Nenhum resíduo químico agressivo.' },
          { icone: '🛡️', titulo: 'Equipe segurada', texto: 'Profissionais com EPIs, treinamento em altura e seguro contra imprevistos.' },
          { icone: '📋', titulo: 'Garantia de satisfação', texto: 'Se não ficar satisfeito com o resultado, voltamos sem custo adicional.' }
        ]
      },
      { // seed 2 — Foco local + agilidade
        titulo: 'Vantagens de escolher a SNDLimp em {{NOME}}',
        cards: [
          { icone: '📍', titulo: 'Técnicos da região', texto: 'Equipe baseada no {{REGIAO}}. Conhecemos o clima e as necessidades locais.' },
          { icone: '📅', titulo: 'Agendamento flexível', texto: 'Horários que se adaptam à sua rotina, inclusive fins de semana.' },
          { icone: '📈', titulo: 'Monitoramento pós-limpeza', texto: 'Acompanhamos a produção por 30 dias para garantir o resultado.' }
        ]
      }
    ],

    // ── FAQ ───────────────────────────────────────────────────
    faq: [
      { // seed 0
        titulo: 'Dúvidas frequentes sobre limpeza solar em {{NOME}}',
        perguntas: [
          { p: 'Com que frequência devo limpar as placas em {{NOME}}?', r: 'Recomendamos limpeza a cada 3 a 6 meses, dependendo da exposição a poeira, fuligem e fezes de aves. Em {{NOME}} e {{REGIAO}}, a média ideal é a cada 4 meses.' },
          { p: 'A limpeza pode danificar as placas solares?', r: 'Não. Usamos água deionizada, escovas com cerdas especiais e produtos biodegradáveis. Nossa técnica preserva o vidro antirreflexo e não risca os módulos.' },
          { p: 'Vocês atendem {{NOME}} e cidades vizinhas?', r: 'Sim! Atendemos {{NOME}} e todas as cidades do {{REGIAO}}. Consulte nossa área de cobertura ou chame no WhatsApp para confirmar.' }
        ]
      },
      { // seed 1
        titulo: 'Perguntas que todo mundo faz sobre limpeza solar em {{NOME}}',
        perguntas: [
          { p: 'Chuva não limpa as placas naturalmente?', r: 'Não completamente. A chuva remove poeira leve, mas não elimina fuligem, resíduos orgânicos ou fezes de aves. Só a limpeza profissional garante a remoção total.' },
          { p: 'Quanto tempo dura o serviço em {{NOME}}?', r: 'Uma residência típica leva de 1 a 2 horas. Não causamos interrupção no fornecimento de energia e não deixamos bagunça no local.' },
          { p: 'Qual o valor do serviço em {{NOME}}?', r: 'O valor varia conforme a quantidade de placas e a altura do telhado. Entre em contato pelo WhatsApp para um orçamento personalizado e sem compromisso.' }
        ]
      },
      { // seed 2
        titulo: 'Tire suas dúvidas sobre limpeza de painéis em {{NOME}}',
        perguntas: [
          { p: 'Limpar as placas anula a garantia do fabricante?', r: 'Não. Pelo contrário — a maioria dos fabricantes exige manutenção periódica. Nossa técnica é compatível com todas as marcas do mercado.' },
          { p: 'Como sei que minhas placas precisam de limpeza?', r: 'Se a produção caiu sem motivo aparente, ou se você vê acúmulo visível de sujeira, é hora de limpar. Oferecemos avaliação gratuita em {{NOME}}.' },
          { p: 'Atendem empresas e usinas em {{NOME}}?', r: 'Sim! Atendemos desde residências até instalações comerciais e usinas de grande porte em {{NOME}} e {{REGIAO}}. Solicite uma vistoria técnica.' }
        ]
      }
    ],

    // ── CTA FINAL ─────────────────────────────────────────────
    cta_final: [
      {
        titulo: 'Recupere a eficiência das suas placas solares em {{NOME}}',
        texto: 'Atendimento profissional em {{NOME}} e {{REGIAO}}. Agende sua limpeza agora mesmo.',
        botao: '💬 Falar com Especialista'
      },
      {
        titulo: 'Pare de perder dinheiro com placa suja em {{NOME}}',
        texto: 'Cada dia sem limpeza é energia que você deixa de gerar. Nossa equipe está pronta para atender {{NOME}} e {{REGIAO}}.',
        botao: '💬 Solicitar Orçamento Grátis'
      },
      {
        titulo: 'Seu sistema solar merece o melhor cuidado em {{NOME}}',
        texto: 'Confie em quem entende de geração fotovoltaica. SNDLimp — limpeza profissional em {{NOME}} e {{REGIAO}}.',
        botao: '💬 Agendar Visita Técnica'
      }
    ]
  };

  // ── 3. Função auxiliar: substituir placeholders ─────────────
  function preencher(texto) {
    return texto
      .replace(/\{\{NOME\}\}/g, cidade.nome)
      .replace(/\{\{REGIAO\}\}/g, cidade.regiao_nome)
      .replace(/\{\{CIDADE_SLUG\}\}/g, cidade.slug)
      .replace(/\{\{REGIAO_SLUG\}\}/g, cidade.regiao)
      .replace(/\{\{WHATSAPP\}\}/g, cidade.whatsapp);
  }

  // ── 4. Aplicar conteúdo variável ────────────────────────────
  function aplicarBloco(blocoNome, seedData) {
    const bloco = document.querySelector(`[data-content-block="${blocoNome}"]`);
    if (!bloco) return;

    // Itera sobre todos os data-* do bloco
    Object.keys(seedData).forEach(key => {
      if (key === 'cards' || key === 'perguntas') return; // tratado separadamente

      const el = bloco.querySelector(`[data-${blocoNome}="${key}"]`);
      if (el) {
        el.innerHTML = preencher(seedData[key]);
      }
    });

    // Cards de benefícios
    if (seedData.cards) {
      seedData.cards.forEach((card, i) => {
        const idx = i + 1;
        const iconeEl = bloco.querySelector(`[data-beneficio="${idx}"] .beneficio-icone`);
        const tituloEl = bloco.querySelector(`[data-beneficio="${idx}-titulo"]`);
        const textoEl = bloco.querySelector(`[data-beneficio="${idx}-texto"]`);

        if (iconeEl) iconeEl.textContent = card.icone;
        if (tituloEl) tituloEl.textContent = card.titulo;
        if (textoEl) textoEl.innerHTML = preencher(card.texto);
      });
    }

    // Perguntas do FAQ
    if (seedData.perguntas) {
      seedData.perguntas.forEach((item, i) => {
        const idx = i + 1;
        const perguntaEl = bloco.querySelector(`[data-faq="${idx}-pergunta"]`);
        const respostaEl = bloco.querySelector(`[data-faq="${idx}-resposta"]`);

        if (perguntaEl) perguntaEl.textContent = preencher(item.p);
        if (respostaEl) respostaEl.innerHTML = preencher(item.r);
      });
    }
  }

  // ── 5. Aplicar todos os blocos ──────────────────────────────
  aplicarBloco('hero', conteudo.hero[seed]);
  aplicarBloco('prejuizo', conteudo.prejuizo[seed]);
  aplicarBloco('solucao', conteudo.solucao[seed]);
  aplicarBloco('beneficios', conteudo.beneficios[seed]);
  aplicarBloco('faq', conteudo.faq[seed]);
  aplicarBloco('cta-final', conteudo.cta_final[seed]);

  // ── 6. Aplicar fontes e cores por região ────────────────────
  if (cidade.font_family) {
    document.documentElement.style.setProperty('--font-family', cidade.font_family);
  }
  if (cidade.cor_destaque) {
    document.documentElement.style.setProperty('--cor-destaque', cidade.cor_destaque);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', cidade.cor_destaque);
  }

  // ── 7. Substituir placeholders residuais no HTML ────────────
  document.body.innerHTML = preencher(document.body.innerHTML);

  console.log(`[SNDLimp] Página de ${cidade.nome} carregada — seed ${seed}, região ${cidade.regiao_nome}`);
})();