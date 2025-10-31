<?php
// Configurações de segurança
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Função para sanitizar entrada
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validar e sanitizar dados do formulário
$nome = isset($_POST['nome']) ? sanitize_input($_POST['nome']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$celular = isset($_POST['celular']) ? sanitize_input($_POST['celular']) : '';
$assunto = isset($_POST['assunto']) ? sanitize_input($_POST['assunto']) : '';
$mensagem = isset($_POST['mensagem']) ? sanitize_input($_POST['mensagem']) : '';

// Validações
$errors = [];

if (empty($nome) || strlen($nome) < 3) {
    $errors[] = 'Nome deve ter pelo menos 3 caracteres';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email inválido';
}

if (empty($celular) || strlen($celular) < 10) {
    $errors[] = 'Celular inválido';
}

if (empty($assunto) || strlen($assunto) < 5) {
    $errors[] = 'Assunto deve ter pelo menos 5 caracteres';
}

if (empty($mensagem) || strlen($mensagem) < 10) {
    $errors[] = 'Mensagem deve ter pelo menos 10 caracteres';
}

// Se houver erros, retornar
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Preparar o email usando mail() nativo do PHP (funciona na Hostgator)
$to = 'secretaria@jardineiros.org';
$subject = 'Contato Site GLJL - ' . $assunto;

// Corpo do email em HTML
$body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #14532d; color: #fff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #14532d; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nova Mensagem - Site GLJL</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nome:</div>
                <div class='value'>{$nome}</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>{$email}</div>
            </div>
            <div class='field'>
                <div class='label'>Celular:</div>
                <div class='value'>{$celular}</div>
            </div>
            <div class='field'>
                <div class='label'>Assunto:</div>
                <div class='value'>{$assunto}</div>
            </div>
            <div class='field'>
                <div class='label'>Mensagem:</div>
                <div class='value'>" . nl2br($mensagem) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Esta mensagem foi enviada através do formulário de contato do site Grande Loja de Jardineiros Livres do Brasil</p>
            <p>Data: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Headers do email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: GLJL Site <noreply@jardineiros.org>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Tentar enviar o email
$mail_sent = @mail($to, $subject, $body, $headers);

if ($mail_sent) {
    // Email enviado com sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    ]);
} else {
    // Erro ao enviar email
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde ou entre em contato diretamente pelo email secretaria@jardineiros.org'
    ]);
}
?>
