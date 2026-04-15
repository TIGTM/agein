// ========== MÓDULO PLANOS DE AÇÃO ==========
const PlanosModule = {
    render() {
        const planos = DB.getAll('planos');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Planos de Ação</h1>
                    <p>Gerencie ações corretivas e preventivas</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="PlanosModule.showForm()">+ Novo Plano</button>
                </div>
            </div>
            <div class="cards-grid">
                ${planos.map(p => {
                    const concluidas = p.acoes.filter(a => a.status === 'concluido').length;
                    const total = p.acoes.length;
                    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
                    return `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${p.titulo}</div>
                                <div class="item-card-subtitle">${Utils.getClienteNome(p.clienteId)}</div>
                            </div>
                            <span style="font-size:24px;">🎯</span>
                        </div>
                        <div class="item-card-body">
                            <div><strong>Responsável:</strong> ${p.responsavel}</div>
                            <div><strong>Prazo:</strong> ${Utils.formatDate(p.prazo)}</div>
                            <div style="margin-top:8px;">
                                <small>Progresso: ${concluidas}/${total} ações</small>
                                <div class="progress" style="margin-top:4px;"><div class="progress-bar" style="width:${pct}%;"></div></div>
                            </div>
                        </div>
                        <div class="item-card-footer">
                            ${Utils.statusBadge(p.status)}
                            <div>
                                <button class="btn-icon" onclick="PlanosModule.view(${p.id})" title="Ver">👁</button>
                                <button class="btn-icon" onclick="PlanosModule.showForm(${p.id})" title="Editar">✎</button>
                                <button class="btn-icon" onclick="PlanosModule.remove(${p.id})" title="Excluir">🗑</button>
                            </div>
                        </div>
                    </div>
                `}).join('') || '<div class="empty-state"><div class="empty-state-icon">🎯</div><h3>Nenhum plano de ação</h3></div>'}
            </div>
        `;
    },

    showForm(id = null) {
        const p = id ? DB.getById('planos', id) : { clienteId: '', titulo: '', data: new Date().toISOString().split('T')[0], responsavel: '', prazo: '', status: 'em_andamento', acoes: [{descricao:'', responsavel:'', prazo:'', status:'pendente'}] };
        const clientes = DB.getAll('clientes');
        window.__currentPlano = p;

        Utils.showModal(
            id ? 'Editar Plano' : 'Novo Plano de Ação',
            `
            <form id="planoForm" onsubmit="PlanosModule.save(event, ${id})">
                <div class="form-group"><label>Título *</label><input type="text" name="titulo" value="${p.titulo}" required></div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === p.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Responsável</label><input type="text" name="responsavel" value="${p.responsavel}"></div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Data</label><input type="date" name="data" value="${p.data}"></div>
                    <div class="form-group"><label>Prazo Final</label><input type="date" name="prazo" value="${p.prazo}"></div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="em_andamento" ${p.status==='em_andamento'?'selected':''}>Em Andamento</option>
                            <option value="concluido" ${p.status==='concluido'?'selected':''}>Concluído</option>
                            <option value="pendente" ${p.status==='pendente'?'selected':''}>Pendente</option>
                        </select>
                    </div>
                </div>
                <h3 style="margin-top:20px;color:#0054e9;">Ações</h3>
                <div id="acoesList">${p.acoes.map((a, i) => this.renderAcao(a, i)).join('')}</div>
                <button type="button" class="btn btn-sm btn-secondary" onclick="PlanosModule.addAcao()">+ Nova Ação</button>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('planoForm').requestSubmit()">Salvar</button>`,
            'large'
        );
    },

    renderAcao(a, i) {
        return `
            <div class="card" style="margin-bottom:8px;padding:12px;" data-index="${i}">
                <div class="form-row">
                    <div class="form-group">
                        <label>Descrição da Ação</label>
                        <input type="text" value="${a.descricao}" onchange="PlanosModule.updateAcao(${i}, 'descricao', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Responsável</label>
                        <input type="text" value="${a.responsavel}" onchange="PlanosModule.updateAcao(${i}, 'responsavel', this.value)">
                    </div>
                </div>
                <div class="form-row three">
                    <div class="form-group">
                        <label>Prazo</label>
                        <input type="date" value="${a.prazo}" onchange="PlanosModule.updateAcao(${i}, 'prazo', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select onchange="PlanosModule.updateAcao(${i}, 'status', this.value)">
                            <option value="pendente" ${a.status==='pendente'?'selected':''}>Pendente</option>
                            <option value="em_andamento" ${a.status==='em_andamento'?'selected':''}>Em Andamento</option>
                            <option value="concluido" ${a.status==='concluido'?'selected':''}>Concluído</option>
                        </select>
                    </div>
                    <div class="form-group" style="display:flex;align-items:flex-end;">
                        <button type="button" class="btn btn-sm btn-danger" onclick="PlanosModule.removeAcao(${i})">Remover</button>
                    </div>
                </div>
            </div>
        `;
    },

    updateAcao(i, field, value) {
        window.__currentPlano.acoes[i][field] = value;
    },

    addAcao() {
        window.__currentPlano.acoes.push({descricao:'', responsavel:'', prazo:'', status:'pendente'});
        document.getElementById('acoesList').innerHTML = window.__currentPlano.acoes.map((a, i) => this.renderAcao(a, i)).join('');
    },

    removeAcao(i) {
        window.__currentPlano.acoes.splice(i, 1);
        document.getElementById('acoesList').innerHTML = window.__currentPlano.acoes.map((a, i) => this.renderAcao(a, i)).join('');
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('planos', {
            id: id || null,
            titulo: f.titulo.value, clienteId: parseInt(f.clienteId.value),
            data: f.data.value, responsavel: f.responsavel.value,
            prazo: f.prazo.value, status: f.status.value,
            acoes: window.__currentPlano.acoes.filter(a => a.descricao)
        });
        Utils.closeModal();
        Utils.showToast('Plano salvo!', 'success');
        App.renderPage('planos');
    },

    view(id) {
        const p = DB.getById('planos', id);
        Utils.showModal(
            p.titulo,
            `
            <div id="planoContent">
                <p><strong>Cliente:</strong> ${Utils.getClienteNome(p.clienteId)}</p>
                <p><strong>Responsável:</strong> ${p.responsavel}</p>
                <p><strong>Data:</strong> ${Utils.formatDate(p.data)} | <strong>Prazo:</strong> ${Utils.formatDate(p.prazo)}</p>
                <p><strong>Status:</strong> ${Utils.statusBadge(p.status)}</p>
                <br>
                <h3 style="color:#0054e9;">Ações</h3>
                <table class="data-table">
                    <thead><tr><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead>
                    <tbody>
                        ${p.acoes.map(a => `
                            <tr>
                                <td>${a.descricao}</td>
                                <td>${a.responsavel}</td>
                                <td>${Utils.formatDate(a.prazo)}</td>
                                <td>${Utils.statusBadge(a.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.printElement('planoContent')">🖨 Imprimir</button>`,
            'large'
        );
    },

    remove(id) {
        Utils.confirm('Excluir plano?', () => {
            DB.delete('planos', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('planos');
        });
    }
};
