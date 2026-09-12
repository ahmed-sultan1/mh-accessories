const nodemailer = require('nodemailer');

// ========== TRANSPORTER ==========
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ========== HELPERS ==========
function formatCurrency(amount) {
    return `EGP ${Number(amount || 0).toFixed(2)}`;
}

function buildItemsRows(items) {
    return (items || []).map(item => `
        <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e5e2da;">
                <div style="font-family:'Inter',Arial,sans-serif;font-size:14px;color:#1a1a1a;">${item.name || ''}</div>
                ${item.color || item.size ? `<div style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#888;margin-top:2px;">${[item.color, item.size].filter(Boolean).join(' / ')}</div>` : ''}
                <div style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#888;margin-top:2px;">Qty: ${item.quantity || 1}</div>
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #e5e2da;text-align:right;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#1a1a1a;white-space:nowrap;">
                ${formatCurrency((item.price || 0) * (item.quantity || 1))}
            </td>
        </tr>
    `).join('');
}

function buildInvoiceHTML(order) {
    return `
    <div style="background:#f8f6f2;padding:40px 20px;font-family:'Inter',Arial,sans-serif;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#1a1a1a;padding:32px;text-align:center;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;letter-spacing:6px;color:#ffffff;">shift</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#1a1a1a;margin-bottom:4px;">New order received</div>
            <div style="font-family:'Inter',Arial,sans-serif;font-size:13px;color:#888;margin-bottom:24px;">Order ${order.orderId} &middot; ${order.date}</div>

            <table role="presentation" width="100%" style="background:#f0eee8;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:6px 16px;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#1a1a1a;"><strong>${order.name || ''}</strong></td></tr>
              <tr><td style="padding:6px 16px;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">${order.phone || ''}${order.email ? ' &middot; ' + order.email : ''}</td></tr>
              <tr><td style="padding:6px 16px;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">${order.address || ''}, ${order.city || ''} ${order.postcode || ''}</td></tr>
              <tr><td style="padding:6px 16px 12px;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">Payment: ${order.paymentMethod === 'cod' ? 'Cash on delivery' : (order.paymentMethod || '')}</td></tr>
            </table>

            <table role="presentation" width="100%" style="margin-bottom:16px;">
              ${buildItemsRows(order.items)}
            </table>

            <table role="presentation" width="100%">
              <tr>
                <td style="padding:4px 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">Subtotal</td>
                <td style="padding:4px 0;text-align:right;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">${formatCurrency(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">Shipping</td>
                <td style="padding:4px 0;text-align:right;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#555;">${formatCurrency(order.shipping)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;border-top:1px solid #1a1a1a;font-family:'Playfair Display',Georgia,serif;font-size:16px;color:#1a1a1a;">Total</td>
                <td style="padding:12px 0 0;border-top:1px solid #1a1a1a;text-align:right;font-family:'Playfair Display',Georgia,serif;font-size:16px;color:#1a1a1a;">${formatCurrency(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f0eee8;padding:20px;text-align:center;">
            <div style="font-family:'Inter',Arial,sans-serif;font-size:11px;letter-spacing:0.1em;color:#888;">shift &middot; change your style</div>
          </td>
        </tr>
      </table>
    </div>
    `;
}

// ========== SEND ==========
async function sendOrderNotification(order) {
    const recipient = process.env.ORDER_NOTIFY_EMAIL || process.env.EMAIL_USER;
    await transporter.sendMail({
        from: `"shift" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: `New order ${order.orderId} \u2014 ${formatCurrency(order.total)}`,
        html: buildInvoiceHTML(order)
    });
}

module.exports = { sendOrderNotification };