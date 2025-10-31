const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Iniciando teste do carrossel...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Acessando http://localhost:8000');
    await page.goto('http://localhost:8000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✅ Página carregada com sucesso!\n');

    console.log('🔍 Rolando até a seção de lojas...');
    await page.locator('#popular').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    console.log('📊 Verificando elementos do carrossel:');

    const swiperContainer = await page.locator('.popularSwiper').count();
    console.log(`   - Container Swiper: ${swiperContainer > 0 ? '✅ Encontrado' : '❌ Não encontrado'}`);

    const slides = await page.locator('.popularSwiper .swiper-slide').count();
    console.log(`   - Total de slides: ${slides} ${slides === 7 ? '✅' : '⚠️'}`);

    const nextButton = await page.locator('.swiper-button-next').count();
    console.log(`   - Botão próximo: ${nextButton > 0 ? '✅ Encontrado' : '❌ Não encontrado'}`);

    const prevButton = await page.locator('.swiper-button-prev').count();
    console.log(`   - Botão anterior: ${prevButton > 0 ? '✅ Encontrado' : '❌ Não encontrado'}`);

    const pagination = await page.locator('.swiper-pagination').count();
    console.log(`   - Paginação: ${pagination > 0 ? '✅ Encontrado' : '❌ Não encontrado'}\n`);

    console.log('📸 Capturando screenshot da seção...');
    await page.locator('#popular').screenshot({
      path: 'carousel-view.png',
      animations: 'disabled'
    });
    console.log('   ✅ Screenshot salvo como carousel-view.png\n');

    console.log('🎯 Testando navegação...');
    await page.locator('.swiper-button-next').click();
    await page.waitForTimeout(1000);
    console.log('   ➡️  Avançou para o próximo slide');

    await page.locator('.swiper-button-next').click();
    await page.waitForTimeout(1000);
    console.log('   ➡️  Avançou mais um slide');

    await page.locator('.swiper-button-prev').click();
    await page.waitForTimeout(1000);
    console.log('   ⬅️  Voltou um slide\n');

    console.log('📱 Testando responsividade...');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.locator('#popular').screenshot({ path: 'carousel-mobile.png' });
    console.log('   📱 Mobile (375px) - Screenshot salvo como carousel-mobile.png');

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.locator('#popular').screenshot({ path: 'carousel-tablet.png' });
    console.log('   📱 Tablet (768px) - Screenshot salvo como carousel-tablet.png');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    console.log('   🖥️  Desktop (1920px) - Visualização padrão\n');

    console.log('🎉 Teste concluído com sucesso!');
    console.log('📁 Arquivos gerados:');
    console.log('   - carousel-view.png');
    console.log('   - carousel-mobile.png');
    console.log('   - carousel-tablet.png\n');

    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Navegador fechado');
  }
})();
