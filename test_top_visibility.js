const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Verificando se o topo das imagens está visível...\n');

  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

    console.log('📜 Navegando para seção de lojas...');
    await page.locator('#popular').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Verificar a posição da seção e das imagens
    const sectionBox = await page.locator('#popular').boundingBox();
    console.log(`\n📦 Seção #popular:`);
    console.log(`   Posição Y: ${Math.round(sectionBox.y)}`);
    console.log(`   Altura: ${Math.round(sectionBox.height)}\n`);

    const swiperBox = await page.locator('.popularSwiper').boundingBox();
    console.log(`📦 Container Swiper:`);
    console.log(`   Posição Y: ${Math.round(swiperBox.y)}`);
    console.log(`   Altura: ${Math.round(swiperBox.height)}\n`);

    // Verificar quantos cards estão visíveis
    const visibleSlides = await page.locator('.popularSwiper .swiper-slide-visible').count();
    const activeSlides = await page.locator('.popularSwiper .swiper-slide-active').count();

    console.log(`👁️  Cards visíveis simultaneamente: ${visibleSlides}`);
    console.log(`🎯 Card ativo: ${activeSlides}\n`);

    // Analisar cada imagem visível
    const images = await page.locator('.popularSwiper .swiper-slide-visible img').all();

    console.log(`🖼️  Análise das imagens visíveis (${images.length}):\n`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const box = await img.boundingBox();

      if (box) {
        const topEdge = Math.round(box.y);
        const bottomEdge = Math.round(box.y + box.height);
        const isTopVisible = topEdge > 0 && topEdge > sectionBox.y;

        console.log(`   Imagem ${i + 1}:`);
        console.log(`     Topo em Y: ${topEdge}px ${isTopVisible ? '✅ Visível' : '⚠️  Pode estar cortado'}`);
        console.log(`     Base em Y: ${bottomEdge}px`);
        console.log(`     Largura x Altura: ${Math.round(box.width)}x${Math.round(box.height)}px\n`);
      }
    }

    // Screenshot com overlay para debug
    await page.evaluate(() => {
      const swiper = document.querySelector('.popularSwiper');
      const wrapper = document.querySelector('.swiper-wrapper');

      // Adicionar bordas vermelhas temporárias para debug
      swiper.style.border = '3px solid red';
      wrapper.style.border = '3px solid blue';
    });

    console.log('📸 Capturando screenshot com bordas de debug...');
    await page.locator('#popular').screenshot({ path: 'debug-borders.png' });
    console.log('   Salvo como: debug-borders.png (vermelho=swiper, azul=wrapper)\n');

    // Remover bordas
    await page.evaluate(() => {
      const swiper = document.querySelector('.popularSwiper');
      const wrapper = document.querySelector('.swiper-wrapper');
      swiper.style.border = '';
      wrapper.style.border = '';
    });

    // Screenshot limpo
    await page.screenshot({ path: 'full-page-view.png', fullPage: true });
    console.log('📸 Screenshot página completa: full-page-view.png');

    await page.waitForTimeout(3000);
    console.log('\n✅ Análise concluída!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
})();
