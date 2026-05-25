import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // Create mentors
  const mentor1 = await prisma.user.upsert({
    where: { email: "ana.silva@mentorflow.dev" },
    update: {},
    create: {
      email: "ana.silva@mentorflow.dev",
      hashedPassword: password,
      name: "Ana Silva",
      role: "MENTOR",
      mentorProfile: {
        create: {
          bio: "Engenheira de software com 12 anos de experiência em empresas como Nubank e iFood. Apaixonada por ajudar pessoas a crescerem na carreira.",
          expertise:
            "Especialista em arquitetura de sistemas distribuídos e desenvolvimento backend com foco em Go e Kotlin. Tenho experiência em construção de sistemas de alta disponibilidade que processam milhões de transações diárias.",
          skills: ["Go", "Kotlin", "PostgreSQL", "Kafka", "Kubernetes", "AWS"],
          areasOfExpertise: [
            "Arquitetura de Software",
            "Backend Development",
            "Career Coaching",
            "System Design",
          ],
          yearsExperience: 12,
          currentRole: "Staff Engineer",
          company: "Nubank",
          maxStudents: 3,
          averageRating: 4.9,
          totalReviews: 23,
        },
      },
    },
  });

  const mentor2 = await prisma.user.upsert({
    where: { email: "carlos.mendes@mentorflow.dev" },
    update: {},
    create: {
      email: "carlos.mendes@mentorflow.dev",
      hashedPassword: password,
      name: "Carlos Mendes",
      role: "MENTOR",
      mentorProfile: {
        create: {
          bio: "Líder técnico com foco em frontend e experiência do usuário. Já trabalhei em produtos usados por mais de 20 milhões de usuários.",
          expertise:
            "Desenvolvimento frontend moderno com React e Next.js. Especialista em performance web, acessibilidade e design systems. Tenho experiência em criar equipes de frontend do zero.",
          skills: ["React", "Next.js", "TypeScript", "Design Systems", "Web Performance", "GraphQL"],
          areasOfExpertise: [
            "Frontend Development",
            "UX Engineering",
            "Team Building",
            "Tech Lead",
          ],
          yearsExperience: 9,
          currentRole: "Tech Lead",
          company: "iFood",
          maxStudents: 4,
          averageRating: 4.7,
          totalReviews: 18,
        },
      },
    },
  });

  const mentor3 = await prisma.user.upsert({
    where: { email: "patricia.rocha@mentorflow.dev" },
    update: {},
    create: {
      email: "patricia.rocha@mentorflow.dev",
      hashedPassword: password,
      name: "Patrícia Rocha",
      role: "MENTOR",
      mentorProfile: {
        create: {
          bio: "Cientista de dados e pesquisadora de ML com PhD em Inteligência Artificial pela USP. Atualmente trabalhando em LLMs e sistemas de recomendação.",
          expertise:
            "Machine Learning aplicado a problemas de negócio real. Experiência com NLP, Computer Vision e sistemas de recomendação. Ajudo profissionais a migrarem para Data Science e ML Engineering.",
          skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "SQL", "Spark"],
          areasOfExpertise: [
            "Machine Learning",
            "Data Science",
            "NLP",
            "Career Transition to ML",
          ],
          yearsExperience: 7,
          currentRole: "Senior ML Engineer",
          company: "Mercado Livre",
          maxStudents: 2,
          averageRating: 4.8,
          totalReviews: 12,
        },
      },
    },
  });

  const mentor4 = await prisma.user.upsert({
    where: { email: "roberto.lima@mentorflow.dev" },
    update: {},
    create: {
      email: "roberto.lima@mentorflow.dev",
      hashedPassword: password,
      name: "Roberto Lima",
      role: "MENTOR",
      mentorProfile: {
        create: {
          bio: "DevOps e Cloud architect com experiência em migração de sistemas legados para cloud. Certificado AWS, GCP e Azure.",
          expertise:
            "Infraestrutura como código, CI/CD pipelines, e cloud architecture. Especialista em migração de monolitos para microserviços e implementação de práticas SRE.",
          skills: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Prometheus"],
          areasOfExpertise: [
            "DevOps",
            "Cloud Architecture",
            "SRE",
            "Infrastructure as Code",
          ],
          yearsExperience: 10,
          currentRole: "Principal DevOps Engineer",
          company: "Stone",
          maxStudents: 3,
          averageRating: 4.6,
          totalReviews: 8,
        },
      },
    },
  });

  const mentor5 = await prisma.user.upsert({
    where: { email: "fernanda.costa@mentorflow.dev" },
    update: {},
    create: {
      email: "fernanda.costa@mentorflow.dev",
      hashedPassword: password,
      name: "Fernanda Costa",
      role: "MENTOR",
      mentorProfile: {
        create: {
          bio: "Product Manager com foco em produtos de tecnologia. Já lancei 3 produtos com mais de 1M de usuários ativos.",
          expertise:
            "Gestão de produto, discovery, métricas e roadmap estratégico. Ajudo desenvolvedores que querem transicionar para PM e PMs que querem se tornar mais técnicos.",
          skills: ["Product Strategy", "OKRs", "User Research", "Data Analysis", "Figma"],
          areasOfExpertise: [
            "Product Management",
            "Career Transition",
            "Agile",
            "UX Research",
          ],
          yearsExperience: 8,
          currentRole: "Senior Product Manager",
          company: "Conta Azul",
          maxStudents: 5,
          averageRating: 4.5,
          totalReviews: 31,
        },
      },
    },
  });

  // Create students
  const student1 = await prisma.user.upsert({
    where: { email: "joao.dev@mentorflow.dev" },
    update: {},
    create: {
      email: "joao.dev@mentorflow.dev",
      hashedPassword: password,
      name: "João Santos",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "Desenvolvedor júnior apaixonado por tecnologia. Busco evoluir minha carreira no backend.",
          goals:
            "Quero me tornar um engenheiro backend sênior especializado em sistemas distribuídos. Tenho interesse em arquitetura de microsserviços, bancos de dados de alta performance e Go. Busco mentoria para evoluir tecnicamente e entender como funciona a carreira em grandes empresas de tecnologia brasileiras.",
          currentRole: "Desenvolvedor Júnior",
          desiredRole: "Engenheiro Backend Sênior",
          skills: ["JavaScript", "Node.js", "PostgreSQL", "Docker"],
          areasOfInterest: [
            "Backend Development",
            "Sistemas Distribuídos",
            "Arquitetura de Software",
          ],
          githubUrl: "https://github.com/joaosantos",
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "mariana.py@mentorflow.dev" },
    update: {},
    create: {
      email: "mariana.py@mentorflow.dev",
      hashedPassword: password,
      name: "Mariana Oliveira",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "Formada em estatística, migrando para Machine Learning e IA.",
          goals:
            "Sou formada em estatística e quero me tornar ML Engineer. Tenho bases sólidas em Python e análise de dados, mas preciso de orientação para estruturar meu portfólio, entender MLOps e conseguir minha primeira vaga formal na área de ML.",
          currentRole: "Analista de Dados",
          desiredRole: "ML Engineer",
          skills: ["Python", "Pandas", "Scikit-learn", "SQL", "R"],
          areasOfInterest: [
            "Machine Learning",
            "Data Science",
            "MLOps",
            "Career Transition",
          ],
          linkedinUrl: "https://linkedin.com/in/marianaoliveira",
        },
      },
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "pedro.front@mentorflow.dev" },
    update: {},
    create: {
      email: "pedro.front@mentorflow.dev",
      hashedPassword: password,
      name: "Pedro Almeida",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "Desenvolvedor frontend buscando evoluir para tech lead.",
          goals:
            "Tenho 5 anos de experiência como desenvolvedor frontend React. Quero aprender a liderar times técnicos, tomar decisões de arquitetura e evoluir para uma posição de tech lead. Busco entender como pessoas técnicas se tornam líderes eficazes.",
          currentRole: "Desenvolvedor Frontend Pleno",
          desiredRole: "Tech Lead",
          skills: ["React", "TypeScript", "Next.js", "CSS", "Testing"],
          areasOfInterest: [
            "Tech Lead",
            "Frontend Architecture",
            "Team Building",
            "Performance",
          ],
          githubUrl: "https://github.com/pedroalmeida",
          linkedinUrl: "https://linkedin.com/in/pedroalmeida",
        },
      },
    },
  });

  const d = (daysAgo: number, extraMinutes = 0) =>
    new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 + extraMinutes * 60 * 1000);

  // ── Mentorship 1: João ↔ Ana Silva (ACTIVE, 30 days) ──────────────────────
  const mentorship1 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-1" },
    update: {},
    create: {
      id: "seed-mentorship-1",
      studentId: student1.id,
      mentorId: mentor1.id,
      status: "ACTIVE",
      topic: "Evolução para backend sênior e sistemas distribuídos",
      message:
        "Olá Ana! Sou desenvolvedor júnior e vi seu perfil. Você tem exatamente a experiência que busco — sistemas distribuídos e backend em grandes empresas. Adoraria sua orientação para evoluir minha carreira.",
      startedAt: d(30),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m1-01", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(29), content: "Olá João! Que ótimo te conhecer. Li seu perfil e vejo muito potencial. Vamos começar: me conta mais sobre seu dia a dia no trabalho atual." },
      { id: "m1-02", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(29, 30), content: "Oi Ana! Trabalho em uma startup de e-commerce construindo APIs REST em Node.js. O maior desafio é performance quando o tráfego aumenta." },
      { id: "m1-03", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(28), content: "Entendo! Isso é clássico. Performance em Node.js geralmente vem de como você lida com I/O e de como estrutura as queries. Você usa connection pooling no PostgreSQL?" },
      { id: "m1-04", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(28, 20), content: "Uso pg-pool, mas não sei se estou configurando certo. Às vezes vejo erros de timeout em horários de pico." },
      { id: "m1-05", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(27), content: "Ok! Nossa primeira tarefa: me manda as configs do pool (sem credenciais). Também vamos usar EXPLAIN ANALYZE para identificar queries lentas." },
      { id: "m1-06", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(26), content: "Mandei as configs por aqui. Pool size: 10, idleTimeoutMillis: 30000. Acredito que o gargalo está nas queries de listagem de produtos com filtros dinâmicos." },
      { id: "m1-07", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(25), content: "Pool de 10 está baixo para e-commerce em pico. Recomendo 20–30. E sim, queries com filtros dinâmicos sem índices adequados são o vilão. Rode EXPLAIN ANALYZE na query mais lenta e me manda o plano." },
      { id: "m1-08", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(23), content: "Rodei o EXPLAIN ANALYZE! A query de listagem está fazendo Sequential Scan em 2 tabelas. Nunca tinha visto isso antes, foi revelador." },
      { id: "m1-09", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(22), content: "Excelente! Seq Scan em tabela grande é o inimigo. Vamos adicionar índices compostos nas colunas dos filtros mais usados. Que colunas você filtra com mais frequência?" },
      { id: "m1-10", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(21), content: "Filtros mais comuns: categoria + status + preço. Criei os índices como você sugeriu e a query caiu de 800ms para 45ms. Estou impressionado!" },
      { id: "m1-11", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(20), content: "Isso é um resultado incrível! 94% de melhora. Agora que você entende índices, próximo passo: vamos falar sobre como o Nubank lida com sistemas que precisam de alta disponibilidade. Quer explorar o conceito de circuit breaker?" },
      { id: "m1-12", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(18), content: "Com certeza! Nunca implementei circuit breaker na prática. Vi artigos sobre o padrão mas não sei por onde começar." },
      { id: "m1-13", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(17), content: "Vou te mandar um desafio prático: implementa um circuit breaker simples para a chamada ao serviço de pagamento da sua API. Pode usar a lib opossum para Node.js. Prazo: uma semana?" },
      { id: "m1-14", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(10), content: "Implementei! Fiz com a opossum. O circuit abre após 3 falhas e faz health check a cada 10s. Aprendi muito sobre estados CLOSED/OPEN/HALF-OPEN." },
      { id: "m1-15", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(9), content: "Perfeito, isso é nível de dev pleno! Na próxima sessão vamos falar sobre como escalar horizontalmente e usar filas (Kafka/SQS) para desacoplar serviços." },
      { id: "m1-16", mentorshipId: mentorship1.id, senderId: student1.id, createdAt: d(2), content: "Ana, só queria dizer que meu tech lead comentou que a solução que implementei com circuit breaker foi muito madura para um júnior. Muito obrigado!" },
      { id: "m1-17", mentorshipId: mentorship1.id, senderId: mentor1.id, createdAt: d(1), content: "Que notícia incrível! Isso é o poder da mentoria na prática. Continue assim — você está evoluindo muito rápido. 🚀" },
    ],
  });

  // ── Mentorship 2: Mariana ↔ Patrícia (ACTIVE, 21 days) ───────────────────
  const mentorship2 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-2" },
    update: {},
    create: {
      id: "seed-mentorship-2",
      studentId: student2.id,
      mentorId: mentor3.id,
      status: "ACTIVE",
      topic: "Transição para ML Engineering",
      message:
        "Patrícia, seu perfil é incrível! Como pesquisadora de ML que veio da área de dados, você é exatamente quem eu preciso para orientar minha transição. Tenho bases sólidas em Python e análise de dados.",
      startedAt: d(21),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m2-01", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(20), content: "Oi Mariana! Adorei seu background em estatística. Isso é uma vantagem enorme para ML. Vamos estruturar um plano de 3 meses para sua transição. Você tem projetos no GitHub?" },
      { id: "m2-02", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(20, 45), content: "Tenho alguns notebooks de análise de dados e um projeto de predição de churn do trabalho. Mas sinto que o portfólio é fraco para ML Engineer." },
      { id: "m2-03", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(19), content: "Projeto de churn é excelente! O problema é como você apresenta. Vamos transformar em um case completo: pipeline → feature engineering → modelo → API → monitoramento. Isso é exatamente o que um ML Engineer faz." },
      { id: "m2-04", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(18), content: "Faz sentido! Por onde começo? Devo refatorar os notebooks ou criar uma estrutura nova do zero?" },
      { id: "m2-05", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(17), content: "Cria uma estrutura nova usando cookiecutter-data-science. Separa em: data/, notebooks/, src/features/, src/models/, api/. Notebooks são para exploração, o código de produção vai em src/." },
      { id: "m2-06", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(14), content: "Reestruturei tudo! Criei o pipeline com sklearn Pipeline e salvei o modelo com joblib. Agora estou travada na parte de API. Nunca fiz uma API em Python." },
      { id: "m2-07", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(13), content: "Para servir modelos de ML, FastAPI é o padrão da indústria. É simples: você cria um endpoint POST /predict que recebe os features e retorna a predição. Te mando um template." },
      { id: "m2-08", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(11), content: "Consegui! A API está rodando localmente. Fiz um endpoint /predict que carrega o modelo e retorna a probabilidade de churn. Mas como faço deploy?" },
      { id: "m2-09", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(10), content: "Excelente progresso! Para deploy: Dockerize a API primeiro, depois usamos Railway ou Render (free tier). Isso vai deixar o projeto muito mais impressionante no portfólio." },
      { id: "m2-10", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(7), content: "API deployada no Render! Link funcionando. Um recrutador do LinkedIn viu o projeto e me chamou para conversa. Ainda não é uma oferta, mas é o primeiro sinal!" },
      { id: "m2-11", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(6), content: "ISSO! Viu como um projeto bem apresentado faz diferença? Agora vamos preparar você para a entrevista técnica de ML. Precisa saber explicar bias-variance tradeoff, overfitting e como você avaliou o modelo." },
      { id: "m2-12", mentorshipId: mentorship2.id, senderId: student2.id, createdAt: d(3), content: "Estudei tudo que você indicou. Tenho uma dúvida: como respondo quando perguntam sobre modelos que eu nunca usei em produção? Não quero mentir mas também não quero parecer inexperiente." },
      { id: "m2-13", mentorshipId: mentorship2.id, senderId: mentor3.id, createdAt: d(2), content: "Honestidade é sempre o melhor caminho. Diga: 'Estudei o algoritmo e entendo a teoria, mas ainda não implementei em produção — meu foco tem sido X e Y'. Isso mostra maturidade, não fraqueza." },
    ],
  });

  // ── Mentorship 3: Pedro ↔ Carlos (COMPLETED) ─────────────────────────────
  const mentorship3 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-3" },
    update: {},
    create: {
      id: "seed-mentorship-3",
      studentId: student3.id,
      mentorId: mentor2.id,
      status: "COMPLETED",
      topic: "Transição para Tech Lead",
      message: "Carlos, vejo que você fez exatamente essa transição de dev para tech lead. Gostaria muito de aprender como você conseguiu isso.",
      startedAt: d(75),
      completedAt: d(10),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m3-01", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(74), content: "Olá Pedro! Que bom te ter aqui. A transição para tech lead é muito sobre mindset. A primeira coisa que precisa entender: você para de ser o melhor programador do time e começa a fazer o time ser melhor. Como você se sente sobre isso?" },
      { id: "m3-02", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(74, 60), content: "Honestamente? Tenho medo de perder a parte técnica. Mas também sei que quero crescer. Como você equilibrou isso no início?" },
      { id: "m3-03", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(73), content: "Esse medo é saudável e todo tech lead passa por isso. O segredo é: continue fazendo code review sério, participe das decisões técnicas, mas delegue a implementação. Você ainda é técnico, só não é mais o único." },
      { id: "m3-04", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(60), content: "Tive uma situação difícil: discordei da abordagem técnica do meu gerente para um projeto. Cedi, mas o projeto teve problemas. Como devo lidar com isso?" },
      { id: "m3-05", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(59), content: "Situação clássica. Você precisa aprender a vender suas ideias técnicas para não-técnicos. Use dados: 'essa abordagem vai custar X horas de manutenção vs Y da alternativa'. Decisão técnica é argumento técnico, não hierarquia." },
      { id: "m3-06", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(45), content: "Apliquei a técnica! Na reunião de planejamento, apresentei um comparativo de complexidade e custo de manutenção. O gerente concordou com minha proposta. Nunca tinha sentido tanta confiança numa reunião." },
      { id: "m3-07", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(44), content: "PERFEITO! Isso é exatamente o que um tech lead faz. Agora fale comigo: como está o 1:1 com os devs do seu time? Você faz 1:1s?" },
      { id: "m3-08", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(30), content: "Comecei a fazer 1:1s semanais com os 3 devs do meu squad. Descobri que um deles estava desmotivado por falta de desafios. Consegui que ele liderasse um refactoring importante. Ele ficou muito mais engajado." },
      { id: "m3-09", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(29), content: "Isso é liderança de alto nível! Identificar o que motiva cada pessoa e alinhar com as necessidades do time. Você está crescendo muito rápido, Pedro. Acho que já está pronto para o próximo nível." },
      { id: "m3-10", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(15), content: "Carlos, tenho uma notícia: fui promovido oficialmente para Tech Lead! O gerente mencionou especificamente a maturidade que demonstrei nas últimas semanas. Obrigado por tudo!" },
      { id: "m3-11", mentorshipId: mentorship3.id, senderId: mentor2.id, createdAt: d(14), content: "PARABÉNS Pedro!!! Você mereceu cada bit dessa promoção. Foi um prazer acompanhar sua evolução. O que a gente construiu juntos aqui foi real — a conquista é toda sua!" },
      { id: "m3-12", mentorshipId: mentorship3.id, senderId: student3.id, createdAt: d(11), content: "Vou marcar nossa mentoria como concluída, mas saiba que você vai ser uma referência pra mim daqui para frente. Muito obrigado, Carlos!" },
    ],
  });

  await prisma.feedback.upsert({
    where: { mentorshipId: mentorship3.id },
    update: {},
    create: {
      mentorshipId: mentorship3.id,
      reviewerId: student3.id,
      rating: 5,
      comment:
        "Carlos foi um mentor excepcional. Em 2 meses me ajudou a entender que liderança técnica vai muito além do código — é sobre pessoas, argumentação e confiança. Fui promovido para Tech Lead e parte disso é mérito dele. Recomendo sem hesitar!",
    },
  });

  // ── Mentorship 4: João → Roberto (PENDING) ───────────────────────────────
  await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-4" },
    update: {},
    create: {
      id: "seed-mentorship-4",
      studentId: student1.id,
      mentorId: mentor4.id,
      status: "PENDING",
      topic: "Aprender DevOps e CI/CD",
      message:
        "Roberto, vejo que você é especialista em DevOps e Cloud. Trabalho num ambiente ainda bem manual e gostaria de aprender a implementar boas práticas de CI/CD e infraestrutura como código. Seria incrível contar com sua orientação.",
    },
  });

  // ── Mentorship 5: Pedro ↔ Fernanda (ACTIVE, 12 days) ─────────────────────
  const mentorship5 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-5" },
    update: {},
    create: {
      id: "seed-mentorship-5",
      studentId: student3.id,
      mentorId: mentor5.id,
      status: "ACTIVE",
      topic: "Entender o lado de produto para ser um tech lead mais completo",
      message:
        "Fernanda, como novo tech lead sinto que preciso entender melhor a visão de produto. Você tem experiência em PM e trabalha próximo de engenharia. Gostaria de aprender a pensar mais como produto.",
      startedAt: d(12),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m5-01", mentorshipId: mentorship5.id, senderId: mentor5.id, createdAt: d(11), content: "Oi Pedro! Tech leads que entendem de produto são raros e muito valorizados. Primeira pergunta: quando você e o PM discordam sobre prioridade de uma feature, o que acontece?" },
      { id: "m5-02", mentorshipId: mentorship5.id, senderId: student3.id, createdAt: d(11, 40), content: "Honestamente, costumo ceder. Não me sinto confiante para questionar decisões de produto porque acho que não tenho as ferramentas certas para isso." },
      { id: "m5-03", mentorshipId: mentorship5.id, senderId: mentor5.id, createdAt: d(10), content: "Você precisa aprender a linguagem de produto: impacto vs esforço, métricas de sucesso, hipóteses. Quando você falar 'essa feature tem alto esforço técnico e impacto incerto', o PM vai te respeitar muito mais." },
      { id: "m5-04", mentorshipId: mentorship5.id, senderId: student3.id, createdAt: d(8), content: "Fiz isso hoje! Questionei uma feature com pouco respaldo em dados e sugeri um experimento A/B menor primeiro. O PM ficou surpreso mas concordou. Parece que falar a língua deles muda tudo." },
      { id: "m5-05", mentorshipId: mentorship5.id, senderId: mentor5.id, createdAt: d(7), content: "Exato! Você deixou de ser o cara que 'empurra back' e virou o cara que 'protege o time de desperdício'. Isso é postura de tech lead sênior. Agora vamos falar sobre OKRs e como conectar trabalho técnico a métricas de negócio." },
      { id: "m5-06", mentorshipId: mentorship5.id, senderId: student3.id, createdAt: d(4), content: "Estudei OKRs e propus para o meu gerente escrever os key results técnicos alinhados com os OKRs de produto. Ele amou a iniciativa e me pediu para apresentar na reunião de toda a engenharia!" },
      { id: "m5-07", mentorshipId: mentorship5.id, senderId: mentor5.id, createdAt: d(3), content: "Que evolução incrível em tão pouco tempo! Você está se tornando uma ponte entre produto e engenharia — esse perfil é raro e abre portas para Staff Engineer ou até Head of Engineering no futuro." },
    ],
  });

  // ── Mentorship 6: Mariana → Roberto (REJECTED) ───────────────────────────
  await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-6" },
    update: {},
    create: {
      id: "seed-mentorship-6",
      studentId: student2.id,
      mentorId: mentor4.id,
      status: "REJECTED",
      topic: "MLOps e infraestrutura para modelos de ML",
      message:
        "Roberto, vejo que você tem muita experiência com Kubernetes e Docker. Quero aprender a fazer deploy de modelos de ML em produção com as práticas de DevOps corretas.",
      rejectionReason:
        "Olá Mariana! Infelizmente minha agenda está cheia no momento — já estou com 3 mentorandos ativos e não consigo oferecer a dedicação que você merece. Recomendo a Patrícia Rocha que tem experiência específica em MLOps. Boa sorte na sua jornada!",
    },
  });

  // ── Extra students for Fernanda's mentorships ────────────────────────────
  const student4 = await prisma.user.upsert({
    where: { email: "lucas.pm@mentorflow.dev" },
    update: {},
    create: {
      email: "lucas.pm@mentorflow.dev",
      hashedPassword: password,
      name: "Lucas Ferreira",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "Desenvolvedor backend que quer migrar para gestão de produto.",
          goals: "Tenho 4 anos de experiência como desenvolvedor e quero transicionar para Product Manager. Preciso entender discovery, métricas, como priorizar roadmap e como trabalhar com times de design e engenharia do ponto de vista de produto.",
          currentRole: "Desenvolvedor Backend Pleno",
          desiredRole: "Product Manager",
          skills: ["Python", "SQL", "APIs REST", "Git"],
          areasOfInterest: ["Product Management", "Career Transition", "Agile", "UX Research"],
          linkedinUrl: "https://linkedin.com/in/lucasferreira",
        },
      },
    },
  });

  const student5 = await prisma.user.upsert({
    where: { email: "sofia.ux@mentorflow.dev" },
    update: {},
    create: {
      email: "sofia.ux@mentorflow.dev",
      hashedPassword: password,
      name: "Sofia Martins",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "UX Designer buscando entender melhor o lado de produto e estratégia.",
          goals: "Sou UX Designer há 3 anos e quero crescer para Product Designer ou Associate PM. Preciso aprender a usar dados para embasar decisões de design, entender OKRs e como influenciar o roadmap de produto.",
          currentRole: "UX Designer",
          desiredRole: "Product Designer / Associate PM",
          skills: ["Figma", "User Research", "Prototipação", "Design Thinking"],
          areasOfInterest: ["Product Management", "UX Research", "OKRs", "Data Analysis"],
          linkedinUrl: "https://linkedin.com/in/sofiamartins",
        },
      },
    },
  });

  const student6 = await prisma.user.upsert({
    where: { email: "rafael.agile@mentorflow.dev" },
    update: {},
    create: {
      email: "rafael.agile@mentorflow.dev",
      hashedPassword: password,
      name: "Rafael Cunha",
      role: "STUDENT",
      studentProfile: {
        create: {
          bio: "Scrum Master querendo evoluir para a área de produto.",
          goals: "Trabalho como Scrum Master e quero me tornar Product Owner ou PM. Já entendo bem o processo ágil e tenho contato com stakeholders, mas preciso de orientação para desenvolver visão de produto, construir roadmap e trabalhar com métricas de negócio.",
          currentRole: "Scrum Master",
          desiredRole: "Product Owner",
          skills: ["Scrum", "Kanban", "Jira", "Facilitação"],
          areasOfInterest: ["Product Management", "OKRs", "Agile", "Stakeholder Management"],
        },
      },
    },
  });

  // ── Fernanda: COMPLETED mentorship with Lucas ────────────────────────────
  const mentorship7 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-7" },
    update: {},
    create: {
      id: "seed-mentorship-7",
      studentId: student4.id,
      mentorId: mentor5.id,
      status: "COMPLETED",
      topic: "Transição de dev para Product Manager",
      message: "Fernanda, seu histórico de trabalhar próximo a times de engenharia é exatamente o que me falta como referência. Gostaria de aprender como fazer essa transição de dev para PM.",
      startedAt: d(90),
      completedAt: d(20),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m7-01", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(89), content: "Oi Lucas! Desenvolvedores que viram PMs são incríveis — vocês conseguem estimar esforço real e têm credibilidade com o time de engenharia. Primeira pergunta: por que você quer sair do código?" },
      { id: "m7-02", mentorshipId: mentorship7.id, senderId: student4.id, createdAt: d(89, 50), content: "Sempre me interessei mais pelo 'por quê' do que pelo 'como'. Fico frustrado quando construímos features que ninguém usa. Quero estar na origem das decisões." },
      { id: "m7-03", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(88), content: "Esse é exatamente o mindset certo. Vamos começar pelo básico: você já tem acesso a dados de uso do produto atual? Quero que você me traga os 3 flows com maior drop-off." },
      { id: "m7-04", mentorshipId: mentorship7.id, senderId: student4.id, createdAt: d(75), content: "Peguei os dados! O checkout tem 68% de abandono no passo de endereço. Fiz uma análise no SQL e parece que usuários mobile abandonam 2x mais que desktop." },
      { id: "m7-05", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(74), content: "Excelente! Agora você precisa formular uma hipótese e propor um experimento. Tente: 'Se simplificarmos o formulário de endereço no mobile, reduzimos o abandono em X%'. Isso é pensar como PM." },
      { id: "m7-06", mentorshipId: mentorship7.id, senderId: student4.id, createdAt: d(60), content: "Apresentei a hipótese para o meu PM e ele me convidou para participar do planejamento da próxima sprint. Disse que minha análise foi a mais fundamentada que ele já viu vir de um dev." },
      { id: "m7-07", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(59), content: "Isso é ouro, Lucas! Você já está atuando como PM sem ter o título. Agora vamos construir seu portfólio: documente esse case com contexto, hipótese, experimento e resultado esperado." },
      { id: "m7-08", mentorshipId: mentorship7.id, senderId: student4.id, createdAt: d(30), content: "Fernanda, tenho uma entrevista para Associate PM amanhã! A empresa viu meu portfólio no LinkedIn. Consigo um tempo para um mock interview?" },
      { id: "m7-09", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(29), content: "Claro! Vou te mandar as perguntas mais comuns: 'Qual produto você melhoraria?', 'Como priorizaria esse roadmap?' e 'Me conte sobre um conflito com engenharia'. Prepare cases reais para cada uma." },
      { id: "m7-10", mentorshipId: mentorship7.id, senderId: student4.id, createdAt: d(21), content: "PASSEI! Começo na semana que vem como Associate PM. Fernanda, sem você eu não teria nem chegado na entrevista. Muito obrigado de verdade!" },
      { id: "m7-11", mentorshipId: mentorship7.id, senderId: mentor5.id, createdAt: d(20), content: "Lucas!!! Que notícia incrível! Você foi brilhante — eu só te dei o caminho, você fez todo o trabalho. Vai com tudo, e qualquer dúvida nos primeiros meses pode me chamar!" },
    ],
  });

  await prisma.feedback.upsert({
    where: { mentorshipId: mentorship7.id },
    update: {},
    create: {
      mentorshipId: mentorship7.id,
      reviewerId: student4.id,
      rating: 5,
      comment: "Fernanda foi transformadora na minha jornada. Ela não me ensinou só sobre produto — me ensinou a pensar diferente. Em 3 meses passei de dev frustrado para Associate PM contratado. A metodologia dela de aprender fazendo é incrível.",
    },
  });

  // ── Fernanda: ACTIVE mentorship with Sofia ───────────────────────────────
  const mentorship8 = await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-8" },
    update: {},
    create: {
      id: "seed-mentorship-8",
      studentId: student5.id,
      mentorId: mentor5.id,
      status: "ACTIVE",
      topic: "Evoluir de UX Designer para Product Designer com visão de produto",
      message: "Fernanda, como PM com background próximo a design, você é a pessoa certa para me ajudar a crescer além do Figma e entender como influenciar decisões de produto.",
      startedAt: d(18),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { id: "m8-01", mentorshipId: mentorship8.id, senderId: mentor5.id, createdAt: d(17), content: "Oi Sofia! Product Designer é um dos perfis mais valorizados no mercado agora. A diferença para UX Designer é que você também é dona do 'o quê' e não só do 'como'. Me conta: você já questiona as features que recebe para desenhar?" },
      { id: "m8-02", mentorshipId: mentorship8.id, senderId: student5.id, createdAt: d(17, 45), content: "Às vezes sim, mas sinto que não tenho autoridade para isso. Os PMs passam o brief e eu executo. Quero ter mais voz no processo." },
      { id: "m8-03", mentorshipId: mentorship8.id, senderId: mentor5.id, createdAt: d(16), content: "Autoridade se constrói com dados. Na próxima vez que receber um brief, pergunte: 'Qual métrica essa feature vai mover?' Se o PM não souber responder, você já ganhou espaço para contribuir." },
      { id: "m8-04", mentorshipId: mentorship8.id, senderId: student5.id, createdAt: d(12), content: "Fiz isso! O PM ficou surpreso, mas adorou a pergunta. Acabamos redefinindo o escopo da feature juntos. Senti pela primeira vez que estava colaborando, não só executando." },
      { id: "m8-05", mentorshipId: mentorship8.id, senderId: mentor5.id, createdAt: d(11), content: "Perfeito! Isso é Product Design na prática. Agora quero que você aprenda a fazer user research com lente de negócio: não só 'o usuário tem dificuldade aqui' mas 'essa dificuldade custa X% de conversão'." },
      { id: "m8-06", mentorshipId: mentorship8.id, senderId: student5.id, createdAt: d(5), content: "Fiz uma pesquisa com 15 usuários e correlacionei com dados de analytics. O resultado foi tão forte que o PM apresentou para o CEO. Meu nome estava nos slides!" },
      { id: "m8-07", mentorshipId: mentorship8.id, senderId: mentor5.id, createdAt: d(4), content: "Isso é exatamente o que separa um Product Designer de um UX Designer. Você está no caminho certo. Próximo passo: vamos trabalhar em como você apresenta trade-offs de design para stakeholders não-técnicos." },
    ],
  });

  // ── Fernanda: PENDING request from Rafael ────────────────────────────────
  await prisma.mentorship.upsert({
    where: { id: "seed-mentorship-9" },
    update: {},
    create: {
      id: "seed-mentorship-9",
      studentId: student6.id,
      mentorId: mentor5.id,
      status: "PENDING",
      topic: "Transição de Scrum Master para Product Owner",
      message: "Fernanda, como Scrum Master tenho contato diário com produto mas sem autoridade para decidir. Você tem experiência em PM e gestão de produto — adoraria sua orientação para dar esse próximo passo na carreira.",
    },
  });

  // ── Update ratings ────────────────────────────────────────────────────────
  await prisma.mentorProfile.update({
    where: { userId: mentor2.id },
    data: { averageRating: 4.9, totalReviews: 19 },
  });

  await prisma.mentorProfile.update({
    where: { userId: mentor5.id },
    data: { averageRating: 4.7, totalReviews: 32 },
  });

  // ── Pre-populate match explanation cache (avoids API calls on first load) ─
  const explanations = [
    // João × mentors
    { studentId: student1.id, mentorId: mentor1.id, explanation: "Ana Silva é a mentora ideal para João: como Staff Engineer no Nubank com 12 anos em sistemas distribuídos e backend Go/Kotlin, ela tem exatamente a expertise que João precisa para evoluir de dev júnior a engenheiro sênior. A combinação de PostgreSQL, Docker e arquitetura de alta disponibilidade que Ana domina se alinha perfeitamente com os desafios de performance que João enfrenta no dia a dia." },
    { studentId: student1.id, mentorId: mentor4.id, explanation: "Roberto Lima complementa perfeitamente o perfil de João com sua expertise em DevOps, Kubernetes e CI/CD — áreas que João ainda não explorou mas que são fundamentais para um engenheiro backend sênior. Com 10 anos na Stone focados em infraestrutura como código e migração para microsserviços, Roberto pode dar a João a visão completa do ciclo de vida de um sistema em produção." },
    { studentId: student1.id, mentorId: mentor2.id, explanation: "Carlos Mendes traz uma perspectiva valiosa para João: como Tech Lead no iFood com foco em performance web e sistemas escaláveis, Carlos pode ajudá-lo a entender como as decisões de frontend impactam o backend e como pensar em arquitetura de ponta a ponta. Sua experiência com GraphQL e design systems complementa bem o background de Node.js de João." },
    // Mariana × mentors
    { studentId: student2.id, mentorId: mentor3.id, explanation: "Patrícia Rocha é a mentora perfeita para Mariana: com PhD em IA, experiência em NLP e MLOps no Mercado Livre, ela percorreu exatamente o caminho que Mariana quer trilhar — de análise de dados para ML Engineering. A sólida base em estatística de Mariana aliada à orientação de Patrícia sobre PyTorch, pipelines de produção e estruturação de portfólio é uma combinação extremamente poderosa." },
    { studentId: student2.id, mentorId: mentor1.id, explanation: "Ana Silva oferece à Mariana uma perspectiva única: como engenheira que constrói sistemas de alta escala que consomem modelos de ML em produção, Ana pode ensinar Mariana a pensar nos requisitos de engenharia que os sistemas de ML precisam atender. Entender como o backend lida com inferência em tempo real vai tornar Mariana uma ML Engineer muito mais completa e valorizada no mercado." },
    // Pedro × mentors
    { studentId: student3.id, mentorId: mentor2.id, explanation: "Carlos Mendes é o mentor ideal para Pedro: ele fez exatamente a transição que Pedro deseja — de desenvolvedor frontend sênior para Tech Lead no iFood. Com experiência em liderar times que constroem produtos para 20 milhões de usuários, Carlos pode ensinar Pedro tanto as habilidades técnicas quanto as soft skills essenciais para ser um líder eficaz e respeitado." },
    { studentId: student3.id, mentorId: mentor5.id, explanation: "Fernanda Costa complementa perfeitamente a jornada de Pedro para Tech Lead: como Senior PM na Conta Azul com experiência em conectar times técnicos e de produto, ela pode ensinar Pedro a falar a língua do negócio, priorizar com dados e se tornar uma ponte entre engenharia e produto — habilidade indispensável para tech leads que querem ter impacto real." },
    // Lucas × mentors
    { studentId: student4.id, mentorId: mentor5.id, explanation: "Fernanda Costa é a mentora perfeita para Lucas: como Senior PM que já trabalhou lado a lado com engenheiros, ela entende exatamente as dificuldades de quem vem do código e quer entrar em produto. Sua experiência em discovery, métricas e roadmap estratégico vai dar a Lucas as ferramentas práticas que ele precisa para fazer a transição com credibilidade." },
    // Sofia × mentors
    { studentId: student5.id, mentorId: mentor5.id, explanation: "Fernanda Costa é ideal para Sofia: com experiência em gestão de produto e trabalho próximo a times de design, ela pode ensinar Sofia a pensar além do Figma — usando dados, OKRs e visão estratégica para influenciar decisões de produto. A combinação do olhar de UX de Sofia com a mentalidade de PM de Fernanda é muito poderosa." },
    // Rafael × mentors
    { studentId: student6.id, mentorId: mentor5.id, explanation: "Fernanda Costa é a mentora certa para Rafael: seu perfil de PM com foco em estratégia e roadmap é exatamente o que Rafael precisa para evoluir de Scrum Master para Product Owner. Como alguém que já trabalhou com metodologias ágeis e stakeholders, Fernanda pode ensinar Rafael a usar sua experiência em facilitação como vantagem competitiva na área de produto." },
  ];

  for (const e of explanations) {
    await prisma.matchExplanationCache.upsert({
      where: { studentId_mentorId: { studentId: e.studentId, mentorId: e.mentorId } },
      create: e,
      update: { explanation: e.explanation },
    });
  }
  console.log("💡 Match explanation cache pre-populated.");

  // Generate Gemini embeddings for all profiles
  if (process.env.GEMINI_API_KEY) {
    console.log("🤖 Generating AI embeddings...");
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    async function embed(text: string) {
      const result = await model.embedContent(text);
      return `[${result.embedding.values.join(",")}]`;
    }

    const mentorProfiles = await prisma.mentorProfile.findMany({
      include: { user: true },
    });

    for (const mp of mentorProfiles) {
      const text = [
        "Experienced mentor available for mentorship.",
        mp.areasOfExpertise.length > 0 ? `Areas of expertise: ${mp.areasOfExpertise.join(", ")}.` : "",
        mp.skills.length > 0 ? `Technical skills: ${mp.skills.join(", ")}.` : "",
        mp.expertise ? `Background: ${mp.expertise}.` : "",
        mp.currentRole ? `Current role: ${mp.currentRole}.` : "",
        mp.company ? `At company: ${mp.company}.` : "",
        `Years of experience: ${mp.yearsExperience}.`,
        mp.bio ? `Bio: ${mp.bio}` : "",
      ].filter(Boolean).join(" ");

      const vec = await embed(text);
      await prisma.$executeRaw`
        UPDATE mentor_profiles SET embedding = ${vec}::vector WHERE "userId" = ${mp.userId}
      `;
      console.log(`  ✓ Mentor embedding: ${mp.user.name}`);
    }

    const studentProfiles = await prisma.studentProfile.findMany({
      include: { user: true },
    });

    for (const sp of studentProfiles) {
      const text = [
        "Student seeking mentorship.",
        sp.goals ? `Learning goals: ${sp.goals}.` : "",
        sp.skills.length > 0 ? `Current skills: ${sp.skills.join(", ")}.` : "",
        sp.areasOfInterest.length > 0 ? `Interested in: ${sp.areasOfInterest.join(", ")}.` : "",
        sp.currentRole ? `Currently working as: ${sp.currentRole}.` : "",
        sp.desiredRole ? `Wants to become: ${sp.desiredRole}.` : "",
        sp.bio ? `Bio: ${sp.bio}` : "",
      ].filter(Boolean).join(" ");

      const vec = await embed(text);
      await prisma.$executeRaw`
        UPDATE student_profiles SET embedding = ${vec}::vector WHERE "userId" = ${sp.userId}
      `;
      console.log(`  ✓ Student embedding: ${sp.user.name}`);
    }
  } else {
    console.log("⚠️  GEMINI_API_KEY not set — skipping embeddings. Set the key and re-run npm run db:seed.");
  }

  console.log("✅ Seed complete!");
  console.log("\n📧 Test accounts (password: password123):");
  console.log("   Estudante: joao.dev@mentorflow.dev");
  console.log("   Estudante: mariana.py@mentorflow.dev");
  console.log("   Estudante: pedro.front@mentorflow.dev");
  console.log("   Mentor:    ana.silva@mentorflow.dev");
  console.log("   Mentor:    carlos.mendes@mentorflow.dev");
  console.log("   Mentor:    patricia.rocha@mentorflow.dev");
  console.log("   Mentor:    roberto.lima@mentorflow.dev");
  console.log("   Mentor:    fernanda.costa@mentorflow.dev");
  console.log("   Estudante: lucas.pm@mentorflow.dev");
  console.log("   Estudante: sofia.ux@mentorflow.dev");
  console.log("   Estudante: rafael.agile@mentorflow.dev");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
