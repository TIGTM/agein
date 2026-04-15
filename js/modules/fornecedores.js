// ========== MÓDULO FORNECEDORES ==========
const FornecedoresModule = {
    render() {
        const fornecedores = DB.getAll('fornecedores');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Fornecedores</h1>
                    <p>Gerenciamento de fornecedores</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="FornecedoresModule.showForm()">+ Novo Fornecedor</button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Categoria</th>
                            <th>Contato</th>
                            <th>Telefone</th>
                            <th>Status</th>
                            <th style="width:120px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fornecedores.map(f => `
                            <tr>
                                <td><strong>${f.nome}</strong></td>
                                <td>${f.cnpj}</td>
                                <td>${f.categoria}</td>
                                <td>${f.contato}</td>
                                <td>${f.telefone}</td>
                                <td>${Utils.statusBadge(f.status)}</td>
                                <td>
                                    <button class="btn-icon" onclick="FornecedoresModule.showForm(${f.id})" title="Editar">✎</button>
                                    <button class="btn-icon" onclick="FornecedoresModule.remove(${f.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#9ca3af;">Nenhum fornecedor</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    showForm(id = null) {
        const f = id ? DB.getById('fornecedores', id) : { nome: '', cnpj: '', categoria: '', contato: '', telefone: '', email: '', status: 'ativo' };
        Utils.showModal(
            id ? 'Editar Fornecedor' : 'Novo Fornecedor',
            `
            <form id="fornForm" onsubmit="FornecedoresModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Nome *</label><input type="text" name="nome" value="${f.nome}" required></div>
                    <div class="form-group"><label>CNPJ</label><input type="text" name="cnpj" value="${f.cnpj}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoria</label>
                        <select name="categoria">
                            <option>Alimentos em geral</option>
                            <option ${f.categoria === 'Carnes' ? 'selected' : ''}>Carnes</option>
                            <option ${f.categoria === 'Laticínios' ? 'selected' : ''}>Laticínios</option>
                            <option ${f.categoria === 'Hortifrutigranjeiros' ? 'selected' : ''}>Hortifrutigranjeiros</option>
                            <option ${f.categoria === 'Bebidas' ? 'selected' : ''}>Bebidas</option>
                            <option ${f.categoria === 'Embalagens' ? 'selected' : ''}>Embalagens</option>
                            <option ${f.categoria === 'Produtos de Limpeza' ? 'selected' : ''}>Produtos de Limpeza</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="ativo" ${f.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                            <option value="inativo" ${f.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Contato</label><input type="text" name="contato" value="${f.contato}"></div>
                    <div class="form-group"><label>Telefone</label><input type="text" name="telefone" value="${f.telefone}"></div>
                </div>
                <div class="form-group"><label>E-mail</label><input type="email" name="email" value="${f.email}"></div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('fornForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const form = event.target;
        const data = {
            id: id || null,
            nome: form.nome.value, cnpj: form.cnpj.value, categoria: form.categoria.value,
            contato: form.contato.value, telefone: form.telefone.value, email: form.email.value,
            status: form.status.value
        };
        DB.save('fornecedores', data);
        Utils.closeModal();
        Utils.showToast('Fornecedor salvo!', 'success');
        App.renderPage('fornecedores');
    },

    remove(id) {
        Utils.confirm('Excluir fornecedor?', () => {
            DB.delete('fornecedores', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('fornecedores');
        });
    }
};
