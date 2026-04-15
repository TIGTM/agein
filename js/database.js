// ========== DATABASE (LocalStorage) ==========
const DB = {
    // Inicialização com dados de exemplo
    init() {
        if (!localStorage.getItem('fc_initialized')) {
            this.seedData();
            localStorage.setItem('fc_initialized', 'true');
        }
    },

    seedData() {
        // Clientes
        const clientes = [
            { id: 1, nome: 'Restaurante Sabor & Arte', cnpj: '12.345.678/0001-90', tipo: 'Restaurante', responsavel: 'João Silva', telefone: '(11) 98765-4321', email: 'contato@saborarte.com', endereco: 'Rua das Flores, 123 - São Paulo/SP', status: 'ativo', criadoEm: '2026-01-15' },
            { id: 2, nome: 'Padaria Pão Dourado', cnpj: '98.765.432/0001-10', tipo: 'Padaria', responsavel: 'Maria Santos', telefone: '(11) 91234-5678', email: 'maria@paodourado.com', endereco: 'Av. Paulista, 1000 - São Paulo/SP', status: 'ativo', criadoEm: '2026-02-20' },
            { id: 3, nome: 'Lanchonete Burger House', cnpj: '11.222.333/0001-44', tipo: 'Lanchonete', responsavel: 'Pedro Oliveira', telefone: '(11) 95555-1234', email: 'pedro@burgerhouse.com', endereco: 'Rua Augusta, 500 - São Paulo/SP', status: 'ativo', criadoEm: '2026-03-10' },
            { id: 4, nome: 'Indústria Alimentos Nutrição', cnpj: '55.666.777/0001-88', tipo: 'Indústria', responsavel: 'Ana Costa', telefone: '(11) 93333-2222', email: 'ana@inutricao.com', endereco: 'Rod. Anchieta, km 15 - SP', status: 'ativo', criadoEm: '2026-01-05' },
            { id: 5, nome: 'Café Aroma Premium', cnpj: '22.333.444/0001-55', tipo: 'Cafeteria', responsavel: 'Carlos Mendes', telefone: '(11) 94444-3333', email: 'carlos@cafearoma.com', endereco: 'Rua Oscar Freire, 200 - SP', status: 'inativo', criadoEm: '2025-11-20' }
        ];

        // Fornecedores
        const fornecedores = [
            { id: 1, nome: 'Distribuidora Alimentos SA', cnpj: '11.111.111/0001-11', categoria: 'Alimentos em geral', contato: 'Roberto Lima', telefone: '(11) 97777-8888', email: 'vendas@dalimentos.com', status: 'ativo' },
            { id: 2, nome: 'Frigorífico São Paulo', cnpj: '22.222.222/0001-22', categoria: 'Carnes', contato: 'José Ferreira', telefone: '(11) 96666-7777', email: 'jose@frigosp.com', status: 'ativo' },
            { id: 3, nome: 'Hortifruti Verde Vida', cnpj: '33.333.333/0001-33', categoria: 'Hortifrutigranjeiros', contato: 'Patrícia Souza', telefone: '(11) 95555-6666', email: 'patricia@verdevida.com', status: 'ativo' },
            { id: 4, nome: 'Laticínios Fazenda Feliz', cnpj: '44.444.444/0001-44', categoria: 'Laticínios', contato: 'Antônio Barros', telefone: '(11) 94444-5555', email: 'antonio@fazendafeliz.com', status: 'ativo' }
        ];

        // Equipe
        const equipe = [
            { id: 1, nome: 'Administrador', cargo: 'Consultor Sênior', email: 'admin@agein.com', telefone: '(11) 99999-0000', especialidade: 'Segurança Alimentar', status: 'ativo' },
            { id: 2, nome: 'Juliana Pereira', cargo: 'Nutricionista', email: 'juliana@agein.com', telefone: '(11) 98888-1111', especialidade: 'Rotulagem Nutricional', status: 'ativo' },
            { id: 3, nome: 'Ricardo Alves', cargo: 'Consultor Técnico', email: 'ricardo@agein.com', telefone: '(11) 97777-2222', especialidade: 'BPF/APPCC', status: 'ativo' }
        ];

        // Checklists
        const checklists = [
            { id: 1, nome: 'Checklist BPF - Boas Práticas de Fabricação', categoria: 'Segurança Alimentar', descricao: 'Verificação das boas práticas conforme RDC 216/2004', itens: this.getChecklistBPF(), criadoEm: '2026-01-10' },
            { id: 2, nome: 'Checklist APPCC', categoria: 'Controle de Riscos', descricao: 'Análise de Perigos e Pontos Críticos de Controle', itens: this.getChecklistAPPCC(), criadoEm: '2026-02-15' },
            { id: 3, nome: 'Checklist de Higienização', categoria: 'Limpeza', descricao: 'Verificação de procedimentos de limpeza e sanitização', itens: this.getChecklistHigienizacao(), criadoEm: '2026-03-01' },
            { id: 4, nome: 'Checklist de Recebimento de Mercadorias', categoria: 'Controle de Qualidade', descricao: 'Verificação no recebimento de matérias-primas', itens: this.getChecklistRecebimento(), criadoEm: '2026-03-20' }
        ];

        // Checklists aplicados
        const checklistsAplicados = [
            { id: 1, checklistId: 1, clienteId: 1, data: '2026-04-10', consultor: 'Administrador', conformidade: 85, status: 'concluido', observacoes: 'Estabelecimento em boas condições com algumas melhorias a implementar' },
            { id: 2, checklistId: 2, clienteId: 2, data: '2026-04-08', consultor: 'Juliana Pereira', conformidade: 92, status: 'concluido', observacoes: 'Excelente conformidade' },
            { id: 3, checklistId: 3, clienteId: 3, data: '2026-04-12', consultor: 'Ricardo Alves', conformidade: 78, status: 'em_andamento', observacoes: 'Necessita ajustes' }
        ];

        // POPs
        const pops = [
            { id: 1, titulo: 'POP - Higienização das Mãos', codigo: 'POP-001', versao: '1.0', clienteId: 1, responsavel: 'João Silva', objetivo: 'Estabelecer procedimentos para higienização correta das mãos', procedimento: '1. Molhar as mãos com água corrente\n2. Aplicar sabonete antisséptico\n3. Ensaboar palmas, dorso, entre os dedos e unhas por 20 segundos\n4. Enxaguar com água corrente\n5. Secar com papel toalha descartável\n6. Aplicar álcool 70%', frequencia: 'Antes do manuseio de alimentos e após contaminação', criadoEm: '2026-01-15' },
            { id: 2, titulo: 'POP - Higienização de Equipamentos', codigo: 'POP-002', versao: '1.0', clienteId: 1, responsavel: 'João Silva', objetivo: 'Garantir a limpeza adequada de equipamentos', procedimento: '1. Desligar o equipamento da tomada\n2. Remover resíduos grosseiros\n3. Aplicar detergente neutro\n4. Esfregar com esponja\n5. Enxaguar com água potável\n6. Sanitizar com solução clorada 200ppm\n7. Deixar secar ao ar livre', frequencia: 'Diária e após cada uso', criadoEm: '2026-01-20' },
            { id: 3, titulo: 'POP - Controle de Pragas', codigo: 'POP-003', versao: '2.0', clienteId: 2, responsavel: 'Maria Santos', objetivo: 'Prevenir e controlar a presença de pragas', procedimento: '1. Inspeção semanal das instalações\n2. Vedação de frestas e aberturas\n3. Manutenção de telas em janelas\n4. Contratação de empresa especializada\n5. Aplicação trimestral de desinsetização\n6. Monitoramento contínuo', frequencia: 'Semanal (inspeção) e Trimestral (aplicação)', criadoEm: '2026-02-01' },
            { id: 4, titulo: 'POP - Manejo de Resíduos', codigo: 'POP-004', versao: '1.0', clienteId: 3, responsavel: 'Pedro Oliveira', objetivo: 'Correta destinação de resíduos gerados', procedimento: '1. Separação por categoria (orgânico, reciclável, perigoso)\n2. Acondicionamento em sacos apropriados\n3. Armazenamento em local específico\n4. Retirada diária\n5. Registro de quantidade produzida\n6. Destinação final adequada', frequencia: 'Diária', criadoEm: '2026-02-10' }
        ];

        // Fichas Técnicas
        const fichas = [
            { id: 1, nome: 'Lasanha Bolonhesa', categoria: 'Prato Principal', clienteId: 1, porcoes: 8, modoPreparo: 'Cozinhar a massa al dente. Preparar o molho bolonhesa refogando cebola, alho e carne moída. Intercalar camadas de massa, molho, queijo e molho branco. Levar ao forno a 180°C por 40 minutos.', ingredientes: [{nome: 'Massa de lasanha', quantidade: 500, unidade: 'g'},{nome: 'Carne moída', quantidade: 800, unidade: 'g'},{nome: 'Molho de tomate', quantidade: 600, unidade: 'ml'},{nome: 'Queijo mussarela', quantidade: 400, unidade: 'g'},{nome: 'Cebola', quantidade: 150, unidade: 'g'},{nome: 'Alho', quantidade: 20, unidade: 'g'}], valorCalorico: 485, proteinas: 25, carboidratos: 42, gorduras: 22, fibras: 3, sodio: 680, criadoEm: '2026-03-01' },
            { id: 2, nome: 'Salada Caesar', categoria: 'Salada', clienteId: 1, porcoes: 4, modoPreparo: 'Lavar e higienizar a alface. Cortar em pedaços. Preparar o molho com maionese, mostarda, alho e queijo parmesão. Misturar todos os ingredientes e finalizar com croutons.', ingredientes: [{nome: 'Alface americana', quantidade: 300, unidade: 'g'},{nome: 'Frango grelhado', quantidade: 400, unidade: 'g'},{nome: 'Queijo parmesão', quantidade: 80, unidade: 'g'},{nome: 'Croutons', quantidade: 100, unidade: 'g'},{nome: 'Molho Caesar', quantidade: 120, unidade: 'ml'}], valorCalorico: 320, proteinas: 28, carboidratos: 18, gorduras: 16, fibras: 2, sodio: 520, criadoEm: '2026-03-15' },
            { id: 3, nome: 'Pão Francês', categoria: 'Panificação', clienteId: 2, porcoes: 30, modoPreparo: 'Misturar a farinha com fermento, sal e açúcar. Adicionar água aos poucos e sovar por 15 minutos. Deixar descansar por 1 hora. Dividir em porções, modelar e deixar crescer. Assar a 220°C por 20 minutos.', ingredientes: [{nome: 'Farinha de trigo', quantidade: 1000, unidade: 'g'},{nome: 'Água', quantidade: 600, unidade: 'ml'},{nome: 'Fermento biológico', quantidade: 15, unidade: 'g'},{nome: 'Sal', quantidade: 20, unidade: 'g'},{nome: 'Açúcar', quantidade: 20, unidade: 'g'}], valorCalorico: 140, proteinas: 4, carboidratos: 28, gorduras: 1, fibras: 1, sodio: 280, criadoEm: '2026-02-20' }
        ];

        // Visitas
        const visitas = [
            { id: 1, clienteId: 1, consultor: 'Administrador', data: '2026-04-20', horario: '09:00', tipo: 'Auditoria', objetivo: 'Auditoria de BPF', status: 'agendada', observacoes: '' },
            { id: 2, clienteId: 2, consultor: 'Juliana Pereira', data: '2026-04-18', horario: '14:00', tipo: 'Consultoria', objetivo: 'Revisão de rotulagem', status: 'agendada', observacoes: '' },
            { id: 3, clienteId: 3, consultor: 'Ricardo Alves', data: '2026-04-12', horario: '10:30', tipo: 'Implementação', objetivo: 'Implementação de POPs', status: 'realizada', observacoes: 'Visita realizada com sucesso. Próxima visita em 30 dias.' },
            { id: 4, clienteId: 1, consultor: 'Administrador', data: '2026-04-10', horario: '15:00', tipo: 'Auditoria', objetivo: 'Auditoria mensal', status: 'realizada', observacoes: 'Conformidade de 85%. Elaborado plano de ação.' }
        ];

        // Planos de Ação
        const planos = [
            { id: 1, clienteId: 1, titulo: 'Plano de Ação - Auditoria Abril 2026', data: '2026-04-10', responsavel: 'João Silva', prazo: '2026-05-10', status: 'em_andamento', acoes: [{descricao: 'Implementar novo procedimento de higienização', responsavel: 'Chef Carlos', prazo: '2026-04-25', status: 'concluido'},{descricao: 'Treinar equipe sobre manipulação de alimentos', responsavel: 'Maria Souza', prazo: '2026-05-05', status: 'em_andamento'},{descricao: 'Adquirir novos EPIs', responsavel: 'Administração', prazo: '2026-05-10', status: 'pendente'}] },
            { id: 2, clienteId: 3, titulo: 'Plano de Ação - Implementação POPs', data: '2026-04-12', responsavel: 'Pedro Oliveira', prazo: '2026-05-15', status: 'em_andamento', acoes: [{descricao: 'Elaborar POPs específicos', responsavel: 'Ricardo Alves', prazo: '2026-04-20', status: 'concluido'},{descricao: 'Treinar equipe nos POPs', responsavel: 'Pedro Oliveira', prazo: '2026-05-10', status: 'em_andamento'}] }
        ];

        // Documentação
        const documentacao = [
            { id: 1, clienteId: 1, nome: 'Alvará Sanitário', tipo: 'Licença', numero: 'ALV-2026-0001', emissao: '2026-01-01', vencimento: '2026-12-31', status: 'valido' },
            { id: 2, clienteId: 1, nome: 'Licença de Funcionamento', tipo: 'Licença', numero: 'LIC-2026-0001', emissao: '2026-01-01', vencimento: '2026-12-31', status: 'valido' },
            { id: 3, clienteId: 2, nome: 'Alvará Sanitário', tipo: 'Licença', numero: 'ALV-2026-0002', emissao: '2025-07-15', vencimento: '2026-07-14', status: 'valido' },
            { id: 4, clienteId: 3, nome: 'Alvará Sanitário', tipo: 'Licença', numero: 'ALV-2025-0003', emissao: '2025-04-20', vencimento: '2026-04-19', status: 'vencido' },
            { id: 5, clienteId: 4, nome: 'Registro MAPA', tipo: 'Registro', numero: 'MAPA-2024-0099', emissao: '2024-06-01', vencimento: '2026-06-01', status: 'proximo_vencimento' }
        ];

        // Treinamentos
        const treinamentos = [
            { id: 1, titulo: 'Boas Práticas de Fabricação', clienteId: 1, instrutor: 'Administrador', data: '2026-03-15', cargaHoraria: 8, participantes: 12, status: 'realizado', descricao: 'Treinamento completo sobre BPF conforme RDC 216' },
            { id: 2, titulo: 'Manipulação Higiênica de Alimentos', clienteId: 2, instrutor: 'Juliana Pereira', data: '2026-04-20', cargaHoraria: 4, participantes: 8, status: 'agendado', descricao: 'Treinamento básico para manipuladores' },
            { id: 3, titulo: 'APPCC - Análise de Perigos', clienteId: 4, instrutor: 'Ricardo Alves', data: '2026-02-10', cargaHoraria: 16, participantes: 6, status: 'realizado', descricao: 'Implementação do sistema APPCC' }
        ];

        // Formulários (Planilhas de temperatura, limpeza, etc.)
        const formularios = [
            { id: 1, clienteId: 1, tipo: 'Controle de Temperatura', data: '2026-04-12', registros: [{equipamento: 'Geladeira 1', temperatura: 4, hora: '08:00', responsavel: 'João'},{equipamento: 'Freezer 1', temperatura: -18, hora: '08:00', responsavel: 'João'}] },
            { id: 2, clienteId: 1, tipo: 'Controle de Limpeza', data: '2026-04-12', registros: [{local: 'Cozinha', produto: 'Detergente + Cloro', hora: '07:00', responsavel: 'Maria'}] },
            { id: 3, clienteId: 2, tipo: 'Controle de Recebimento', data: '2026-04-11', registros: [{produto: 'Farinha de Trigo', fornecedor: 'Distribuidora ABC', quantidade: '50kg', validade: '2026-08-10'}] }
        ];

        // Legislação
        const legislacoes = [
            { id: 1, titulo: 'RDC nº 216/2004', orgao: 'ANVISA', data: '2004-09-15', assunto: 'Boas Práticas para Serviços de Alimentação', descricao: 'Estabelece procedimentos de Boas Práticas para serviços de alimentação garantindo as condições higiênico-sanitárias do alimento preparado', escopo: 'Federal' },
            { id: 2, titulo: 'RDC nº 275/2002', orgao: 'ANVISA', data: '2002-10-21', assunto: 'Regulamento Técnico de Procedimentos Operacionais Padronizados', descricao: 'Dispõe sobre o Regulamento Técnico de POP aplicados aos Estabelecimentos Produtores/Industrializadores de Alimentos', escopo: 'Federal' },
            { id: 3, titulo: 'RDC nº 429/2020', orgao: 'ANVISA', data: '2020-10-08', assunto: 'Rotulagem Nutricional', descricao: 'Dispõe sobre a rotulagem nutricional dos alimentos embalados', escopo: 'Federal' },
            { id: 4, titulo: 'IN nº 75/2020', orgao: 'ANVISA', data: '2020-10-08', assunto: 'Requisitos Técnicos de Rotulagem', descricao: 'Estabelece os requisitos técnicos para declaração da rotulagem nutricional', escopo: 'Federal' },
            { id: 5, titulo: 'Lei nº 8.078/1990', orgao: 'Governo Federal', data: '1990-09-11', assunto: 'Código de Defesa do Consumidor', descricao: 'Dispõe sobre a proteção do consumidor', escopo: 'Federal' },
            { id: 6, titulo: 'Portaria CVS 5/2013', orgao: 'CVS-SP', data: '2013-04-09', assunto: 'Boas Práticas em Estabelecimentos Comerciais', descricao: 'Aprova o regulamento técnico sobre boas práticas para estabelecimentos comerciais de alimentos', escopo: 'Estadual (SP)' },
            { id: 7, titulo: 'RDC nº 14/2014', orgao: 'ANVISA', data: '2014-03-28', assunto: 'Matérias Estranhas em Alimentos', descricao: 'Dispõe sobre matérias estranhas macroscópicas e microscópicas em alimentos', escopo: 'Federal' }
        ];

        // Eventos do calendário
        const eventos = [
            { id: 1, titulo: 'Visita - Restaurante Sabor & Arte', data: '2026-04-20', tipo: 'visita' },
            { id: 2, titulo: 'Treinamento BPF', data: '2026-04-25', tipo: 'treinamento' },
            { id: 3, titulo: 'Auditoria Padaria', data: '2026-04-18', tipo: 'auditoria' },
            { id: 4, titulo: 'Reunião interna', data: '2026-04-15', tipo: 'reuniao' }
        ];

        // Salvar no localStorage
        localStorage.setItem('fc_clientes', JSON.stringify(clientes));
        localStorage.setItem('fc_fornecedores', JSON.stringify(fornecedores));
        localStorage.setItem('fc_equipe', JSON.stringify(equipe));
        localStorage.setItem('fc_checklists', JSON.stringify(checklists));
        localStorage.setItem('fc_checklistsAplicados', JSON.stringify(checklistsAplicados));
        localStorage.setItem('fc_pops', JSON.stringify(pops));
        localStorage.setItem('fc_fichas', JSON.stringify(fichas));
        localStorage.setItem('fc_visitas', JSON.stringify(visitas));
        localStorage.setItem('fc_planos', JSON.stringify(planos));
        localStorage.setItem('fc_documentacao', JSON.stringify(documentacao));
        localStorage.setItem('fc_treinamentos', JSON.stringify(treinamentos));
        localStorage.setItem('fc_formularios', JSON.stringify(formularios));
        localStorage.setItem('fc_legislacoes', JSON.stringify(legislacoes));
        localStorage.setItem('fc_eventos', JSON.stringify(eventos));
        localStorage.setItem('fc_rotulos', JSON.stringify([]));
    },

    getChecklistBPF() {
        return [
            { categoria: '1. Edificações e Instalações', itens: [
                { id: 1, pergunta: 'A área externa está livre de focos de insalubridade?' },
                { id: 2, pergunta: 'As instalações são projetadas de forma a possibilitar fluxo ordenado?' },
                { id: 3, pergunta: 'O acesso às instalações é controlado?' },
                { id: 4, pergunta: 'O piso, paredes e tetos estão em bom estado de conservação?' },
                { id: 5, pergunta: 'A iluminação é adequada?' }
            ]},
            { categoria: '2. Equipamentos e Utensílios', itens: [
                { id: 6, pergunta: 'Os equipamentos são de materiais adequados?' },
                { id: 7, pergunta: 'A manutenção dos equipamentos é documentada?' },
                { id: 8, pergunta: 'Os utensílios estão em bom estado de conservação?' },
                { id: 9, pergunta: 'Existe área específica para higienização de utensílios?' }
            ]},
            { categoria: '3. Manipuladores', itens: [
                { id: 10, pergunta: 'Os manipuladores possuem atestado de saúde?' },
                { id: 11, pergunta: 'Os uniformes são apropriados e limpos?' },
                { id: 12, pergunta: 'Realizam treinamentos periódicos?' },
                { id: 13, pergunta: 'Fazem uso adequado de EPIs?' }
            ]},
            { categoria: '4. Produção e Transporte', itens: [
                { id: 14, pergunta: 'As matérias-primas são de fornecedores qualificados?' },
                { id: 15, pergunta: 'O transporte mantém temperatura adequada?' },
                { id: 16, pergunta: 'Existe controle de temperatura dos alimentos?' },
                { id: 17, pergunta: 'O armazenamento é adequado?' }
            ]},
            { categoria: '5. Documentação e Registro', itens: [
                { id: 18, pergunta: 'Existe manual de Boas Práticas?' },
                { id: 19, pergunta: 'Os POPs estão implementados?' },
                { id: 20, pergunta: 'Existem registros de controle?' }
            ]}
        ];
    },

    getChecklistAPPCC() {
        return [
            { categoria: '1. Análise de Perigos', itens: [
                { id: 1, pergunta: 'Foram identificados os perigos biológicos?' },
                { id: 2, pergunta: 'Foram identificados os perigos químicos?' },
                { id: 3, pergunta: 'Foram identificados os perigos físicos?' }
            ]},
            { categoria: '2. Pontos Críticos de Controle', itens: [
                { id: 4, pergunta: 'Os PCCs estão identificados?' },
                { id: 5, pergunta: 'Os limites críticos estão estabelecidos?' },
                { id: 6, pergunta: 'Existe monitoramento dos PCCs?' }
            ]},
            { categoria: '3. Ações Corretivas', itens: [
                { id: 7, pergunta: 'Existem ações corretivas documentadas?' },
                { id: 8, pergunta: 'As não conformidades são registradas?' }
            ]}
        ];
    },

    getChecklistHigienizacao() {
        return [
            { categoria: '1. Área de Produção', itens: [
                { id: 1, pergunta: 'Pisos estão limpos e sem resíduos?' },
                { id: 2, pergunta: 'Paredes estão limpas?' },
                { id: 3, pergunta: 'Bancadas higienizadas?' },
                { id: 4, pergunta: 'Equipamentos limpos?' }
            ]},
            { categoria: '2. Sanitários', itens: [
                { id: 5, pergunta: 'Sanitários limpos e com insumos?' },
                { id: 6, pergunta: 'Lavatórios funcionando?' },
                { id: 7, pergunta: 'Lixeiras com tampa e pedal?' }
            ]},
            { categoria: '3. Produtos de Limpeza', itens: [
                { id: 8, pergunta: 'Produtos armazenados em local apropriado?' },
                { id: 9, pergunta: 'Todos os produtos têm rótulo?' },
                { id: 10, pergunta: 'Produtos têm registro ANVISA?' }
            ]}
        ];
    },

    getChecklistRecebimento() {
        return [
            { categoria: '1. Verificação Inicial', itens: [
                { id: 1, pergunta: 'Nota fiscal confere com o pedido?' },
                { id: 2, pergunta: 'Embalagens estão íntegras?' },
                { id: 3, pergunta: 'Data de validade adequada?' }
            ]},
            { categoria: '2. Controle de Temperatura', itens: [
                { id: 4, pergunta: 'Alimentos refrigerados entre 4-10°C?' },
                { id: 5, pergunta: 'Alimentos congelados abaixo de -18°C?' },
                { id: 6, pergunta: 'Veículo de transporte adequado?' }
            ]},
            { categoria: '3. Características Sensoriais', itens: [
                { id: 7, pergunta: 'Cor adequada?' },
                { id: 8, pergunta: 'Odor característico?' },
                { id: 9, pergunta: 'Textura adequada?' }
            ]}
        ];
    },

    // CRUD genérico
    getAll(entity) {
        return JSON.parse(localStorage.getItem(`fc_${entity}`) || '[]');
    },

    getById(entity, id) {
        const items = this.getAll(entity);
        return items.find(item => item.id === parseInt(id));
    },

    save(entity, item) {
        const items = this.getAll(entity);
        if (item.id) {
            const index = items.findIndex(i => i.id === item.id);
            if (index >= 0) items[index] = item;
            else items.push(item);
        } else {
            item.id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
            items.push(item);
        }
        localStorage.setItem(`fc_${entity}`, JSON.stringify(items));
        return item;
    },

    delete(entity, id) {
        let items = this.getAll(entity);
        items = items.filter(item => item.id !== parseInt(id));
        localStorage.setItem(`fc_${entity}`, JSON.stringify(items));
    },

    reset() {
        Object.keys(localStorage).filter(k => k.startsWith('fc_')).forEach(k => localStorage.removeItem(k));
        this.init();
    }
};

DB.init();
