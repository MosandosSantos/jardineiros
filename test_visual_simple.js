const { chromium } = require('playwright');
const path = require('path');

async function testVisual() {
    console.log('🎨 Teste Visual do Formulário de Contato\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500 // Movimentos mais lentos para melhor visualização
    });
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
    });

    try {
        const filePath = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
        console.log('📄 Carregando:', filePath);
        await page.goto(filePath);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('✅ Página carregada\n');

        // Navegar até a seção de contato
        console.log('📜 Navegando para a seção Contato...');
        await page.click('a[href="#contact"]');
        await page.waitForTimeout(2000);

        // Screenshot inicial
        console.log('📸 Screenshot 1: Vista geral do formulário');
        await page.screenshot({
            path: 'visual_1_overview.png',
            fullPage: false
        });

        // Scroll preciso para o formulário
        await page.evaluate(() => {
            const footer = document.querySelector('#contact');
            const formContainer = footer.querySelector('.container.text-white.absolute');
            if (formContainer) {
                formContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
        await page.waitForTimeout(2000);

        console.log('📸 Screenshot 2: Formulário centralizado');
        await page.screenshot({
            path: 'visual_2_centered.png',
            fullPage: false
        });

        // Tentar interagir com os campos usando force: true
        console.log('\n🖱️  Testando interação com os campos...\n');

        await page.locator('#nome').fill('João Silva Teste', { force: true });
        console.log('✅ Nome preenchido');
        await page.waitForTimeout(500);

        await page.locator('#email').fill('joao@example.com', { force: true });
        console.log('✅ Email preenchido');
        await page.waitForTimeout(500);

        await page.locator('#celular').fill('21987654321', { force: true });
        await page.waitForTimeout(800);
        const celularValue = await page.locator('#celular').inputValue();
        console.log(`✅ Celular preenchido: ${celularValue}`);

        await page.locator('#assunto').fill('Teste Visual', { force: true });
        console.log('✅ Assunto preenchido');
        await page.waitForTimeout(500);

        await page.locator('#mensagem').fill('Esta é uma mensagem de teste para verificar se o formulário está funcionando sem sobreposição de elementos.', { force: true });
        console.log('✅ Mensagem preenchida');
        await page.waitForTimeout(500);

        console.log('\n📸 Screenshot 3: Formulário completamente preenchido');
        await page.screenshot({
            path: 'visual_3_filled.png',
            fullPage: false
        });

        // Testar mobile
        console.log('\n📱 Testando versão mobile...');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.click('a[href="#contact"]');
        await page.waitForTimeout(2000);

        console.log('📸 Screenshot 4: Mobile view');
        await page.screenshot({
            path: 'visual_4_mobile.png',
            fullPage: false
        });

        // Voltar para desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.click('a[href="#contact"]');
        await page.waitForTimeout(2000);

        // Screenshot da página inteira
        console.log('\n📸 Screenshot 5: Página completa');
        await page.screenshot({
            path: 'visual_5_fullpage.png',
            fullPage: true
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ TESTE VISUAL CONCLUÍDO COM SUCESSO!');
        console.log('='.repeat(60));
        console.log('\n📋 Screenshots gerados:');
        console.log('   1. visual_1_overview.png - Vista geral');
        console.log('   2. visual_2_centered.png - Formulário centralizado');
        console.log('   3. visual_3_filled.png - Formulário preenchido');
        console.log('   4. visual_4_mobile.png - Versão mobile');
        console.log('   5. visual_5_fullpage.png - Página completa\n');

        console.log('🔍 Mantendo navegador aberto por 10 segundos...');
        console.log('   Use este tempo para inspecionar visualmente o formulário\n');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        await page.screenshot({ path: 'visual_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('🏁 Teste finalizado');
    }
}

testVisual().catch(console.error);
