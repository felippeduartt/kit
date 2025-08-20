const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contato@befmarket.store';
const YAMPI_WEBHOOK_SECRET = process.env.YAMPI_WEBHOOK_SECRET;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const PRODUCT_MAPPING = {
  'CZ5JKMXCI7': [
    { name: 'Aprendendo com Alegria', googleDriveId: '1mY8zVRqYK3pL6NsO4HgT2wE9RxC7AfB1', icon: '📚' },
    { name: 'Aprendendo a Orar', googleDriveId: '1kF3xWvU9ZpN2MsL8TgR5YhC6BfD0QeH4', icon: '🙏' },
    { name: 'O Amor de Deus', googleDriveId: '1nE7yTsP4WqM3LfK9RgB8XhA5CzV2NeJ6', icon: '❤️' },
    { name: 'Andando com Jesus', googleDriveId: '1pG9wAsF6ZrQ5NgM2SfL7YhD8BxV4PeK3', icon: '✝️' },
    { name: 'Passatempo Bíblico', googleDriveId: '1rH2vBsG8ZtR7PgN4UfM9YhE1CzX6QfL5', icon: '🎯' },
    { name: 'Aventuras Bíblicas', googleDriveId: '1sI4wCtH0ZuS9QgO6VgN2YhF3DzY8RgM7', icon: '🗺️' },
    { name: 'Alfabeto Bíblico', googleDriveId: '1tJ6xDuI2ZvT1RgP8WgO4YhD8BxV4PeK3', icon: '🔤' },
    { name: 'Colorindo com Propósito', googleDriveId: '1uK8yEvJ4ZwU3ShQ0XgP6YhH7FzA2TiO1', icon: '🎨' },
    { name: 'Atividades Bíblicas', googleDriveId: '1vL0zFwK6ZxV5TiR2YgQ8YhI9GzB4UjP3', icon: '📝' }
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
            Cada PDF contém atividades educativas e divertidas para fortalecer a fé das crianças.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #059669; font-size: 20px;">📚 Kit Completo para Download:</h3>
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
      
      if (customerEmail) {
        const products = PRODUCT_MAPPING['CZ5JKMXCI7'] || [];
        
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
        error: 'Erro interno do servidor',
        message: error.message 
      })
    };
  }
};