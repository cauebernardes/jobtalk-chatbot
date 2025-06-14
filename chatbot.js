const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();
const entrevistaAtiva = {};

// =================================================================
// ======== 🚀 DICIONÁRIO DE ÁREAS (MAIS INTELIGENTE) 🚀 =========
// =================================================================
const areaKeywords = {
    tecnologia: ['tec', 'ti', 'dev', 'desenvolvimento', 'programação', 'tecnologia', 'software', 'backend'],
    vendas: ['vendas', 'comercial', 'vendedor'],
    logistica: ['logística', 'logistica', 'estoque', 'transporte'],
    atendimento: ['atendimento', 'cliente', 'suporte', 'sac'],
    marketing: ['marketing', 'mkt', 'divulgação', 'digital'],
    administrativo: ['administrativo', 'adm', 'escritório', 'financeiro']
};

function normalizarArea(texto) {
    const textoLimpo = texto.toLowerCase();
    for (const area in areaKeywords) {
        if (areaKeywords[area].some(keyword => textoLimpo.includes(keyword))) {
            return area; // Retorna a chave principal (ex: 'tecnologia')
        }
    }
    return textoLimpo; // Retorna o texto original se nenhum sinônimo for encontrado
}


// =================================================================
// ======== 🚀 BLOCO DE VAGAS TOTALMENTE REESTRUTURADO 🚀 =========
// =================================================================
const vagas = [
    // --- ÁREA DE TECNOLOGIA ---
    { codigo: "TEC-MED-01", titulo: "Auxiliar de Suporte Técnico", requisitos: { escolaridade: ["médio"], area: "tecnologia", experiencia: "não" } },
    { codigo: "TEC-SUP-01", titulo: "Desenvolvedor(a) Backend Júnior", requisitos: { escolaridade: ["superior"], area: "tecnologia", experiencia: "sim" } },
    { codigo: "EST-TEC-01", titulo: "Estágio em Tecnologia", requisitos: { escolaridade: ["médio"], area: "tecnologia", experiencia: "não", idade: { min: 16, max: 18 } } },
    // --- ÁREA DE VENDAS ---
    { codigo: "VEND-MED-01", titulo: "Auxiliar de Vendas", requisitos: { escolaridade: ["médio"], area: "vendas", experiencia: "não" } },
    { codigo: "VEND-SUP-01", titulo: "Vendedor(a) Interno Sênior", requisitos: { escolaridade: ["superior"], area: "vendas", experiencia: "sim" } },
    { codigo: "EST-VEND-01", titulo: "Estágio na área de Vendas", requisitos: { escolaridade: ["médio"], area: "vendas", experiencia: "não", idade: { min: 16, max: 18 } } },
    // --- ÁREA DE LOGÍSTICA ---
    { codigo: "LOG-MED-01", titulo: "Auxiliar de Logística", requisitos: { escolaridade: ["médio"], area: "logistica", experiencia: "não" } },
    { codigo: "LOG-SUP-01", titulo: "Analista de Logística", requisitos: { escolaridade: ["superior"], area: "logistica", experiencia: "sim" } },
    { codigo: "EST-LOG-01", titulo: "Estágio em Logística", requisitos: { escolaridade: ["médio"], area: "logistica", experiencia: "não", idade: { min: 16, max: 18 } } },
    // --- ÁREA DE ATENDIMENTO ---
    { codigo: "ATEND-MED-01", titulo: "Auxiliar de Atendimento", requisitos: { escolaridade: ["médio"], area: "atendimento", experiencia: "não" } },
    { codigo: "ATEND-SUP-01", titulo: "Analista de Atendimento ao Cliente", requisitos: { escolaridade: ["superior"], area: "atendimento", experiencia: "sim" } },
    { codigo: "EST-ATEND-01", titulo: "Estágio em Atendimento", requisitos: { escolaridade: ["médio"], area: "atendimento", experiencia: "não", idade: { min: 16, max: 18 } } },
    // --- ÁREA DE MARKETING ---
    { codigo: "MKT-MED-01", titulo: "Auxiliar de Marketing", requisitos: { escolaridade: ["médio"], area: "marketing", experiencia: "não" } },
    { codigo: "MKT-SUP-01", titulo: "Analista de Marketing Digital", requisitos: { escolaridade: ["superior"], area: "marketing", experiencia: "sim" } },
    { codigo: "EST-MKT-01", titulo: "Estágio em Marketing", requisitos: { escolaridade: ["médio"], area: "marketing", experiencia: "não", idade: { min: 16, max: 18 } } },
    // --- ÁREA ADMINISTRATIVA ---
    { codigo: "ADM-MED-01", titulo: "Auxiliar Administrativo", requisitos: { escolaridade: ["médio"], area: "administrativo", experiencia: "não" } },
    { codigo: "ADM-SUP-01", titulo: "Analista Administrativo", requisitos: { escolaridade: ["superior"], area: "administrativo", experiencia: "sim" } },
    { codigo: "EST-ADM-01", titulo: "Estágio em Administração", requisitos: { escolaridade: ["médio"], area: "administrativo", experiencia: "não", idade: { min: 16, max: 18 } } },
];

