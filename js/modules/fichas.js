// ========== MÓDULO FICHAS TÉCNICAS ==========
const FichasModule = {
    render() {
        const fichas = DB.getAll('fichas');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Fichas Técnicas</h1>
                    <p>Gerencie receitas e informações nutricionais</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="FichasModule.showForm()">+ Nova Ficha</button>
                </div>
            </div>

            <div class="cards-grid">
                ${fichas.map(f => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${f.nome}</div>
                                <div class="item-card-subtitle">${f.categoria} • ${f.porcoes} porções</div>
                            </div>
                            <span style="font-size:24px;">🍽️</span>
                        </div>
                        <div class="item-card-body">
                            <div><strong>Cliente:</strong> ${Utils.getClienteNome(f.clienteId)}</div>
                            <div><strong>Ingredientes:</strong> ${f.ingredientes.length} itens</div>
                            <div><strong>Valor Calórico:</strong> ${f.valorCalorico} kcal/porção</div>
                        </div>
                        <div class="item-card-footer">
                            <small>${Utils.formatDate(f.criadoEm)}</small>
                            <div>
                                <button class="btn-icon" onclick="FichasModule.view(${f.id})" title="Ver">👁</button>
                                <button class="btn-icon" onclick="FichasModule.showForm(${f.id})" title="Editar">✎</button>
                                <button class="btn-icon" onclick="FichasModule.remove(${f.id})" title="Excluir">🗑</button>
                            </div>
                        </div>
                    </div>
                `).join('') || '<div class="empty-state"><div class="empty-state-icon">🍽️</div><h3>Nenhuma ficha técnica</h3></div>'}
            </div>
        `;
    },

    showForm(id = null) {
        const f = id ? DB.getById('fichas', id) : {
            nome: '', categoria: 'Prato Principal', clienteId: '', porcoes: 1, modoPreparo: '',
            ingredientes: [{nome:'', quantidade:0, unidade:'g'}],
            valorCalorico: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, sodio: 0
        };
        const clientes = DB.getAll('clientes');

        window.__currentFicha = f;

        Utils.showModal(
            id ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica',
            `
            <form id="fichaForm" onsubmit="FichasModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Nome do Produto *</label><input type="text" name="nome" value="${f.nome}" required></div>
                    <div class="form-group">
                        <label>Categoria</label>
                        <select name="categoria">
                            <option ${f.categoria==='Entrada'?'selected':''}>Entrada</option>
                            <option ${f.categoria==='Prato Principal'?'selected':''}>Prato Principal</option>
                            <option ${f.categoria==='Sobremesa'?'selected':''}>Sobremesa</option>
                            <option ${f.categoria==='Bebida'?'selected':''}>Bebida</option>
                            <option ${f.categoria==='Salada'?'selected':''}>Salada</option>
                            <option ${f.categoria==='Panificação'?'selected':''}>Panificação</option>
                            <option ${f.categoria==='Lanche'?'selected':''}>Lanche</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === f.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Nº de Porções</label><input type="number" name="porcoes" value="${f.porcoes}" min="1"></div>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Ingredientes</h3>
                <div class="ficha-ingredientes">
                    <div class="ingrediente-row" style="font-weight:600;font-size:12px;color:#6b7280;">
                        <div>Ingrediente</div><div>Quantidade</div><div>Unidade</div><div></div>
                    </div>
                    <div id="ingredientesList">
                        ${f.ingredientes.map((ing, i) => this.renderIngrediente(ing, i)).join('')}
                    </div>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="FichasModule.addIngrediente()">+ Adicionar Ingrediente</button>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Modo de Preparo</h3>
                <div class="form-group">
                    <textarea name="modoPreparo" rows="4">${f.modoPreparo}</textarea>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Informação Nutricional (por porção)</h3>
                <div class="form-row three">
                    <div class="form-group"><label>Valor Calórico (kcal)</label><input type="number" name="valorCalorico" value="${f.valorCalorico}" step="0.1"></div>
                    <div class="form-group"><label>Proteínas (g)</label><input type="number" name="proteinas" value="${f.proteinas}" step="0.1"></div>
                    <div class="form-group"><label>Carboidratos (g)</label><input type="number" name="carboidratos" value="${f.carboidratos}" step="0.1"></div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Gorduras Totais (g)</label><input type="number" name="gorduras" value="${f.gorduras}" step="0.1"></div>
                    <div class="form-group"><label>Fibras (g)</label><input type="number" name="fibras" value="${f.fibras}" step="0.1"></div>
                    <div class="form-group"><label>Sódio (mg)</label><input type="number" name="sodio" value="${f.sodio}" step="0.1"></div>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('fichaForm').requestSubmit()">Salvar</button>`,
            'large'
        );
    },

    renderIngrediente(ing, index) {
        return `
            <div class="ingrediente-row" data-index="${index}">
                <input type="text" placeholder="Nome" value="${ing.nome}" onchange="FichasModule.updateIngrediente(${index}, 'nome', this.value)">
                <input type="number" placeholder="Qtd" value="${ing.quantidade}" step="0.01" onchange="FichasModule.updateIngrediente(${index}, 'quantidade', parseFloat(this.value))">
                <select onchange="FichasModule.updateIngrediente(${index}, 'unidade', this.value)">
                    <option ${ing.unidade==='g'?'selected':''}>g</option>
                    <option ${ing.unidade==='kg'?'selected':''}>kg</option>
                    <option ${ing.unidade==='ml'?'selected':''}>ml</option>
                    <option ${ing.unidade==='L'?'selected':''}>L</option>
                    <option ${ing.unidade==='un'?'selected':''}>un</option>
                    <option ${ing.unidade==='colher'?'selected':''}>colher</option>
                    <option ${ing.unidade==='xícara'?'selected':''}>xícara</option>
                </select>
                <button type="button" class="btn-remove" onclick="FichasModule.removeIngrediente(${index})">×</button>
            </div>
        `;
    },

    updateIngrediente(index, field, value) {
        window.__currentFicha.ingredientes[index][field] = value;
    },

    addIngrediente() {
        window.__currentFicha.ingredientes.push({nome:'', quantidade:0, unidade:'g'});
        this.refreshIngredientes();
    },

    removeIngrediente(index) {
        window.__currentFicha.ingredientes.splice(index, 1);
        this.refreshIngredientes();
    },

    refreshIngredientes() {
        document.getElementById('ingredientesList').innerHTML =
            window.__currentFicha.ingredientes.map((ing, i) => this.renderIngrediente(ing, i)).join('');
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('fichas', {
            id: id || null,
            nome: f.nome.value, categoria: f.categoria.value,
            clienteId: parseInt(f.clienteId.value), porcoes: parseInt(f.porcoes.value),
            modoPreparo: f.modoPreparo.value,
            ingredientes: window.__currentFicha.ingredientes.filter(i => i.nome),
            valorCalorico: parseFloat(f.valorCalorico.value) || 0,
            proteinas: parseFloat(f.proteinas.value) || 0,
            carboidratos: parseFloat(f.carboidratos.value) || 0,
            gorduras: parseFloat(f.gorduras.value) || 0,
            fibras: parseFloat(f.fibras.value) || 0,
            sodio: parseFloat(f.sodio.value) || 0,
            criadoEm: id ? DB.getById('fichas', id).criadoEm : new Date().toISOString().split('T')[0]
        });
        Utils.closeModal();
        Utils.showToast('Ficha salva!', 'success');
        App.renderPage('fichas');
    },

    view(id) {
        const f = DB.getById('fichas', id);
        Utils.showModal(
            'Ficha Técnica',
            `
            <div id="fichaContent">
                <h2 style="color:#0054e9;">${f.nome}</h2>
                <p style="color:#6b7280;margin-bottom:20px;">${f.categoria} • ${f.porcoes} porções • Cliente: ${Utils.getClienteNome(f.clienteId)}</p>

                <h3 style="color:#0054e9;margin-bottom:10px;">Ingredientes</h3>
                <table class="data-table">
                    <thead><tr><th>Ingrediente</th><th>Quantidade</th><th>Unidade</th></tr></thead>
                    <tbody>
                        ${f.ingredientes.map(i => `<tr><td>${i.nome}</td><td>${i.quantidade}</td><td>${i.unidade}</td></tr>`).join('')}
                    </tbody>
                </table>

                <h3 style="color:#0054e9;margin-top:20px;margin-bottom:10px;">Modo de Preparo</h3>
                <p style="white-space:pre-line;">${f.modoPreparo}</p>

                <h3 style="color:#0054e9;margin-top:20px;margin-bottom:10px;">Informação Nutricional (por porção)</h3>
                <table class="data-table">
                    <tbody>
                        <tr><td><strong>Valor Energético</strong></td><td>${f.valorCalorico} kcal</td></tr>
                        <tr><td><strong>Carboidratos</strong></td><td>${f.carboidratos} g</td></tr>
                        <tr><td><strong>Proteínas</strong></td><td>${f.proteinas} g</td></tr>
                        <tr><td><strong>Gorduras Totais</strong></td><td>${f.gorduras} g</td></tr>
                        <tr><td><strong>Fibra Alimentar</strong></td><td>${f.fibras} g</td></tr>
                        <tr><td><strong>Sódio</strong></td><td>${f.sodio} mg</td></tr>
                    </tbody>
                </table>
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.printElement('fichaContent')">🖨 Imprimir</button>`,
            'large'
        );
    },

    remove(id) {
        Utils.confirm('Excluir ficha?', () => {
            DB.delete('fichas', id);
            Utils.showToast('Excluída!', 'success');
            App.renderPage('fichas');
        });
    }
};
