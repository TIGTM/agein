// ========== MÓDULO CHECKLISTS ==========
const ChecklistsModule = {
    currentTab: 'aplicados',

    render() {
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Checklists</h1>
                    <p>Aplique e gerencie checklists de auditoria</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-secondary" onclick="ChecklistsModule.showNewChecklist()">+ Novo Modelo</button>
                    <button class="btn btn-primary" onclick="ChecklistsModule.showApply()">✓ Aplicar Checklist</button>
                </div>
            </div>

            <div class="tabs">
                <button class="tab ${this.currentTab === 'aplicados' ? 'active' : ''}" onclick="ChecklistsModule.switchTab('aplicados')">Aplicados</button>
                <button class="tab ${this.currentTab === 'modelos' ? 'active' : ''}" onclick="ChecklistsModule.switchTab('modelos')">Modelos</button>
            </div>

            <div id="checklistsContent">
                ${this.currentTab === 'aplicados' ? this.renderAplicados() : this.renderModelos()}
            </div>
        `;
    },

    switchTab(tab) {
        this.currentTab = tab;
        App.renderPage('checklists');
    },

    renderAplicados() {
        const aplicados = DB.getAll('checklistsAplicados');
        const modelos = DB.getAll('checklists');
        return `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Checklist</th>
                            <th>Cliente</th>
                            <th>Consultor</th>
                            <th>Conformidade</th>
                            <th>Status</th>
                            <th style="width:150px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${aplicados.map(a => {
                            const modelo = modelos.find(m => m.id === a.checklistId);
                            return `
                                <tr>
                                    <td>${Utils.formatDate(a.data)}</td>
                                    <td><strong>${modelo ? modelo.nome : 'N/A'}</strong></td>
                                    <td>${Utils.getClienteNome(a.clienteId)}</td>
                                    <td>${a.consultor}</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px;">
                                            <div class="progress" style="width:80px;"><div class="progress-bar" style="width:${a.conformidade}%;"></div></div>
                                            <strong>${a.conformidade}%</strong>
                                        </div>
                                    </td>
                                    <td>${Utils.statusBadge(a.status)}</td>
                                    <td>
                                        <button class="btn-icon" onclick="ChecklistsModule.viewReport(${a.id})" title="Relatório">📄</button>
                                        <button class="btn-icon" onclick="ChecklistsModule.remove(${a.id})" title="Excluir">🗑</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;">Nenhum checklist aplicado</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderModelos() {
        const modelos = DB.getAll('checklists');
        return `
            <div class="cards-grid">
                ${modelos.map(m => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${m.nome}</div>
                                <div class="item-card-subtitle">${m.categoria}</div>
                            </div>
                            <span style="font-size:24px;">✅</span>
                        </div>
                        <div class="item-card-body">${m.descricao}</div>
                        <div class="item-card-footer">
                            <small>${m.itens ? m.itens.reduce((acc, c) => acc + c.itens.length, 0) : 0} perguntas</small>
                            <div>
                                <button class="btn btn-sm btn-primary" onclick="ChecklistsModule.showApply(${m.id})">Aplicar</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showApply(checklistId = null) {
        const modelos = DB.getAll('checklists');
        const clientes = DB.getAll('clientes').filter(c => c.status === 'ativo');
        const equipe = DB.getAll('equipe').filter(e => e.status === 'ativo');

        Utils.showModal(
            'Aplicar Checklist',
            `
            <form id="applyForm" onsubmit="ChecklistsModule.startApplication(event)">
                <div class="form-group">
                    <label>Checklist *</label>
                    <select name="checklistId" required onchange="ChecklistsModule.loadChecklistItems(this.value)">
                        <option value="">Selecione</option>
                        ${modelos.map(m => `<option value="${m.id}" ${m.id === checklistId ? 'selected' : ''}>${m.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Consultor</label>
                        <select name="consultor">
                            ${equipe.map(e => `<option>${e.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Data</label>
                    <input type="date" name="data" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div id="checklistItems"></div>
                <div class="form-group">
                    <label>Observações Gerais</label>
                    <textarea name="observacoes" rows="3"></textarea>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('applyForm').requestSubmit()">Finalizar e Salvar</button>`,
            'large'
        );

        if (checklistId) {
            setTimeout(() => this.loadChecklistItems(checklistId), 50);
        }
    },

    loadChecklistItems(checklistId) {
        const modelo = DB.getById('checklists', checklistId);
        const container = document.getElementById('checklistItems');
        if (!modelo || !modelo.itens) return;

        container.innerHTML = `
            <div class="info-box">Marque cada item conforme sua observação: <strong>C</strong> (Conforme), <strong>NC</strong> (Não Conforme), <strong>NA</strong> (Não se Aplica)</div>
            ${modelo.itens.map(cat => `
                <div class="checklist-category">${cat.categoria}</div>
                ${cat.itens.map(item => `
                    <div class="checklist-item">
                        <div class="checklist-question">${item.pergunta}</div>
                        <div class="checklist-options">
                            <button type="button" class="option-btn" onclick="ChecklistsModule.selectOption(this, 'conforme')">C</button>
                            <button type="button" class="option-btn" onclick="ChecklistsModule.selectOption(this, 'nao-conforme')">NC</button>
                            <button type="button" class="option-btn" onclick="ChecklistsModule.selectOption(this, 'nao-aplica')">NA</button>
                        </div>
                    </div>
                `).join('')}
            `).join('')}
        `;
    },

    selectOption(btn, type) {
        const parent = btn.parentElement;
        parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active', 'conforme', 'nao-conforme', 'nao-aplica'));
        btn.classList.add('active', type);
    },

    startApplication(event) {
        event.preventDefault();
        const form = event.target;
        const items = document.querySelectorAll('.checklist-item');
        let conformes = 0, naoConformes = 0, aplicaveis = 0;

        items.forEach(item => {
            const active = item.querySelector('.option-btn.active');
            if (active) {
                if (active.classList.contains('conforme')) { conformes++; aplicaveis++; }
                else if (active.classList.contains('nao-conforme')) { naoConformes++; aplicaveis++; }
            }
        });

        const conformidade = aplicaveis > 0 ? Math.round((conformes / aplicaveis) * 100) : 0;

        DB.save('checklistsAplicados', {
            id: null,
            checklistId: parseInt(form.checklistId.value),
            clienteId: parseInt(form.clienteId.value),
            data: form.data.value,
            consultor: form.consultor.value,
            conformidade: conformidade,
            status: 'concluido',
            observacoes: form.observacoes.value,
            conformes: conformes,
            naoConformes: naoConformes,
            aplicaveis: aplicaveis
        });

        Utils.closeModal();
        Utils.showToast(`Checklist finalizado! Conformidade: ${conformidade}%`, 'success');
        App.renderPage('checklists');
    },

    viewReport(id) {
        const a = DB.getById('checklistsAplicados', id);
        const modelo = DB.getById('checklists', a.checklistId);
        Utils.showModal(
            'Relatório de Checklist',
            `
            <div id="reportContent">
                <h2 style="color:#0054e9;margin-bottom:16px;">${modelo ? modelo.nome : 'N/A'}</h2>
                <div class="form-row">
                    <div><strong>Cliente:</strong><br>${Utils.getClienteNome(a.clienteId)}</div>
                    <div><strong>Data:</strong><br>${Utils.formatDate(a.data)}</div>
                </div>
                <br>
                <div class="form-row">
                    <div><strong>Consultor:</strong><br>${a.consultor}</div>
                    <div><strong>Status:</strong><br>${Utils.statusBadge(a.status)}</div>
                </div>
                <br>
                <div class="info-box ${a.conformidade >= 80 ? 'success' : a.conformidade >= 60 ? 'warning' : 'danger'}">
                    <h3 style="font-size:32px;margin:0;">${a.conformidade}%</h3>
                    <p>Conformidade</p>
                </div>
                <br>
                ${a.conformes !== undefined ? `
                    <div class="form-row three">
                        <div class="card" style="text-align:center;"><h3 style="color:#2dd55b;">${a.conformes}</h3><small>Conformes</small></div>
                        <div class="card" style="text-align:center;"><h3 style="color:#c5000f;">${a.naoConformes}</h3><small>Não Conformes</small></div>
                        <div class="card" style="text-align:center;"><h3>${a.aplicaveis}</h3><small>Aplicáveis</small></div>
                    </div>
                    <br>
                ` : ''}
                ${a.observacoes ? `<div><strong>Observações:</strong><p>${a.observacoes}</p></div>` : ''}
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.printElement('reportContent')">🖨 Imprimir</button>`,
            'large'
        );
    },

    showNewChecklist() {
        Utils.showModal(
            'Novo Checklist',
            `
            <form id="newChecklistForm" onsubmit="ChecklistsModule.saveNewChecklist(event)">
                <div class="form-group"><label>Nome *</label><input type="text" name="nome" required></div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoria</label>
                        <select name="categoria">
                            <option>Segurança Alimentar</option>
                            <option>Controle de Qualidade</option>
                            <option>Limpeza</option>
                            <option>Controle de Riscos</option>
                            <option>Armazenamento</option>
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>Descrição</label><textarea name="descricao" rows="3"></textarea></div>
                <div class="info-box">Após salvar, você poderá adicionar itens ao checklist.</div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('newChecklistForm').requestSubmit()">Salvar</button>`
        );
    },

    saveNewChecklist(event) {
        event.preventDefault();
        const f = event.target;
        DB.save('checklists', {
            id: null,
            nome: f.nome.value, categoria: f.categoria.value, descricao: f.descricao.value,
            itens: [], criadoEm: new Date().toISOString().split('T')[0]
        });
        Utils.closeModal();
        Utils.showToast('Checklist criado!', 'success');
        App.renderPage('checklists');
    },

    remove(id) {
        Utils.confirm('Excluir checklist aplicado?', () => {
            DB.delete('checklistsAplicados', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('checklists');
        });
    }
};