// =================================================================
// ======== 🚀 FUNÇÃO DE MATCH TOTALMENTE REFEITA (SISTEMA DE PONTOS) 🚀 =========
// =================================================================

function encontrarVaga(respostas) {
    const perfil = {
        escolaridade: respostas[0]?.toLowerCase(),
        area: normalizarArea(respostas[1]),
        experiencia: respostas[2]?.toLowerCase(),
        idade: parseInt(respostas[6], 10)
    };

    let melhorVaga = null;
    let maiorPontuacao = -1;

    for (const vaga of vagas) {
        const r = vaga.requisitos;
        let pontuacaoAtual = 0;
        let desqualificado = false;

        // --- Critérios de Desqualificação ---
        if (r.experiencia === "sim" && perfil.experiencia === "não") {
            desqualificado = true;
        }
        if (r.idade && (isNaN(perfil.idade) || perfil.idade < r.idade.min || perfil.idade > r.idade.max)) {
            desqualificado = true;
        }

        if (desqualificado) {
            continue; // Pula para a próxima vaga
        }

        // --- Sistema de Pontuação ---
        if (r.area === perfil.area) {
            pontuacaoAtual += 10;
        }
        if (r.escolaridade.includes(perfil.escolaridade)) {
            pontuacaoAtual += 5;
        }
        if (r.experiencia === perfil.experiencia) {
            pontuacaoAtual += 3;
        }
        if (r.idade) { // Ponto extra se a idade for compatível com estágio
            pontuacaoAtual += 3;
        }

        if (pontuacaoAtual > maiorPontuacao) {
            maiorPontuacao = pontuacaoAtual;
            melhorVaga = vaga;
        }
    }

    // --- Fallback Final ---
    // Se nenhuma vaga pontuou (cenário raro), oferece uma vaga geral como padrão.
    if (!melhorVaga) {
        return vagas.find(v => v.codigo === 'ADM-MED-01') || vagas[0]; // Retorna Aux. ADM ou a primeira da lista
    }

    return melhorVaga;
}

function agendarEntrevista() {
    const data = new Date();
    data.setDate(data.getDate() + 5);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    const horaAleatoria = horarios[Math.floor(Math.random() * horarios.length)];
    return { data: `${dia}/${mes}/${ano}`, hora: horaAleatoria };
}

