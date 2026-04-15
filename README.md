# Food Checker - Clone

Software para Consultoria de Alimentos - Clone do foodchecker.com.br

## Sobre

Sistema completo para consultores de alimentos, desenvolvido para organizar, agilizar e padronizar atividades de consultoria em segurança alimentar, rotulagem nutricional e gestão de qualidade.

## Funcionalidades

### Cadastros
- **Clientes**: Gestão completa de clientes (restaurantes, padarias, indústrias, etc.)
- **Fornecedores**: Cadastro de fornecedores por categoria
- **Equipe**: Gerenciamento de consultores e profissionais

### Operacional
- **Checklists**: Aplicação de checklists de BPF, APPCC, Higienização e Recebimento
- **POPs**: Criação de Procedimentos Operacionais Padrão com templates
- **Fichas Técnicas**: Cadastro de receitas com informações nutricionais
- **Rotulagem**: Geração de rótulos conforme RDC 429/2020 ANVISA
- **Visitas**: Agendamento e controle de visitas técnicas
- **Planos de Ação**: Gestão de ações corretivas e preventivas

### Gestão
- **Documentação**: Controle de alvarás e licenças com alerta de vencimento
- **Treinamentos**: Registro de treinamentos realizados
- **Formulários**: Planilhas de controle (temperatura, limpeza, recebimento)
- **Legislação**: Base de legislações sanitárias vigentes
- **Relatórios**: Análises consolidadas
- **Calendário**: Organização de visitas e eventos

## Como Usar

1. Abra o arquivo `index.html` em um navegador moderno (Chrome, Firefox, Edge)
2. Faça login com as credenciais demo:
   - E-mail: `admin@foodchecker.com`
   - Senha: `123456`
3. Navegue pelos módulos através do menu lateral

## Dados

- Os dados são armazenados localmente no navegador (LocalStorage)
- Dados iniciais de exemplo são criados automaticamente no primeiro acesso
- Use o módulo Relatórios para exportar backup em JSON

## Tecnologias

- HTML5
- CSS3 (design moderno responsivo)
- JavaScript Vanilla (sem dependências externas)
- LocalStorage (persistência local)

## Estrutura

```
FoodChecker/
├── index.html          # Página principal
├── css/
│   ├── style.css       # Estilos base
│   └── modules.css     # Estilos dos módulos
├── js/
│   ├── app.js          # Aplicação principal
│   ├── database.js     # Gerenciamento de dados
│   ├── utils.js        # Utilitários
│   └── modules/        # Módulos da aplicação
│       ├── dashboard.js
│       ├── clientes.js
│       ├── fornecedores.js
│       ├── equipe.js
│       ├── checklists.js
│       ├── pops.js
│       ├── fichas.js
│       ├── rotulagem.js
│       ├── visitas.js
│       ├── planos.js
│       ├── documentacao.js
│       ├── treinamentos.js
│       ├── formularios.js
│       ├── legislacao.js
│       ├── relatorios.js
│       └── calendario.js
└── data/               # Dados persistidos
```

## Conformidade Regulatória

O sistema contempla as principais regulamentações do setor:
- RDC 216/2004 ANVISA (BPF)
- RDC 275/2002 ANVISA (POPs)
- RDC 429/2020 ANVISA (Rotulagem)
- IN 75/2020 ANVISA (Requisitos de rotulagem)
