"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesData = void 0;
exports.seedCategories = seedCategories;
exports.categoriesData = [
    {
        name: 'Frontend Development',
        slug: 'frontend-development',
        description: 'Questions covering client-side technologies, DOM, state management, and modern UI frameworks.',
    },
    {
        name: 'Backend Development',
        slug: 'backend-development',
        description: 'Questions focusing on server-side logic, API design, dependency injection, and microservices.',
    },
    {
        name: 'Database & Storage',
        slug: 'database-storage',
        description: 'Questions covering relational SQL, indexing, query optimization, caching, and NoSQL engines.',
    },
    {
        name: 'DevOps & Infrastructure',
        slug: 'devops-infrastructure',
        description: 'Questions covering containerization, deployment pipelines, CI/CD, and cloud infrastructure.',
    },
    {
        name: 'Web Architecture & Performance',
        slug: 'web-architecture-performance',
        description: 'Questions covering rendering strategies (SSR, SSG, ISR), network protocols, security, and web performance.',
    },
    {
        name: 'Software Architecture & System Design',
        slug: 'software-architecture-system-design',
        description: 'High-level patterns, microservices, distributed systems, and domain-driven design.',
    },
    {
        name: 'Software Testing & Quality Assurance',
        slug: 'software-testing-quality-assurance',
        description: 'Manual testing, automation (Selenium, Cypress), unit/integration tests, and QA workflows.',
    },
    {
        name: 'Cybersecurity & Information Security',
        slug: 'cybersecurity-information-security',
        description: 'Pen-testing, network defense, threat modeling, compliance, and cryptography.',
    },
    {
        name: 'Data Science & Business Intelligence',
        slug: 'data-science-business-intelligence',
        description: 'Statistical modeling, SQL analytics, BI dashboards (Power BI, Tableau), and data mining.',
    },
    {
        name: 'Data Engineering & Big Data',
        slug: 'data-engineering-big-data',
        description: 'Data pipelines, ETL/ELT workflows, data lakes, Kafka, Spark, and data warehousing.',
    },
    {
        name: 'Artificial Intelligence & Machine Learning',
        slug: 'artificial-intelligence-machine-learning',
        description: 'Deep learning, NLP, computer vision, LLMs, prompt engineering, and MLOps.',
    },
    {
        name: 'Cloud Solutions & Architecture',
        slug: 'cloud-solutions-architecture',
        description: 'Cloud-native patterns, multi-cloud strategy, serverless, and IAM on AWS/Azure/GCP.',
    },
    {
        name: 'Computer Networks & Systems Administration',
        slug: 'computer-networks-sysadmin',
        description: 'Network protocols (TCP/IP, DNS, VPN), routing, switching, and Linux/Windows administration.',
    },
    {
        name: 'Embedded Systems & Internet of Things',
        slug: 'embedded-systems-iot',
        description: 'C/C++, microcontrollers, real-time operating systems (RTOS), sensors, and firmware.',
    },
    {
        name: 'Game Development',
        slug: 'game-development',
        description: 'Game engines (Unity, Unreal Engine), graphics pipelines (DirectX, OpenGL), and game physics.',
    },
    {
        name: 'Blockchain & Web3 Technologies',
        slug: 'blockchain-web3-technologies',
        description: 'Smart contracts, Solidity, decentralized apps (dApps), consensus mechanisms, and cryptography.',
    },
    {
        name: 'UI/UX Design & Product Design',
        slug: 'ui-ux-product-design',
        description: 'User research, wireframing, prototyping, usability testing, and accessibility (WCAG).',
    },
    {
        name: 'Product & Project Management',
        slug: 'product-project-management',
        description: 'Agile/Scrum methodologies, roadmap planning, product discovery, and SDLC management.',
    },
    {
        name: 'IT Support & Helpdesk Operations',
        slug: 'it-support-helpdesk-operations',
        description: 'Hardware troubleshooting, ticketing systems (ITIL), asset management, and end-user support.',
    },
];
async function seedCategories(prisma) {
    const categoryMap = new Map();
    for (const cat of exports.categoriesData) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description },
            create: cat,
        });
        categoryMap.set(cat.slug, created.id);
    }
    console.log(`✅ Seeded ${exports.categoriesData.length} Categories.`);
    return categoryMap;
}
//# sourceMappingURL=categories.seed.js.map