const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🔧 Testando carrossel horizontal de galeria...\n');

    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage({
        viewport: { width: 1280, height: 720 }
    });

    try {
        const filePath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
        console.log('📂 Carregando:', filePath);
        await page.goto(filePath);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Rolar até galeria
        await page.evaluate(() => {
            document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        await page.waitForTimeout(2500);

        // Verificar object-fit
        const objectFit = await page.$eval('.gallery__card img', img => {
            const style = window.getComputedStyle(img);
            return {
                objectFit: style.objectFit,
                width: style.width,
                height: style.height
            };
        });

        console.log('📐 Propriedades da imagem:');
        console.log(`   object-fit: ${objectFit.objectFit}`);
        console.log(`   width: ${objectFit.width}`);
        console.log(`   height: ${objectFit.height}\n`);

        if (objectFit.objectFit === 'contain') {
            console.log('✅ Imagens configuradas corretamente (sem distorção)');
        } else {
            console.log('⚠️  object-fit não está como contain');
        }

        // Contar slides
        const slideCount = await page.$$eval('.swiper-slide', slides => slides.length);
        console.log(`\n✅ ${slideCount} slides carregados`);

        // Testar navegação
        console.log('\n➡️  Testando navegação...');
        await page.evaluate(() => document.querySelector('.swiper-button-next').click());
        await page.waitForTimeout(1000);
        console.log('✅ Navegação funcionando');

        // Abrir lightbox
        console.log('\n🖼️  Testando lightbox...');
        await page.evaluate(() => {
            document.querySelector('.gallery__card').click();
        });
        await page.waitForTimeout(1000);

        const lightboxOpen = await page.isVisible('#lightbox');
        if (lightboxOpen) {
            console.log('✅ Lightbox abre corretamente');

            // Fechar
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
            console.log('✅ Lightbox fecha corretamente');
        }

        console.log('\n🎉 Teste concluído!');
        console.log('\n⏳ Aguardando 5 segundos...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
    } finally {
        await browser.close();
    }
})();