client.on('qr', qr => { qrcode.generate(qr, { small: true }); });
client.on('ready', () => { console.log('Chatbot de Entrevista conectado!'); });
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));
const perguntas = [ "1️⃣ Qual seu nível de escolaridade? (fundamental, médio, superior)", "2️⃣ Em qual área você gostaria de trabalhar? (ex: tecnologia, vendas, mkt, adm...)", "3️⃣ Você tem experiência nessa área? (sim ou não)", "4️⃣ Cite um ponto forte seu.", "5️⃣ E um ponto a melhorar?", "6️⃣ Está disponível para trabalhar presencialmente? (sim ou não)", "7️⃣ Qual sua idade?", "8️⃣ Qual seu gênero? (masculino, feminino, outro)" ];
const validacoes = [ (res) => /^(fundamental|m[eé]dio|superior)$/i.test(res), (res) => /^.{2,}$/i.test(res), (res) => /^(sim|n[aã]o)$/i.test(res), (res) => /^.{3,}$/i.test(res), (res) => /^.{3,}$/i.test(res), (res) => /^(sim|n[aã]o)$/i.test(res), (res) => /^[0-9]{1,2}$/i.test(res), (res) => /^(masculino|feminino|outro)?$/i.test(res) ];
const palavrasBanidas = [ "bonito","bonitão","gostoso","sedutor","lindo","lindão","gatinho","deus","maromba","shape","brabo","zika","cria","favelado","humilde demais","pegador","estuprador","malandro","zoeiro","resenha","insano","maluco","psicopata","meu sorriso","meu estilo","meu cabelin","fumo","maconheiro","bebado","bêbado","cachaça","stonado","chapado","louco","doidão","piranha","putaria","safado","sem vergonha","transante","ninfomaníaco","rei delas","crush","recalcado","tiktoker","blogueiro","mito","trap","tropa","prostituta","vagabunda","vagabundo","porra","caralho","merda","puta","puto","cu","cacete","foda","bosta","arrombado","viado","escroto","corno","chifrudo","inferno","diabo","babaca","imbecil","retardado","otário","idiota","burro","burra","lixo","verme","pinto","buceta","pau","xota","xereca","foder","fode" ];
function contemPalavraBanida(texto) { return palavrasBanidas.some(p => texto.toLowerCase().includes(p)); }

