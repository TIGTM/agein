// ========== APLICAÇÃO PRINCIPAL ==========
const App = {
    currentPage: 'dashboard',

    init() {
        this.setupLogin();
        this.setupNavigation();
        this.setupLogout();
        this.setupMenuToggle();
        this.setupGlobalSearch();

        // Verifica se já está logado
        if (localStorage.getItem('fc_logged') === 'true') {
            this.showApp();
        }
    },

    setupLogin() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email && password) {
                localStorage.setItem('fc_logged', 'true');
                this.showApp();
                Utils.showToast('Bem-vindo ao Agein!', 'success');
            }
        });
    },

    setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Utils.confirm('Deseja realmente sair do sistema?', () => {
                localStorage.removeItem('fc_logged');
                location.reload();
            });
        });
    },

    setupMenuToggle() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');

        document.getElementById('menuToggle').addEventListener('click', () => {
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('active');
        });

        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('open');
            backdrop.classList.remove('active');
        });
    },

    closeSidebarOnMobile() {
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarBackdrop').classList.remove('active');
        }
    },

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
                this.closeSidebarOnMobile();
            });
        });
    },

    setupGlobalSearch() {
        const search = document.getElementById('globalSearch');
        search.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (term.length >= 2) {
                this.globalSearch(term);
            }
        });
    },

    globalSearch(term) {
        const results = [];
        ['clientes', 'fornecedores', 'equipe', 'pops', 'fichas', 'checklists'].forEach(entity => {
            const items = DB.getAll(entity);
            items.forEach(item => {
                const text = JSON.stringify(item).toLowerCase();
                if (text.includes(term)) {
                    results.push({ entity, item });
                }
            });
        });
        // Resultados podem ser exibidos aqui
    },

    showApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        this.navigateTo('dashboard');
    },

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        this.renderPage(page);
    },

    renderPage(page) {
        const container = document.getElementById('pageContainer');
        const modules = {
            dashboard: DashboardModule,
            clientes: ClientesModule,
            fornecedores: FornecedoresModule,
            equipe: EquipeModule,
            checklists: ChecklistsModule,
            pops: POPsModule,
            fichas: FichasModule,
            rotulagem: RotulagemModule,
            visitas: VisitasModule,
            planos: PlanosModule,
            documentacao: DocumentacaoModule,
            treinamentos: TreinamentosModule,
            formularios: FormulariosModule,
            legislacao: LegislacaoModule,
            relatorios: RelatoriosModule,
            calendario: CalendarioModule
                ,landing: LandingModule
            };

        const module = modules[page];
        if (module && module.render) {
            container.innerHTML = module.render();
            if (module.afterRender) module.afterRender();
        } else {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🚧</div><h3>Módulo em construção</h3></div>';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
