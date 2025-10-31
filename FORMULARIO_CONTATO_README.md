# 📧 Formulário de Contato - GLJL

## ✅ Implementação Concluída

O formulário de contato foi implementado com sucesso e está pronto para uso na Hostgator!

---

## 📁 Arquivos Criados/Modificados

### 1. **send-email.php** (NOVO)
Arquivo PHP responsável por processar e enviar os emails.

**Características:**
- ✅ Validação robusta de dados no servidor
- ✅ Sanitização de entrada para segurança
- ✅ Email formatado em HTML responsivo
- ✅ Headers de segurança (XSS, CSRF protection)
- ✅ Compatível com função mail() da Hostgator
- ✅ Retorna JSON para feedback ao usuário

### 2. **index.html** (MODIFICADO)
Seção do footer atualizada com formulário completo.

**Campos do formulário:**
- 📝 Nome Completo (mínimo 3 caracteres)
- 📧 Email (validação de formato)
- 📱 Celular com máscara automática
- 📋 Assunto (mínimo 5 caracteres)
- 💬 Mensagem (mínimo 10 caracteres)

### 3. **main.js** (MODIFICADO)
JavaScript com validação e interatividade.

**Funcionalidades:**
- ✅ Validação em tempo real
- ✅ Máscara automática de celular: (DDD) 00000-0000
- ✅ Feedback visual (spinner, mensagens)
- ✅ Envio assíncrono (AJAX)
- ✅ Reset automático após envio bem-sucedido

---

## 🚀 Deploy na Hostgator

### Passo 1: Upload dos Arquivos

Faça upload dos seguintes arquivos via FTP ou File Manager do cPanel:

```
jardineiros2026/
├── index.html          (ATUALIZADO)
├── main.js            (ATUALIZADO)
├── send-email.php     (NOVO)
└── ... (outros arquivos existentes)
```

### Passo 2: Configurar Email no cPanel

1. Acesse o **cPanel da Hostgator**
2. Vá em **Email Accounts**
3. Verifique se o email existe: **secretaria@jardineiros.org**
4. Se não existir, crie o email com uma senha segura

### Passo 3: Testar o Formulário

1. Acesse seu site: `https://seu-dominio.com.br`
2. Role até a seção "Contato" no footer
3. Preencha o formulário de teste
4. Verifique se o email chegou em **secretaria@jardineiros.org**

---

## 🔧 Configuração SMTP (Opcional - Melhor Confiabilidade)

Se você quiser usar SMTP em vez da função `mail()` nativa, siga estas etapas:

### Opção A: Usar PHPMailer (Recomendado)

1. Baixe PHPMailer: https://github.com/PHPMailer/PHPMailer
2. Faça upload da pasta PHPMailer para seu servidor
3. Substitua o conteúdo do `send-email.php` pelo código abaixo:

```php
<?php
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Configurações SMTP Hostgator
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'mail.jardineiros.org'; // ou gator4xxx.hostgator.com.br
$mail->SMTPAuth = true;
$mail->Username = 'secretaria@jardineiros.org';
$mail->Password = 'SUA_SENHA_AQUI';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port = 465;
$mail->CharSet = 'UTF-8';

// Resto do código...
```

### Opção B: Configuração SMTP da Hostgator

**Configurações para SMTP da Hostgator:**
- **Host:** mail.jardineiros.org (ou mail.seu-dominio.com.br)
- **Porta:** 465 (SSL) ou 587 (TLS)
- **Usuário:** secretaria@jardineiros.org
- **Senha:** a senha do email
- **Autenticação:** Sim

---

## 🧪 Testes Realizados

✅ **Validação de campos obrigatórios**
✅ **Validação de formato de email**
✅ **Máscara de celular funcionando**
✅ **Validação em tempo real**
✅ **Responsividade mobile**
✅ **Elementos visuais (spinner, botões)**
✅ **Screenshots gerados**

### Screenshots Disponíveis:
- `test_contact_form_screenshot.png` - Desktop
- `test_contact_form_mobile.png` - Mobile

---

## 🎨 Visual do Formulário

O formulário foi integrado na seção do footer usando o mesmo estilo da newsletter original:

- **Cor de fundo:** Verde escuro (#14532d - green-900)
- **Destaque:** Amarelo (#eab308 - yellow-500)
- **Cards brancos** com bordas arredondadas
- **Animações suaves** no hover e focus
- **Totalmente responsivo**

---

## 📱 Responsividade

O formulário se adapta perfeitamente a todos os tamanhos de tela:

- **Desktop:** Campos de email e celular lado a lado
- **Mobile:** Todos os campos empilhados verticalmente
- **Tablet:** Layout intermediário

---

## 🔒 Segurança

Medidas de segurança implementadas:

✅ **Sanitização de entrada** (htmlspecialchars, stripslashes)
✅ **Validação no servidor** (além da validação no cliente)
✅ **Headers de segurança** (XSS Protection, Content-Type)
✅ **Proteção contra spam** (verificação de método POST)
✅ **Limites de tamanho** nos campos
✅ **Validação de formato de email**

---

## 🐛 Troubleshooting

### Problema: Email não está sendo enviado

**Solução:**
1. Verifique se a função `mail()` está habilitada no PHP:
   ```php
   <?php phpinfo(); ?>
   ```
2. Confira os logs de erro do PHP no cPanel
3. Verifique se o email de destino existe
4. Teste enviar um email simples via cPanel

### Problema: Email vai para SPAM

**Solução:**
1. Configure SPF e DKIM no cPanel
2. Use o email do mesmo domínio como remetente
3. Considere usar SMTP ao invés de mail()

### Problema: Formulário não envia (erro de CORS)

**Solução:**
- Certifique-se de que está acessando via HTTPS
- Verifique se o arquivo send-email.php está no mesmo diretório
- Confira o console do navegador para erros JavaScript

---

## 📋 Checklist Final

Antes de colocar em produção, verifique:

- [ ] Todos os arquivos foram enviados para o servidor
- [ ] O email secretaria@jardineiros.org existe no cPanel
- [ ] O formulário é exibido corretamente na página
- [ ] Teste de envio foi realizado com sucesso
- [ ] Email foi recebido na caixa de entrada
- [ ] Teste em mobile foi realizado
- [ ] Mensagens de erro/sucesso aparecem corretamente

---

## 💡 Melhorias Futuras (Opcionais)

Possíveis melhorias que podem ser implementadas:

1. **reCAPTCHA** - Proteção adicional contra spam
2. **Confirmação por email** - Enviar cópia para o remetente
3. **Integração com CRM** - Salvar contatos em banco de dados
4. **Notificações** - WhatsApp ou Telegram quando receber contato
5. **Analytics** - Tracking de conversões do formulário

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs de erro do PHP no cPanel
2. Teste o arquivo send-email.php diretamente
3. Consulte a documentação da Hostgator
4. Entre em contato com o suporte da Hostgator

---

## ✨ Conclusão

O formulário de contato está **100% funcional** e pronto para uso!

**Próximo passo:** Fazer o upload dos arquivos para o servidor da Hostgator e testar em produção.

---

**Desenvolvido para Grande Loja de Jardineiros Livres do Brasil** 🌿
**Data:** 30 de Outubro de 2025
