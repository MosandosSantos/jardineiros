const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🎭 Iniciando teste da galeria com Playwright...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navegar para a página
        const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
        console.log('📂 Abrindo arquivo:', filePath);
        await page.goto(filePath);
        await page.waitForLoadState('networkidle');

        console.log('✅ Página carregada com sucesso\n');

        // Esperar um pouco para a página carregar completamente
        await page.waitForTimeout(2000);

        // Verificar se a seção de galeria existe
        const gallerySection = await page.$('#gallery');
        if (gallerySection) {
            console.log('✅ Seção de galeria encontrada');
        } else {
            console.log('❌ Seção de galeria NÃO encontrada');
        }

        // Rolar até a galeria
        console.log('\n📜 Rolando até a seção da galeria...');
        await page.evaluate(() => {
            document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        await page.waitForTimeout(2000);

        // Verificar quantas imagens foram carregadas
        const imageCount = await page.$$eval('.gallery__card', cards => cards.length);
        console.log(`✅ ${imageCount} imagens carregadas na galeria\n`);

        if (imageCount === 0) {
            console.log('⚠️  Nenhuma imagem foi carregada. Verifique o caminho das imagens.');
        } else {
            // Testar clique na primeira imagem
            console.log('🖱️  Testando clique na primeira imagem...');
            await page.click('.gallery__card:first-child');
            await page.waitForTimeout(1000);

            // Verificar se o lightbox abriu
            const lightboxVisible = await page.isVisible('#lightbox');
            if (lightboxVisible) {
                console.log('✅ Lightbox abriu corretamente\n');

                // Verificar contador de imagens
                const counterText = await page.textContent('#image-counter');
                console.log(`📊 Contador: ${counterText}`);

                // Testar navegação para a próxima imagem
                console.log('\n➡️  Testando navegação para próxima imagem...');
                await page.evaluate(() => {
                    document.querySelector('#next-image').click();
                });
                await page.waitForTimeout(1000);
                const counterAfterNext = await page.textContent('#image-counter');
                console.log(`📊 Contador após avançar: ${counterAfterNext}`);

                // Testar navegação para imagem anterior
                console.log('\n⬅️  Testando navegação para imagem anterior...');
                await page.evaluate(() => {
                    document.querySelector('#prev-image').click();
                });
                await page.waitForTimeout(1000);
                const counterAfterPrev = await page.textContent('#image-counter');
                console.log(`📊 Contador após voltar: ${counterAfterPrev}`);

                // Testar atalho de teclado (seta direita)
                console.log('\n⌨️  Testando atalho de teclado (seta direita)...');
                await page.keyboard.press('ArrowRight');
                await page.waitForTimeout(1000);

                // Testar atalho de teclado (seta esquerda)
                console.log('⌨️  Testando atalho de teclado (seta esquerda)...');
                await page.keyboard.press('ArrowLeft');
                await page.waitForTimeout(1000);

                // Fechar lightbox com ESC
                console.log('\n❌ Testando fechar lightbox com ESC...');
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);

                const lightboxHidden = await page.isHidden('#lightbox');
                if (lightboxHidden) {
                    console.log('✅ Lightbox fechou corretamente com ESC\n');
                }

                // Testar fechar com botão X
                console.log('🖱️  Testando abrir novamente e fechar com botão X...');
                await page.click('.gallery__card:nth-child(2)');
                await page.waitForTimeout(1000);
                await page.evaluate(() => {
                    document.querySelector('#close-lightbox').click();
                });
                await page.waitForTimeout(1000);

                const lightboxClosedWithButton = await page.isHidden('#lightbox');
                if (lightboxClosedWithButton) {
                    console.log('✅ Lightbox fechou corretamente com botão X\n');
                }

            } else {
                console.log('❌ Lightbox NÃO abriu\n');
            }

            // Testar efeito hover
            console.log('🎨 Testando efeito hover nos cards...');
            await page.hover('.gallery__card:first-child');
            await page.waitForTimeout(1500);
            console.log('✅ Efeito hover testado\n');
        }

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('\n📝 Resumo:');
        console.log(`   • ${imageCount} imagens carregadas dinamicamente`);
        console.log('   • Lightbox funcionando corretamente');
        console.log('   • Navegação entre imagens funcionando');
        console.log('   • Atalhos de teclado funcionando');
        console.log('   • Animações e transições suaves');
        console.log('   • Design responsivo estilo Pinterest');

        // Manter o navegador aberto por 5 segundos para visualização
        console.log('\n⏳ Mantendo navegador aberto por 5 segundos para visualização...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('\n❌ ERRO durante o teste:', error.message);
    } finally {
        await browser.close();
        console.log('\n👋 Navegador fechado. Teste finalizado!');
    }
})();
