// ========== MÓDULO TREINAMENTOS ==========
const TreinamentosModule = {
    render() {
        const treinamentos = DB.getAll('treinamentos');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Treinamentos</h1>
                    <p>Capacite equipes de manipuladores</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="TreinamentosModule.showForm()">+ Novo Treinamento</button>
                </div>
            </div>
            <div class="cards-grid">
                ${treinamentos.map(t => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${t.titulo}</div>
                                <div class="item-card-subtitle">${Utils.getClienteNome(t.clienteId)}</div>
                            </div>
                            <span style="font-size:24px;">🎓</span>
                        </div>
                        <div class="item-card-body">
                            <div>📅 ${Utils.formatDate(t.data)}</div>
                            <div>⏱️ ${t.cargaHoraria}h de carga horária</div>
                            <div>👥 ${t.participantes} participantes</div>
                            <div>🎓 ${t.instrutor}</div>
                            ${t.descricao ? `<div style="margin-top:8px;font-size:12px;color:#6b7280;">${t.descricao}</div>` : ''}
                        </div>
                        <div class="item-card-footer">
                            ${Utils.statusBadge(t.status)}
                            <div>
                                <button class="btn-icon" onclick="TreinamentosModule.showForm(${t.id})" title="Editar">✎</button>
                                <button class="btn-icon" onclick="TreinamentosModule.remove(${t.id})" title="Excluir">🗑</button>
                            </div>
                        </div>
                    </div>
                `).join('') || '<div class="empty-state"><div class="empty-state-icon">🎓</div><h3>Nenhum treinamento</h3></div>'}
            </div>
        `;
    },

    showForm(id = null) {
        const t = id ? DB.getById('treinamentos', id) : { titulo: '', clienteId: '', instrutor: '', data: new Date().toISOString().split('T')[0], cargaHoraria: 4, participantes: 0, status: 'agendado', descricao: '' };
        const clientes = DB.getAll('clientes');
        const equipe = DB.getAll('equipe');

        Utils.showModal(
            id ? 'Editar Treinamento' : 'Novo Treinamento',
            `
            <form id="treinForm" onsubmit="TreinamentosModule.save(event, ${id})">
                <div class="form-group"><label>Título *</label><input type="text" name="titulo" value="${t.titulo}" required></div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === t.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Instrutor *</label>
                        <select name="instrutor" required>
                            ${equipe.map(e => `<option ${e.nome === t.instrutor ? 'selected' : ''}>${e.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Data</label><input type="date" name="data" value="${t.data}"></div>
                    <div class="form-group"><label>Carga Horária</label><input type="number" name="cargaHoraria" value="${t.cargaHoraria}"></div>
                    <div class="form-group"><label>Participantes</label><input type="number" name="participantes" value="${t.participantes}"></div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="agendado" ${t.status==='agendado'?'selected':''}>Agendado</option>
                        <option value="realizado" ${t.status==='realizado'?'selected':''}>Realizado</option>
                        <option value="cancelado" ${t.status==='cancelado'?'selected':''}>Cancelado</option>
                    </select>
                </div>
                <div class="form-group"><label>Descrição</label><textarea name="descricao" rows="3">${t.descricao}</textarea></div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('treinForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('treinamentos', {
            id: id || null,
            titulo: f.titulo.value, clienteId: parseInt(f.clienteId.value),
            instrutor: f.instrutor.value, data: f.data.value,
            cargaHoraria: parseInt(f.cargaHoraria.value), participantes: parseInt(f.participantes.value),
            status: f.status.value, descricao: f.descricao.value
        });
        Utils.closeModal();
        Utils.showToast('Treinamento salvo!', 'success');
        App.renderPage('treinamentos');
    },

    remove(id) {
        Utils.confirm('Excluir treinamento?', () => {
            DB.delete('treinamentos', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('treinamentos');
        });
    }
};
