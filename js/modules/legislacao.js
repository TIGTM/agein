// ========== MÓDULO LEGISLAÇÃO ==========
const LegislacaoModule = {
    filter: '',

    render() {
        const legislacoes = DB.getAll('legislacoes').filter(l =>
            !this.filter ||
            l.titulo.toLowerCase().includes(this.filter.toLowerCase()) ||
            l.assunto.toLowerCase().includes(this.filter.toLowerCase())
        );
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Acervo de Legislações</h1>
                    <p>Base de legislações sobre alimentos no Brasil</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="LegislacaoModule.showForm()">+ Nova Legislação</button>
                </div>
            </div>

            <div class="info-box">
                <strong>📚 Base Legal:</strong> Principais legislações sanitárias e de alimentos vigentes no Brasil, atualizadas periodicamente pela equipe Agein.
            </div>

            <div class="table-container">
                <div class="table-filters">
                    <input type="text" placeholder="Buscar legislação..." value="${this.filter}" onkeyup="LegislacaoModule.filter = this.value; App.renderPage('legislacao');" style="flex:1;">
                    <span style="color:#6b7280;font-size:13px;">${legislacoes.length} legislação(ões)</span>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Órgão</th>
                            <th>Data</th>
                            <th>Assunto</th>
                            <th>Escopo</th>
                            <th style="width:120px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${legislacoes.map(l => `
                            <tr>
                                <td><strong>${l.titulo}</strong></td>
                                <td>${l.orgao}</td>
                                <td>${Utils.formatDate(l.data)}</td>
                                <td>${l.assunto}</td>
                                <td><span class="status-badge status-completed">${l.escopo}</span></td>
                                <td>
                                    <button class="btn-icon" onclick="LegislacaoModule.view(${l.id})" title="Ver">👁</button>
                                    <button class="btn-icon" onclick="LegislacaoModule.showForm(${l.id})" title="Editar">✎</button>
                                    <button class="btn-icon" onclick="LegislacaoModule.remove(${l.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="6" style="text-align:center;padding:40px;color:#9ca3af;">Nenhuma legislação encontrada</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    showForm(id = null) {
        const l = id ? DB.getById('legislacoes', id) : { titulo: '', orgao: 'ANVISA', data: '', assunto: '', descricao: '', escopo: 'Federal' };

        Utils.showModal(
            id ? 'Editar Legislação' : 'Nova Legislação',
            `
            <form id="legForm" onsubmit="LegislacaoModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Título *</label><input type="text" name="titulo" value="${l.titulo}" required placeholder="Ex: RDC nº 216/2004"></div>
                    <div class="form-group">
                        <label>Órgão</label>
                        <select name="orgao">
                            <option ${l.orgao==='ANVISA'?'selected':''}>ANVISA</option>
                            <option ${l.orgao==='MAPA'?'selected':''}>MAPA</option>
                            <option ${l.orgao==='CVS-SP'?'selected':''}>CVS-SP</option>
                            <option ${l.orgao==='Governo Federal'?'selected':''}>Governo Federal</option>
                            <option ${l.orgao==='Ministério da Saúde'?'selected':''}>Ministério da Saúde</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Data</label><input type="date" name="data" value="${l.data}"></div>
                    <div class="form-group">
                        <label>Escopo</label>
                        <select name="escopo">
                            <option ${l.escopo==='Federal'?'selected':''}>Federal</option>
                            <option ${l.escopo==='Estadual (SP)'?'selected':''}>Estadual (SP)</option>
                            <option ${l.escopo==='Estadual (RJ)'?'selected':''}>Estadual (RJ)</option>
                            <option ${l.escopo==='Estadual (MG)'?'selected':''}>Estadual (MG)</option>
                            <option ${l.escopo==='Municipal'?'selected':''}>Municipal</option>
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>Assunto *</label><input type="text" name="assunto" value="${l.assunto}" required></div>
                <div class="form-group"><label>Descrição</label><textarea name="descricao" rows="4">${l.descricao}</textarea></div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('legForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('legislacoes', {
            id: id || null,
            titulo: f.titulo.value, orgao: f.orgao.value, data: f.data.value,
            assunto: f.assunto.value, descricao: f.descricao.value, escopo: f.escopo.value
        });
        Utils.closeModal();
        Utils.showToast('Legislação salva!', 'success');
        App.renderPage('legislacao');
    },

    view(id) {
        const l = DB.getById('legislacoes', id);
        Utils.showModal(
            l.titulo,
            `
            <div class="form-row">
                <div><strong>Órgão:</strong><br>${l.orgao}</div>
                <div><strong>Data:</strong><br>${Utils.formatDate(l.data)}</div>
            </div>
            <br>
            <div><strong>Escopo:</strong> <span class="status-badge status-completed">${l.escopo}</span></div>
            <br>
            <div><strong>Assunto:</strong><br>${l.assunto}</div>
            <br>
            <div><strong>Descrição:</strong><br>${l.descricao}</div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>`
        );
    },

    remove(id) {
        Utils.confirm('Excluir legislação?', () => {
            DB.delete('legislacoes', id);
            Utils.showToast('Excluída!', 'success');
            App.renderPage('legislacao');
        });
    }
};
