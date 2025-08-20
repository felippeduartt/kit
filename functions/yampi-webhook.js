const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
const YAMPI_WEBHOOK_SECRET = process.env.YAMPI_WEBHOOK_SECRET;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const PRODUCT_MAPPING = {
  'CZ5JKMXCI7': [
    { name: 'Aprendendo com Alegria', googleDriveId: '1CEtVnpyKUXXDKnlOt_tpHfUVElbwyf1I', icon: '📚' },
    { name: 'Aprendendo a Orar', googleDriveId: '14r4qCfvQ5Aw-26BmahMRhZITUCrtmMtY', icon: '🙏' },
    { name: 'O Amor de Deus', googleDriveId: '12cKZmzScN4dqGuJDlVP4dN_REBZhpn-Y', icon: '❤️' },
    { name: 'Andando com Jesus', googleDriveId: '1N3YipbKazlgJSCeA2XGFaI9e4C2bfHYC', icon: '✝️' },
    { name: 'Passatempo Bíblico', googleDriveId: '1tpHcCxO0UxRiJvQY3VM-u1qea1vwpR0V', icon: '🎯' },
    { name: 'Aventuras Bíblicas', googleDriveId: '1WlmpV0UQCq5ulSVN60Ej359GxlvYKq0F', icon: '🗺️' },
    { name: 'Alfabeto Bíblico', googleDriveId: '1jTuy3HTvWk9e0i8cajYP1eoGA3rj1CWh', icon: '🔤' },
    { name: 'Colorindo com Propósito', googleDriveId: '1L6zq2gpKwbDk1YTkbOZBfObqAJzjTb0o', icon: '🎨' },
    { name: 'Atividades Bíblicas', googleDriveId: '1HU2kaJf43SayRk-JrgOjnX6nWcMq9HKD', icon: '📝' }
  ]
};

async function sendProductEmail(customerEmail, customerName, products) {
  const productButtons = products.map(product => `
    <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2563eb;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 24px; margin-right: 10px;">${product.icon}</span>
        <h4 style="margin: 0; color: #2563eb;">${product.name}</h4>
      </div>
      <a href="https://drive.google.com/uc?export=download&id=${product.googleDriveId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        📥 Download PDF
      </a>
    </div>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seus Produtos Bíblicos</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Parabéns!</h1>
          <p style="color: white; margin: 15px 0 0 0; font-size: 18px;">Seus produtos bíblicos estão prontos!</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #2563eb; margin-top: 0; font-size: 24px;">Olá ${customerName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sua compra foi confirmada com sucesso! Seus produtos digitais estão prontos para download.
            ${products.length === 1 ? 'Você adquiriu 1 produto específico.' : `Você adquiriu o Kit Completo com ${products.length} produtos.`}
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #059669; font-size: 20px;">📚 ${products.length === 1 ? 'Seu Produto' : 'Kit Completo'} para Download:</h3>
            ${productButtons}
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="margin-top: 0; color: #1e40af;">💡 Dicas de Uso:</h4>
            <ul style="color: #374151; margin: 10px 0;">
              <li>Imprima em papel de boa qualidade para melhor experiência</li>
              <li>Use os materiais em momentos especiais com a família</li>
              <li>Incentive a participação ativa das crianças</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0;">
              <strong>Kit Bíblico Infantil</strong><br>
              Educação cristã com amor e propósito
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to: customerEmail,
    from: {
      email: FROM_EMAIL,
      name: 'Kit Bíblico - Entrega Automática'
    },
    subject: '🎉 Seus Produtos Bíblicos Estão Prontos para Download!',
    html: emailHtml
  };

  return await sgMail.send(msg);
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight OK' })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  try {
    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY não configurado');
    }

    const webhookData = JSON.parse(event.body);
    console.log('Webhook recebido:', JSON.stringify(webhookData, null, 2));

    if (webhookData.event === 'order.paid' || webhookData.event === 'payment.approved') {
      const order = webhookData.data || webhookData;
      const customerEmail = order.customer?.email || order.buyer_email;
      const customerName = order.customer?.name || order.buyer_name || 'Cliente';
      const orderTotal = parseFloat(order.total) || 0;
      
      if (customerEmail) {
        // CORREÇÃO CRÍTICA: Determinar produtos baseado no valor
        const allProducts = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
        let products = [];
        
        if (orderTotal >= 40) {
          // Kit completo: todos os 9 produtos
          products = allProducts;
          console.log('🎯 Kit Completo detectado (R$', orderTotal, ') - enviando', products.length, 'produtos');
        } else {
          // Produto individual: APENAS 1 produto
          products = [allProducts[0]];
          console.log('🎯 Produto Individual detectado (R$', orderTotal, ') - enviando APENAS', products.length, 'produto');
        }
        
        console.log('Enviando email para: ' + customerEmail);
        const emailResult = await sendProductEmail(customerEmail, customerName, products);
        console.log('Email enviado com sucesso:', emailResult[0].statusCode);
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            message: 'Email enviado com sucesso',
            customer: customerEmail,
            products: products.length
          })
        };
      } else {
        console.log('Email do cliente não encontrado');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Email do cliente não encontrado' })
        };
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Webhook processado - evento ignorado' })
    };

  } catch (error) {
    console.error('Erro no webhook:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Erro no processamento do webhook',
        details: error.message
      })
    };
  }
};
