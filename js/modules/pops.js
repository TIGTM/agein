// ========== MÓDULO POPs ==========
const POPsModule = {
    render() {
        const pops = DB.getAll('pops');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>POPs - Procedimentos Operacionais Padrão</h1>
                    <p>Crie e gerencie POPs para seus clientes</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-secondary" onclick="POPsModule.useTemplate()">📋 Usar Modelo</button>
                    <button class="btn btn-primary" onclick="POPsModule.showForm()">+ Novo POP</button>
                </div>
            </div>

            <div class="cards-grid">
                ${pops.map(p => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${p.titulo}</div>
                                <div class="item-card-subtitle">${p.codigo} • v${p.versao}</div>
                            </div>
                            <span style="font-size:24px;">📋</span>
                        </div>
                        <div class="item-card-body">
                            <strong>Cliente:</strong> ${Utils.getClienteNome(p.clienteId)}<br>
                            <strong>Objetivo:</strong> ${p.objetivo.substring(0, 100)}...
                        </div>
                        <div class="item-card-footer">
                            <small>${Utils.formatDate(p.criadoEm)}</small>
                            <div>
                                <button class="btn-icon" onclick="POPsModule.view(${p.id})" title="Visualizar">👁</button>
                                <button class="btn-icon" onclick="POPsModule.showForm(${p.id})" title="Editar">✎</button>
                                <button class="btn-icon" onclick="POPsModule.remove(${p.id})" title="Excluir">🗑</button>
                            </div>
                        </div>
                    </div>
                `).join('') || '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Nenhum POP cadastrado</h3></div>'}
            </div>
        `;
    },

    showForm(id = null) {
        const p = id ? DB.getById('pops', id) : { titulo: '', codigo: 'POP-' + String(DB.getAll('pops').length + 1).padStart(3, '0'), versao: '1.0', clienteId: '', responsavel: '', objetivo: '', procedimento: '', frequencia: '' };
        const clientes = DB.getAll('clientes').filter(c => c.status === 'ativo');

        Utils.showModal(
            id ? 'Editar POP' : 'Novo POP',
            `
            <form id="popForm" onsubmit="POPsModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Título *</label><input type="text" name="titulo" value="${p.titulo}" required></div>
                    <div class="form-group"><label>Código</label><input type="text" name="codigo" value="${p.codigo}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Versão</label><input type="text" name="versao" value="${p.versao}"></div>
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === p.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Responsável</label><input type="text" name="responsavel" value="${p.responsavel}"></div>
                    <div class="form-group"><label>Frequência</label><input type="text" name="frequencia" value="${p.frequencia}" placeholder="Ex: Diária, Semanal, Mensal"></div>
                </div>
                <div class="form-group"><label>Objetivo *</label><textarea name="objetivo" rows="2" required>${p.objetivo}</textarea></div>
                <div class="form-group"><label>Procedimento *</label><textarea name="procedimento" rows="8" required>${p.procedimento}</textarea></div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('popForm').requestSubmit()">Salvar</button>`,
            'large'
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('pops', {
            id: id || null,
            titulo: f.titulo.value, codigo: f.codigo.value, versao: f.versao.value,
            clienteId: parseInt(f.clienteId.value), responsavel: f.responsavel.value,
            objetivo: f.objetivo.value, procedimento: f.procedimento.value, frequencia: f.frequencia.value,
            criadoEm: id ? DB.getById('pops', id).criadoEm : new Date().toISOString().split('T')[0]
        });
        Utils.closeModal();
        Utils.showToast('POP salvo!', 'success');
        App.renderPage('pops');
    },

    view(id) {
        const p = DB.getById('pops', id);
        Utils.showModal(
            'Visualização do POP',
            `
            <div id="popContent" class="pop-document">
                <h1>${p.titulo}</h1>
                <div style="text-align:center;margin-bottom:20px;">
                    <strong>Código:</strong> ${p.codigo} | <strong>Versão:</strong> ${p.versao} | <strong>Data:</strong> ${Utils.formatDate(p.criadoEm)}
                </div>
                <p><strong>Cliente:</strong> ${Utils.getClienteNome(p.clienteId)}</p>
                <p><strong>Responsável:</strong> ${p.responsavel}</p>

                <h2>1. OBJETIVO</h2>
                <p>${p.objetivo}</p>

                <h2>2. PROCEDIMENTO</h2>
                <p style="white-space:pre-line;">${p.procedimento}</p>

                <h2>3. FREQUÊNCIA</h2>
                <p>${p.frequencia}</p>

                <h2>4. RESPONSABILIDADES</h2>
                <p>Este procedimento deve ser executado por pessoal treinado e capacitado, sob a responsabilidade de ${p.responsavel}.</p>

                <h2>5. REFERÊNCIAS NORMATIVAS</h2>
                <p>RDC nº 216/2004 ANVISA - Boas Práticas para Serviços de Alimentação</p>
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.printElement('popContent')">🖨 Imprimir</button>`,
            'large'
        );
    },

    useTemplate() {
        const templates = [
            { titulo: 'POP - Higienização das Mãos', objetivo: 'Estabelecer procedimentos para higienização correta das mãos', procedimento: '1. Molhar as mãos com água corrente\n2. Aplicar sabonete líquido antisséptico\n3. Ensaboar por 20 segundos\n4. Enxaguar com água corrente\n5. Secar com papel toalha\n6. Aplicar álcool 70%', frequencia: 'Antes do manuseio de alimentos' },
            { titulo: 'POP - Recebimento de Mercadorias', objetivo: 'Garantir qualidade no recebimento', procedimento: '1. Conferir nota fiscal\n2. Verificar temperatura\n3. Inspecionar embalagens\n4. Verificar prazos de validade\n5. Avaliar características sensoriais\n6. Registrar recebimento', frequencia: 'A cada recebimento' },
            { titulo: 'POP - Controle de Pragas', objetivo: 'Prevenir e controlar pragas urbanas', procedimento: '1. Inspeção periódica\n2. Vedação de aberturas\n3. Manutenção da limpeza\n4. Armazenamento correto\n5. Aplicação profissional trimestral\n6. Registro de ocorrências', frequencia: 'Trimestral' },
            { titulo: 'POP - Manipulação de Alimentos', objetivo: 'Garantir manipulação segura', procedimento: '1. Higienização prévia\n2. Uso de EPIs\n3. Separação de cruds e cozidos\n4. Controle de temperatura\n5. Uso de utensílios adequados\n6. Descarte apropriado', frequencia: 'Contínua' }
        ];

        Utils.showModal(
            'Modelos de POP',
            `
            <p style="margin-bottom:16px;color:#6b7280;">Selecione um modelo para começar:</p>
            <div class="cards-grid">
                ${templates.map((t, i) => `
                    <div class="item-card" onclick="POPsModule.loadTemplate(${i})">
                        <div class="item-card-title">${t.titulo}</div>
                        <div class="item-card-body">${t.objetivo}</div>
                    </div>
                `).join('')}
            </div>
            <script>
                window.__popTemplates = ${JSON.stringify(templates)};
            </script>
            `,
            '',
            'large'
        );
    },

    loadTemplate(index) {
        const t = window.__popTemplates[index];
        Utils.closeModal();
        setTimeout(() => {
            this.showForm();
            setTimeout(() => {
                const form = document.getElementById('popForm');
                form.titulo.value = t.titulo;
                form.objetivo.value = t.objetivo;
                form.procedimento.value = t.procedimento;
                form.frequencia.value = t.frequencia;
            }, 100);
        }, 200);
    },

    remove(id) {
        Utils.confirm('Excluir POP?', () => {
            DB.delete('pops', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('pops');
        });
    }
};
