// ========== MÓDULO CLIENTES ==========
const ClientesModule = {
    filter: '',

    render() {
        const clientes = DB.getAll('clientes').filter(c =>
            !this.filter || c.nome.toLowerCase().includes(this.filter.toLowerCase())
        );

        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Clientes</h1>
                    <p>Gerencie todos os seus clientes</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="ClientesModule.showForm()">+ Novo Cliente</button>
                </div>
            </div>

            <div class="table-container">
                <div class="table-filters">
                    <input type="text" placeholder="Buscar cliente..." value="${this.filter}" onkeyup="ClientesModule.filter = this.value; App.renderPage('clientes');" style="flex:1;max-width:300px;">
                    <select onchange="ClientesModule.filterByStatus(this.value)">
                        <option value="">Todos os status</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                    </select>
                    <span style="margin-left:auto;color:#6b7280;font-size:13px;">${clientes.length} cliente(s)</span>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Tipo</th>
                            <th>Responsável</th>
                            <th>Telefone</th>
                            <th>Status</th>
                            <th style="width:120px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${clientes.map(c => `
                            <tr>
                                <td><strong>${c.nome}</strong><br><small style="color:#6b7280;">${c.email || ''}</small></td>
                                <td>${c.cnpj}</td>
                                <td>${c.tipo}</td>
                                <td>${c.responsavel}</td>
                                <td>${c.telefone}</td>
                                <td>${Utils.statusBadge(c.status)}</td>
                                <td>
                                    <button class="btn-icon" onclick="ClientesModule.view(${c.id})" title="Visualizar">👁</button>
                                    <button class="btn-icon" onclick="ClientesModule.showForm(${c.id})" title="Editar">✎</button>
                                    <button class="btn-icon" onclick="ClientesModule.remove(${c.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;">Nenhum cliente encontrado</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    filterByStatus(status) {
        const clientes = DB.getAll('clientes');
        const filtered = status ? clientes.filter(c => c.status === status) : clientes;
        // Re-render tabela
        App.renderPage('clientes');
    },

    showForm(id = null) {
        const cliente = id ? DB.getById('clientes', id) : { nome: '', cnpj: '', tipo: '', responsavel: '', telefone: '', email: '', endereco: '', status: 'ativo' };
        Utils.showModal(
            id ? 'Editar Cliente' : 'Novo Cliente',
            `
            <form id="clienteForm" onsubmit="ClientesModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome *</label>
                        <input type="text" name="nome" value="${cliente.nome}" required>
                    </div>
                    <div class="form-group">
                        <label>CNPJ *</label>
                        <input type="text" name="cnpj" value="${cliente.cnpj}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo *</label>
                        <select name="tipo" required>
                            <option value="">Selecione</option>
                            <option ${cliente.tipo === 'Restaurante' ? 'selected' : ''}>Restaurante</option>
                            <option ${cliente.tipo === 'Padaria' ? 'selected' : ''}>Padaria</option>
                            <option ${cliente.tipo === 'Lanchonete' ? 'selected' : ''}>Lanchonete</option>
                            <option ${cliente.tipo === 'Cafeteria' ? 'selected' : ''}>Cafeteria</option>
                            <option ${cliente.tipo === 'Indústria' ? 'selected' : ''}>Indústria</option>
                            <option ${cliente.tipo === 'Supermercado' ? 'selected' : ''}>Supermercado</option>
                            <option ${cliente.tipo === 'Outro' ? 'selected' : ''}>Outro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="ativo" ${cliente.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                            <option value="inativo" ${cliente.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Responsável *</label>
                        <input type="text" name="responsavel" value="${cliente.responsavel}" required>
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value="${cliente.telefone}">
                    </div>
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" name="email" value="${cliente.email}">
                </div>
                <div class="form-group">
                    <label>Endereço</label>
                    <input type="text" name="endereco" value="${cliente.endereco}">
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('clienteForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const form = event.target;
        const data = {
            id: id || null,
            nome: form.nome.value,
            cnpj: form.cnpj.value,
            tipo: form.tipo.value,
            responsavel: form.responsavel.value,
            telefone: form.telefone.value,
            email: form.email.value,
            endereco: form.endereco.value,
            status: form.status.value,
            criadoEm: id ? DB.getById('clientes', id).criadoEm : new Date().toISOString().split('T')[0]
        };
        DB.save('clientes', data);
        Utils.closeModal();
        Utils.showToast(id ? 'Cliente atualizado!' : 'Cliente cadastrado!', 'success');
        App.renderPage('clientes');
    },

    view(id) {
        const c = DB.getById('clientes', id);
        if (!c) return;
        const visitas = DB.getAll('visitas').filter(v => v.clienteId === id);
        const pops = DB.getAll('pops').filter(p => p.clienteId === id);
        const docs = DB.getAll('documentacao').filter(d => d.clienteId === id);

        Utils.showModal(
            c.nome,
            `
            <div class="tabs">
                <button class="tab active" onclick="ClientesModule.switchTab(event, 'info')">Informações</button>
                <button class="tab" onclick="ClientesModule.switchTab(event, 'visitas')">Visitas (${visitas.length})</button>
                <button class="tab" onclick="ClientesModule.switchTab(event, 'pops')">POPs (${pops.length})</button>
                <button class="tab" onclick="ClientesModule.switchTab(event, 'docs')">Docs (${docs.length})</button>
            </div>
            <div id="tab-info">
                <div class="form-row">
                    <div><strong>CNPJ:</strong><br>${c.cnpj}</div>
                    <div><strong>Tipo:</strong><br>${c.tipo}</div>
                </div>
                <br>
                <div class="form-row">
                    <div><strong>Responsável:</strong><br>${c.responsavel}</div>
                    <div><strong>Status:</strong><br>${Utils.statusBadge(c.status)}</div>
                </div>
                <br>
                <div><strong>Telefone:</strong> ${c.telefone}</div>
                <div><strong>E-mail:</strong> ${c.email}</div>
                <div><strong>Endereço:</strong> ${c.endereco}</div>
                <div><strong>Cliente desde:</strong> ${Utils.formatDate(c.criadoEm)}</div>
            </div>
            <div id="tab-visitas" class="hidden">
                ${visitas.map(v => `
                    <div class="item-card" style="margin-bottom:8px;">
                        <strong>${v.tipo}</strong> - ${Utils.formatDate(v.data)} às ${v.horario}
                        <br><small>${v.objetivo}</small>
                        <br>${Utils.statusBadge(v.status)}
                    </div>
                `).join('') || '<p style="color:#9ca3af;text-align:center;padding:20px;">Sem visitas</p>'}
            </div>
            <div id="tab-pops" class="hidden">
                ${pops.map(p => `
                    <div class="item-card" style="margin-bottom:8px;">
                        <strong>${p.titulo}</strong> (${p.codigo})
                        <br><small>${p.objetivo}</small>
                    </div>
                `).join('') || '<p style="color:#9ca3af;text-align:center;padding:20px;">Sem POPs</p>'}
            </div>
            <div id="tab-docs" class="hidden">
                ${docs.map(d => `
                    <div class="item-card" style="margin-bottom:8px;">
                        <strong>${d.nome}</strong>
                        <br><small>Vence em ${Utils.formatDate(d.vencimento)}</small>
                        <br>${Utils.statusBadge(d.status)}
                    </div>
                `).join('') || '<p style="color:#9ca3af;text-align:center;padding:20px;">Sem documentos</p>'}
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.closeModal(); ClientesModule.showForm(${id})">Editar</button>`,
            'large'
        );
    },

    switchTab(event, tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        ['info', 'visitas', 'pops', 'docs'].forEach(t => {
            document.getElementById(`tab-${t}`).classList.toggle('hidden', t !== tab);
        });
    },

    remove(id) {
        Utils.confirm('Tem certeza que deseja excluir este cliente?', () => {
            DB.delete('clientes', id);
            Utils.showToast('Cliente excluído!', 'success');
            App.renderPage('clientes');
        });
    }
};
