// ========== MÓDULO EQUIPE ==========
const EquipeModule = {
    render() {
        const equipe = DB.getAll('equipe');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Equipe</h1>
                    <p>Gerencie consultores e profissionais</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="EquipeModule.showForm()">+ Novo Membro</button>
                </div>
            </div>
            <div class="cards-grid">
                ${equipe.map(m => `
                    <div class="item-card">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                            <div class="user-avatar" style="width:48px;height:48px;font-size:16px;">${m.nome.substring(0,2).toUpperCase()}</div>
                            <div>
                                <div class="item-card-title">${m.nome}</div>
                                <div class="item-card-subtitle">${m.cargo}</div>
                            </div>
                        </div>
                        <div class="item-card-body">
                            <div>📧 ${m.email}</div>
                            <div>📞 ${m.telefone}</div>
                            <div>🎯 ${m.especialidade}</div>
                        </div>
                        <div class="item-card-footer">
                            ${Utils.statusBadge(m.status)}
                            <div>
                                <button class="btn-icon" onclick="EquipeModule.showForm(${m.id})">✎</button>
                                <button class="btn-icon" onclick="EquipeModule.remove(${m.id})">🗑</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showForm(id = null) {
        const m = id ? DB.getById('equipe', id) : { nome: '', cargo: '', email: '', telefone: '', especialidade: '', status: 'ativo' };
        Utils.showModal(
            id ? 'Editar Membro' : 'Novo Membro',
            `
            <form id="equipeForm" onsubmit="EquipeModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Nome *</label><input type="text" name="nome" value="${m.nome}" required></div>
                    <div class="form-group">
                        <label>Cargo</label>
                        <select name="cargo">
                            <option>Consultor Sênior</option>
                            <option ${m.cargo === 'Nutricionista' ? 'selected' : ''}>Nutricionista</option>
                            <option ${m.cargo === 'Consultor Técnico' ? 'selected' : ''}>Consultor Técnico</option>
                            <option ${m.cargo === 'Auditor' ? 'selected' : ''}>Auditor</option>
                            <option ${m.cargo === 'Estagiário' ? 'selected' : ''}>Estagiário</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>E-mail</label><input type="email" name="email" value="${m.email}"></div>
                    <div class="form-group"><label>Telefone</label><input type="text" name="telefone" value="${m.telefone}"></div>
                </div>
                <div class="form-group"><label>Especialidade</label><input type="text" name="especialidade" value="${m.especialidade}"></div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="ativo" ${m.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="inativo" ${m.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                    </select>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('equipeForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('equipe', {
            id: id || null,
            nome: f.nome.value, cargo: f.cargo.value, email: f.email.value,
            telefone: f.telefone.value, especialidade: f.especialidade.value, status: f.status.value
        });
        Utils.closeModal();
        Utils.showToast('Salvo!', 'success');
        App.renderPage('equipe');
    },

    remove(id) {
        Utils.confirm('Excluir membro?', () => {
            DB.delete('equipe', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('equipe');
        });
    }
};