// =================================================================
// ======== 🚀 LÓGICA PRINCIPAL REESTRUTURADA E MAIS ROBUSTA 🚀 =========
// =================================================================
client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nome = contact.pushname || "Candidato";
    const id = msg.from;
    const userState = entrevistaAtiva[id];
    const textoMsg = msg.body.toLowerCase().trim();

    // --- Etapa 1: Lidar com usuários que já têm entrevista agendada ---
    if (userState && userState.agendado) {
        if (textoMsg === 'reagendar') {
            const novoAgendamento = agendarEntrevista();
            userState.agendamento = novoAgendamento;
            await client.sendMessage(id, `✅ Entendido! Sua entrevista foi reagendada com sucesso para o dia ${novoAgendamento.data} às ${novoAgendamento.hora}. Não se esqueça!`);
        } else {
            await client.sendMessage(id, `Olá, ${nome.split(" ")[0]}! Você já tem uma entrevista agendada para a vaga *${userState.vaga.titulo}* no dia *${userState.agendamento.data}* às *${userState.agendamento.hora}*. \n\nSe precisar, digite *reagendar* para alterar a data e hora.`);
        }
        return;
    }

    // --- Etapa 2: Lidar com usuários que estão no meio de uma entrevista ---
    if (userState && userState.etapa !== undefined && !userState.agendado) {
        const etapa = userState.etapa;
        const resposta = msg.body.trim();

        if (!validacoes[etapa](resposta)) {
            await client.sendMessage(id, `❗ Resposta inválida. Por favor, tente novamente.\n\n${perguntas[etapa]}`);
            return;
        }
        if ((etapa === 3 || etapa === 4) && contemPalavraBanida(resposta)) {
            await client.sendMessage(id, "😅 Tente ser mais profissional. Essa resposta não é adequada para uma entrevista.");
            return;
        }
        
        userState.respostas.push(resposta);
        userState.etapa++;

        if (etapa === 6) {
            const idade = parseInt(resposta, 10);
            if (idade < 16 || idade > 64) {
                await client.sendMessage(id, `Agradecemos seu interesse, ${nome.split(" ")[0]}. No momento, nossas oportunidades são para candidatos com idade entre 16 e 64 anos.`);
                delete entrevistaAtiva[id];
                return;
            }
        }
        
        if (userState.etapa < perguntas.length) {
            await client.sendMessage(id, perguntas[userState.etapa]);
        } else {
            await client.sendMessage(id, "✅ Entrevista concluída! Analisando seu perfil para encontrar a melhor oportunidade...");
            await delay(2500);

            const vagaEncontrada = encontrarVaga(userState.respostas);
            const agendamento = agendarEntrevista();
            entrevistaAtiva[id] = { agendado: true, vaga: vagaEncontrada, agendamento: agendamento };
            
            const mensagemFinal = `Parabéns, ${nome.split(" ")[0]}! 🎉 Com base no seu perfil, a oportunidade mais indicada para você é a de *${vagaEncontrada.titulo}* (Cód: ${vagaEncontrada.codigo}).\n\nSua entrevista presencial foi agendada para:\n\n🗓️ Data: *${agendamento.data}*\n⏰ Horário: *${agendamento.hora}*\n\n📍 Local: Av. Paulista, 1234, 5º andar - São Paulo, SP.\n\nPor favor, compareça com um *documento com foto* e seu *currículo atualizado*. Boa sorte!`;
            await client.sendMessage(id, mensagemFinal);
        }
        return;
    }

    // --- Etapa 3: Lidar com novos usuários e comandos do menu principal ---
    if (/(oi|olá|ola|bom dia|boa tarde|boa noite|menu)/i.test(textoMsg)) {
        let menu = `Olá, ${nome.split(" ")[0]}! 👋\nSou o assistente de entrevistas.\nDigite *entrevista* para começar ou *resetar* para reiniciar.\n\nOutras opções:\n2 - Dicas de entrevista\n3 - Sobre a vaga\n4 - Encerrar`;
        await client.sendMessage(id, menu);
        return;
    }
    if (/(entrevista|início|inicio|começar)/i.test(textoMsg)) {
        entrevistaAtiva[id] = { etapa: 0, respostas: [] };
        await client.sendMessage(id, "Entrevista iniciada! Responda com sinceridade.");
        await delay(1500);
        await client.sendMessage(id, perguntas[0]);
        return;
    }
    if (textoMsg.includes("resetar")) {
        delete entrevistaAtiva[id];
        await client.sendMessage(id, "Entrevista reiniciada. Digite 'entrevista' ou 'início' para começar novamente.");
        return;
    }
    if (textoMsg === '2' || textoMsg === 'dicas') {
        const dicas = `📌 *Dicas de Entrevista:*\n\n- Mantenha a calma e respire fundo.\n- Seja objetivo: responda com clareza.\n- Mostre confiança, mesmo que esteja nervoso.\n- Conte situações reais que demonstrem suas habilidades.\n- Evite falar mal de empresas ou colegas anteriores.\n- No final, pergunte sobre a empresa ou vaga. Isso mostra interesse.\n\n✨ Uma boa apresentação pode ser o diferencial. Capriche!`;
        await client.sendMessage(id, dicas);
        return;
    }
    if (textoMsg === '3' || textoMsg === 'sobre') {
        const sobre = `🏢 *Sobre a JobTalk:*\n\nA *JobTalk* é uma plataforma de recrutamento inteligente que conecta candidatos a oportunidades reais de trabalho, com base no seu perfil. Nosso processo é simples e personalizado para encontrar a melhor vaga para você.`;
        await client.sendMessage(id, sobre);
        return;
    }
    if (textoMsg === '4' || textoMsg === 'encerrar') {
        await client.sendMessage(id, "Conversa encerrada. Obrigado pelo contato! 👋");
        return;
    }

    // --- Etapa 4: Mensagem padrão para comandos não reconhecidos ---
    await client.sendMessage(id, "❓ Não entendi sua mensagem. Digite *menu* para ver as opções.");
});