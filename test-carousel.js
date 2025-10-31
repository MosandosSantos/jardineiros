const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Criar pasta para screenshots se não existir
const screenshotsDir = path.join(__dirname, 'carousel-screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Criar pasta para relatório
const reportDir = path.join(__dirname, 'carousel-report');
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

async function testCarousel() {
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    const report = {
        totalSlides: 0,
        cardsInDOM: [],
        navigationSteps: [],
        cardsFound: {
            'Pau Brasil': false,
            'Acassia': false,
            'Arueira': false,
            'Vitória Régia': false,
            'Seringueira': false,
            'Ipê': false,
            'Amapazeiro': false
        },
        issues: []
    };

    try {
        console.log('🔍 Iniciando teste do carrossel...\n');

        // 1. Abrir o arquivo index.html
        const indexPath = 'file://' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
        console.log(`📂 Abrindo arquivo: ${indexPath}`);
        await page.goto(indexPath, { waitUntil: 'networkidle' });

        // Aguardar a página carregar completamente
        await page.waitForTimeout(2000);

        // 2. Navegar até a seção #popular
        console.log('📍 Navegando até seção #popular (Nossas Lojas)...');
        await page.evaluate(() => {
            document.querySelector('#popular').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        await page.waitForTimeout(2000);

        // Verificar se o carrossel existe
        const carouselExists = await page.locator('.popularSwiper').count() > 0;
        if (!carouselExists) {
            report.issues.push('❌ Carrossel .popularSwiper não encontrado no DOM');
            console.log('❌ ERRO: Carrossel não encontrado!');
            return report;
        }
        console.log('✅ Carrossel encontrado!\n');

        // 3. Verificar quantos slides existem no DOM
        const totalSlides = await page.locator('.popularSwiper .swiper-slide').count();
        report.totalSlides = totalSlides;
        console.log(`📊 Total de slides no DOM: ${totalSlides}\n`);

        // 4. Extrair informações de todos os cards no DOM
        console.log('🔎 Analisando cards no DOM...');
        const cardsData = await page.$$eval('.popularSwiper .swiper-slide', slides => {
            return slides.map((slide, index) => {
                const card = slide.querySelector('.popular__card');
                const loja = card.querySelector('p.italic')?.textContent || '';
                const nome = card.querySelector('h3')?.textContent || '';
                const cidade = card.querySelector('.flex p.text-xl')?.textContent || '';
                const img = card.querySelector('img')?.src || '';

                // Verificar classes de visibilidade do Swiper
                const isActive = slide.classList.contains('swiper-slide-active');
                const isVisible = slide.classList.contains('swiper-slide-visible');
                const isNext = slide.classList.contains('swiper-slide-next');
                const isPrev = slide.classList.contains('swiper-slide-prev');

                return {
                    index: index + 1,
                    loja,
                    nome,
                    cidade,
                    img,
                    classes: Array.from(slide.classList),
                    isActive,
                    isVisible,
                    isNext,
                    isPrev
                };
            });
        });

        report.cardsInDOM = cardsData;

        console.log('\n📋 CARDS ENCONTRADOS NO DOM:');
        console.log('═══════════════════════════════════════════════════════════');
        cardsData.forEach(card => {
            console.log(`Card ${card.index}: ${card.nome} - ${card.cidade}`);
            console.log(`  Loja: ${card.loja}`);
            console.log(`  Classes: ${card.classes.join(', ')}`);
            console.log(`  Status: ${card.isActive ? '🟢 Active' : ''} ${card.isVisible ? '👁️ Visible' : ''} ${card.isNext ? '➡️ Next' : ''} ${card.isPrev ? '⬅️ Prev' : ''}`);
            console.log('─────────────────────────────────────────────────────────');

            // Marcar cards encontrados
            if (report.cardsFound.hasOwnProperty(card.nome)) {
                report.cardsFound[card.nome] = true;
            }
        });

        // 5. Screenshot inicial
        console.log('\n📸 Tirando screenshot inicial...');
        await page.screenshot({
            path: path.join(screenshotsDir, 'carousel_step_0_initial.png'),
            fullPage: false
        });

        // Capturar estado inicial
        const initialVisible = await getVisibleCards(page);
        report.navigationSteps.push({
            step: 0,
            action: 'Estado inicial',
            visibleCards: initialVisible,
            screenshot: 'carousel_step_0_initial.png'
        });
        console.log(`   Cards visíveis: ${initialVisible.join(', ')}`);

        // 6. Clicar no botão "next" 10 vezes e tirar screenshots
        console.log('\n🔄 Navegando pelo carrossel (10 cliques no botão Next)...\n');

        for (let i = 1; i <= 10; i++) {
            console.log(`Click ${i}/10:`);

            // Clicar no botão next
            const nextButton = page.locator('.popularSwiper .swiper-button-next');
            await nextButton.click();
            await page.waitForTimeout(1000); // Aguardar animação

            // Capturar cards visíveis
            const visibleCards = await getVisibleCards(page);

            // Tirar screenshot
            const screenshotName = `carousel_step_${i}.png`;
            await page.screenshot({
                path: path.join(screenshotsDir, screenshotName),
                fullPage: false
            });

            // Registrar no relatório
            report.navigationSteps.push({
                step: i,
                action: `Click Next #${i}`,
                visibleCards: visibleCards,
                screenshot: screenshotName
            });

            console.log(`   Cards visíveis: ${visibleCards.join(', ')}`);
            console.log(`   Screenshot salvo: ${screenshotName}\n`);
        }

        // 7. Verificar se os cards 6 e 7 aparecem
        console.log('\n🎯 VERIFICAÇÃO DOS CARDS 6 e 7:');
        console.log('═══════════════════════════════════════════════════════════');

        const card6Ipe = report.cardsFound['Ipê'];
        const card7Amapazeiro = report.cardsFound['Amapazeiro'];

        console.log(`Card 6 (Ipê - Brasília): ${card6Ipe ? '✅ Encontrado no DOM' : '❌ NÃO encontrado no DOM'}`);
        console.log(`Card 7 (Amapazeiro - Amapá): ${card7Amapazeiro ? '✅ Encontrado no DOM' : '❌ NÃO encontrado no DOM'}`);

        // Verificar se aparecem durante a navegação
        let ipeAppareceu = false;
        let amapazeiroAppareceu = false;

        report.navigationSteps.forEach(step => {
            if (step.visibleCards.includes('Ipê')) ipeAppareceu = true;
            if (step.visibleCards.includes('Amapazeiro')) amapazeiroAppareceu = true;
        });

        console.log(`\nCard 6 (Ipê) apareceu durante navegação: ${ipeAppareceu ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`Card 7 (Amapazeiro) apareceu durante navegação: ${amapazeiroAppareceu ? '✅ SIM' : '❌ NÃO'}`);

        if (card6Ipe && !ipeAppareceu) {
            report.issues.push('⚠️ Card 6 (Ipê) está no DOM mas NÃO ficou visível durante a navegação');
        }
        if (card7Amapazeiro && !amapazeiroAppareceu) {
            report.issues.push('⚠️ Card 7 (Amapazeiro) está no DOM mas NÃO ficou visível durante a navegação');
        }

        // 8. Gerar relatório HTML
        await generateHTMLReport(report, screenshotsDir, reportDir);

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('✅ Teste concluído com sucesso!');
        console.log(`📁 Screenshots salvos em: ${screenshotsDir}`);
        console.log(`📄 Relatório HTML gerado em: ${path.join(reportDir, 'relatorio.html')}`);
        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
        report.issues.push(`Erro: ${error.message}`);
    } finally {
        await browser.close();
    }

    return report;
}

// Função auxiliar para obter cards visíveis
async function getVisibleCards(page) {
    return await page.$$eval('.popularSwiper .swiper-slide', slides => {
        return slides
            .filter(slide => {
                const rect = slide.getBoundingClientRect();
                const isVisible = slide.classList.contains('swiper-slide-visible') ||
                                slide.classList.contains('swiper-slide-active');
                return isVisible;
            })
            .map(slide => slide.querySelector('h3')?.textContent || 'Sem nome');
    });
}

// Função para gerar relatório HTML
async function generateHTMLReport(report, screenshotsDir, reportDir) {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Teste - Carrossel Nossas Lojas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .section {
            padding: 30px;
            border-bottom: 1px solid #eee;
        }
        .section:last-child {
            border-bottom: none;
        }
        h2 {
            color: #2a5298;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-left: 5px solid #667eea;
            padding-left: 15px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .stat-card p {
            font-size: 2.5em;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        tbody tr:hover {
            background: #f8f9fa;
        }
        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .badge.success {
            background: #d4edda;
            color: #155724;
        }
        .badge.danger {
            background: #f8d7da;
            color: #721c24;
        }
        .badge.warning {
            background: #fff3cd;
            color: #856404;
        }
        .screenshots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .screenshot-item {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .screenshot-item h4 {
            margin-bottom: 10px;
            color: #2a5298;
        }
        .screenshot-item img {
            width: 100%;
            border-radius: 8px;
            border: 2px solid #ddd;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .screenshot-item img:hover {
            transform: scale(1.05);
        }
        .screenshot-item p {
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }
        .issue {
            background: #fff3cd;
            border-left: 5px solid #ffc107;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .lightbox {
            display: none;
            position: fixed;
            z-index: 999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            align-items: center;
            justify-content: center;
        }
        .lightbox.active {
            display: flex;
        }
        .lightbox img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
        }
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 40px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Relatório de Teste do Carrossel</h1>
            <p>Seção "Nossas Lojas" (#popular)</p>
            <p style="font-size: 0.9em; margin-top: 10px;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </header>

        <div class="section">
            <h2>📈 Resumo Executivo</h2>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total de Slides no DOM</h3>
                    <p>${report.totalSlides}</p>
                </div>
                <div class="stat-card">
                    <h3>Cards Esperados</h3>
                    <p>7</p>
                </div>
                <div class="stat-card">
                    <h3>Navegações Realizadas</h3>
                    <p>10</p>
                </div>
                <div class="stat-card">
                    <h3>Screenshots Capturados</h3>
                    <p>${report.navigationSteps.length}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Status dos Cards</h2>
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Nome da Loja</th>
                        <th>No DOM</th>
                        <th>Apareceu na Navegação</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(report.cardsFound).map(([nome, found], index) => {
                        const appareceu = report.navigationSteps.some(step =>
                            step.visibleCards.includes(nome)
                        );
                        return `
                            <tr>
                                <td>Card ${index + 1}</td>
                                <td><strong>${nome}</strong></td>
                                <td>
                                    ${found ? '<span class="badge success">✅ Sim</span>' : '<span class="badge danger">❌ Não</span>'}
                                </td>
                                <td>
                                    ${appareceu ? '<span class="badge success">✅ Sim</span>' : '<span class="badge danger">❌ Não</span>'}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>📋 Detalhes dos Cards no DOM</h2>
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Loja</th>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>Classes Swiper</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.cardsInDOM.map(card => `
                        <tr>
                            <td>${card.index}</td>
                            <td>${card.loja}</td>
                            <td><strong>${card.nome}</strong></td>
                            <td>${card.cidade}</td>
                            <td style="font-size: 0.85em;">
                                ${card.isActive ? '<span class="badge success">Active</span> ' : ''}
                                ${card.isVisible ? '<span class="badge success">Visible</span> ' : ''}
                                ${card.isNext ? '<span class="badge warning">Next</span> ' : ''}
                                ${card.isPrev ? '<span class="badge warning">Prev</span> ' : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>🔄 Histórico de Navegação</h2>
            <table>
                <thead>
                    <tr>
                        <th>Step</th>
                        <th>Ação</th>
                        <th>Cards Visíveis</th>
                        <th>Screenshot</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.navigationSteps.map(step => `
                        <tr>
                            <td>${step.step}</td>
                            <td>${step.action}</td>
                            <td>${step.visibleCards.join(', ')}</td>
                            <td><a href="#${step.screenshot}">${step.screenshot}</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${report.issues.length > 0 ? `
        <div class="section">
            <h2>⚠️ Problemas Identificados</h2>
            ${report.issues.map(issue => `<div class="issue">${issue}</div>`).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>📸 Screenshots da Navegação</h2>
            <div class="screenshots">
                ${report.navigationSteps.map(step => `
                    <div class="screenshot-item">
                        <h4>${step.action}</h4>
                        <img src="../carousel-screenshots/${step.screenshot}"
                             alt="${step.action}"
                             id="${step.screenshot}"
                             onclick="openLightbox(this.src)">
                        <p>Cards visíveis: ${step.visibleCards.join(', ')}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <div class="lightbox" id="lightbox" onclick="closeLightbox()">
        <span class="lightbox-close">&times;</span>
        <img id="lightbox-img" src="" alt="Screenshot ampliado">
    </div>

    <script>
        function openLightbox(src) {
            document.getElementById('lightbox').classList.add('active');
            document.getElementById('lightbox-img').src = src;
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    </script>
</body>
</html>
    `;

    fs.writeFileSync(path.join(reportDir, 'relatorio.html'), html);

    // Também gerar um JSON para análise programática
    fs.writeFileSync(
        path.join(reportDir, 'relatorio.json'),
        JSON.stringify(report, null, 2)
    );
}

// Executar o teste
testCarousel().then(report => {
    console.log('\n📊 RESUMO DO TESTE:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total de slides no DOM: ${report.totalSlides}`);
    console.log(`Total de navegações realizadas: ${report.navigationSteps.length}`);
    console.log(`\nCards encontrados no DOM:`);
    Object.entries(report.cardsFound).forEach(([nome, found]) => {
        console.log(`  ${nome}: ${found ? '✅' : '❌'}`);
    });
    if (report.issues.length > 0) {
        console.log(`\n⚠️ Problemas encontrados: ${report.issues.length}`);
        report.issues.forEach(issue => console.log(`  ${issue}`));
    }
    console.log('═══════════════════════════════════════════════════════════\n');
}).catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
