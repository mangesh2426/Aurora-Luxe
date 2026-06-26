import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, customer, items, total, paymentMethod, paymentStatus } = body;

    if (!orderId || !customer || !items) {
      return NextResponse.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.warn('SMTP credentials are not configured. Notifications skipped.');
      return NextResponse.json({ success: false, message: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'ganeshmetku7832@gmail.com';
    const customerEmail = customer.email || process.env.TEST_CUSTOMER_EMAIL;
    const customerName = customer.name || 'Valued Customer';
    const customerPhone = customer.phone || 'N/A';
    const shippingAddress = customer.address || 'N/A';
    const cityStateZip = [customer.city, customer.state, customer.pincode].filter(Boolean).join(', ');

    const orderDate = new Date().toLocaleDateString('en-IN', { dateStyle: 'long' });
    const orderDateTime = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'medium' });

    // Render templates
    const customerHtml = renderCustomerEmailHtml(orderId, customerName, customerPhone, shippingAddress, cityStateZip, items, total, paymentMethod, paymentStatus, orderDate);
    const adminHtml = renderAdminEmailHtml(orderId, customerName, customerEmail, customerPhone, shippingAddress, cityStateZip, items, total, paymentMethod, paymentStatus, orderDateTime);

    const fromAddress = process.env.SMTP_FROM || `"Aurora Luxe" <${user}>`;

    // Send Customer Email
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: customerEmail,
        subject: `Your Order is Confirmed - #${orderId}`,
        html: customerHtml,
      });
      console.log(`Order confirmation email sent to customer: ${customerEmail}`);
    } catch (err) {
      console.error(`Failed to send email to customer: ${customerEmail}`, err);
    }

    // Send Admin Email
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        subject: `New Jewellery Order Received - #${orderId}`,
        html: adminHtml,
      });
      console.log(`New order alert email sent to admin: ${adminEmail}`);
    } catch (err) {
      console.error(`Failed to send email to admin: ${adminEmail}`, err);
    }

    return NextResponse.json({ success: true, message: 'Notifications processed' });
  } catch (error) {
    console.error('Error processing order notifications API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

function renderCustomerEmailHtml(
  orderId: string,
  customerName: string,
  customerPhone: string,
  shippingAddress: string,
  cityStateZip: string,
  items: any[],
  total: number,
  paymentMethod: string,
  paymentStatus: string,
  orderDate: string
): string {
  const formattedTotal = `₹${Number(total).toLocaleString('en-IN')}`;
  const paymentStatusName = paymentStatus === 'Paid' ? 'Paid' : 'Unpaid (Cash on Delivery)';
  const itemsRows = renderItemsRows(items);
  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Order is Confirmed</title>
  <style>
    body { font-family: 'Playfair Display', 'Didot', 'Cinzel', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfcfc; margin: 0; padding: 0; color: #2d2d2d; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f0e6d6; }
    .header { text-align: center; padding: 40px 20px; background-color: #ffffff; border-bottom: 2px solid #dfc79b; }
    .brand { font-size: 26px; font-weight: bold; letter-spacing: 4px; color: #bca06f; text-transform: uppercase; margin: 0; }
    .brand-sub { font-size: 10px; letter-spacing: 2px; color: #8e8e8e; text-transform: uppercase; margin-top: 5px; }
    .content { padding: 40px 30px; line-height: 1.6; }
    .thank-you { font-size: 20px; color: #bca06f; text-align: center; margin-bottom: 30px; font-style: italic; }
    .order-meta { background-color: #FAF6F0; border-left: 3px solid #bca06f; padding: 15px; margin-bottom: 30px; font-size: 14px; }
    .order-meta p { margin: 5px 0; }
    .table-container { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8e8e8e; border-bottom: 1px solid #f0e6d6; }
    td { padding: 15px 12px; font-size: 14px; border-bottom: 1px solid #faf6f0; vertical-align: middle; }
    .product-img { width: 50px; height: 50px; object-fit: cover; border: 1px solid #f0e6d6; border-radius: 4px; }
    .product-name { font-weight: bold; color: #2d2d2d; }
    .summary-section { border-top: 2px solid #bca06f; padding-top: 15px; margin-top: 15px; }
    .summary-row { display: table; width: 100%; margin-bottom: 5px; font-size: 14px; }
    .summary-label { display: table-cell; text-align: left; color: #8e8e8e; }
    .summary-value { display: table-cell; text-align: right; font-weight: bold; }
    .total-row { display: table; width: 100%; margin-top: 10px; font-size: 18px; color: #bca06f; font-weight: bold; }
    .address-box { background-color: #FAF6F0; border: 1px solid #f0e6d6; padding: 20px; border-radius: 4px; margin-bottom: 30px; }
    .address-title { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #bca06f; margin-bottom: 10px; font-weight: bold; }
    .footer { text-align: center; padding: 30px; background-color: #FAF6F0; border-top: 1px solid #f0e6d6; font-size: 12px; color: #8e8e8e; }
    .footer a { color: #bca06f; text-decoration: none; }
    .button-container { text-align: center; margin: 30px 0; }
    .btn { background-color: #bca06f; color: #ffffff !important; padding: 12px 30px; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 0; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Aurora Luxe</div>
      <div class="brand-sub">Premium Anti-Tarnish Jewellery</div>
    </div>
    
    <div class="content">
      <div class="thank-you">Thank you for shopping with us, ${customerName}</div>
      <p>Your order has been received and is now being processed. We will notify you once your beautiful handpicked anti-tarnish jewellery is shipped.</p>
      
      <div class="order-meta">
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Order Date:</strong> ${orderDate}</p>
        <p><strong>Payment Status:</strong> ${paymentStatusName}</p>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th colspan="2">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        
        <div class="summary-section">
          <div class="summary-row">
            <div class="summary-label">Subtotal</div>
            <div class="summary-value">₹${subtotal.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">Shipping</div>
            <div class="summary-value">Free</div>
          </div>
          <div class="total-row">
            <div class="summary-label" style="color: #bca06f;">Grand Total</div>
            <div class="summary-value">${formattedTotal}</div>
          </div>
        </div>
      </div>

      <div class="address-box">
        <div class="address-title">Delivery Destination</div>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          <strong>${customerName}</strong><br>
          ${shippingAddress}<br>
          ${cityStateZip}<br>
          Phone: ${customerPhone}
        </p>
      </div>

      <p style="font-size: 14px; color: #8e8e8e; text-align: center; font-style: italic;">
        Note: Delivery generally takes 3-5 business days. An AWB tracking link will be shared once shipped.
      </p>

      <div class="button-container">
        <a href="${process.env.FRONTEND_URL || 'https://auroraluxe.com'}/tracking?orderId=${orderId}" class="btn">Track Your Order</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Questions? Contact our boutique support at <a href="mailto:support@auroraluxe.com">support@auroraluxe.com</a></p>
      <p>&copy; ${new Date().getFullYear()} Aurora Luxe. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}

function renderAdminEmailHtml(
  orderId: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  shippingAddress: string,
  cityStateZip: string,
  items: any[],
  total: number,
  paymentMethod: string,
  paymentStatus: string,
  orderDateTime: string
): string {
  const formattedTotal = `₹${Number(total).toLocaleString('en-IN')}`;
  const itemsRows = renderItemsRows(items);
  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; }
    .header { text-align: center; padding: 30px 20px; background-color: #1a1a1a; color: #dfc79b; border-bottom: 3px solid #dfc79b; }
    .brand { font-size: 24px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .alert-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; margin-top: 5px; }
    .content { padding: 40px 30px; line-height: 1.6; }
    .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #bca06f; border-bottom: 1px solid #f0e6d6; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; }
    .grid { display: table; width: 100%; margin-bottom: 20px; }
    .grid-row { display: table-row; }
    .grid-cell-label { display: table-cell; width: 150px; font-weight: bold; padding: 6px 0; color: #666; font-size: 14px; }
    .grid-cell-val { display: table-cell; padding: 6px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8e8e8e; border-bottom: 1px solid #f0e6d6; }
    td { padding: 15px 12px; font-size: 14px; border-bottom: 1px solid #faf6f0; vertical-align: middle; }
    .product-img { width: 50px; height: 50px; object-fit: cover; border: 1px solid #f0e6d6; border-radius: 4px; }
    .product-name { font-weight: bold; color: #2d2d2d; }
    .summary-row { display: table; width: 100%; margin-bottom: 5px; font-size: 14px; }
    .summary-label { display: table-cell; text-align: left; color: #8e8e8e; }
    .summary-value { display: table-cell; text-align: right; font-weight: bold; }
    .total-row { display: table; width: 100%; margin-top: 10px; font-size: 18px; color: #bca06f; font-weight: bold; }
    .footer { text-align: center; padding: 25px; background-color: #1a1a1a; color: #8e8e8e; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Aurora Luxe</div>
      <div class="alert-title">★ NEW ORDER RECEIVED ★</div>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">An order has been successfully placed by a customer. Below are the details.</p>
      
      <div class="section-title">Order Information</div>
      <div class="grid">
        <div class="grid-row">
          <div class="grid-cell-label">Order ID:</div>
          <div class="grid-cell-val">#${orderId}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Date & Time:</div>
          <div class="grid-cell-val">${orderDateTime}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Payment Method:</div>
          <div class="grid-cell-val">${paymentMethod}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Payment Status:</div>
          <div class="grid-cell-val"><strong>${paymentStatus}</strong></div>
        </div>
      </div>

      <div class="section-title">Customer Details</div>
      <div class="grid">
        <div class="grid-row">
          <div class="grid-cell-label">Name:</div>
          <div class="grid-cell-val">${customerName}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Email:</div>
          <div class="grid-cell-val"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Phone:</div>
          <div class="grid-cell-val">${customerPhone}</div>
        </div>
      </div>

      <div class="section-title">Shipping Address</div>
      <p style="margin: 0; font-size: 14px;">
        ${shippingAddress}<br>
        ${cityStateZip}
      </p>

      <div class="section-title">Order Items</div>
      <table>
        <thead>
          <tr>
            <th colspan="2">Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      
      <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
        <div class="summary-row">
          <div class="summary-label">Subtotal</div>
          <div class="summary-value">₹${subtotal.toLocaleString('en-IN')}</div>
        </div>
        <div class="total-row">
          <div class="summary-label" style="color: #1a1a1a;">Total Revenue</div>
          <div class="summary-value">${formattedTotal}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Automated system notification for Aurora Luxe Admin.</p>
    </div>
  </div>
</body>
</html>
`;
}

function renderItemsRows(items: any[]): string {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return items.map(item => {
    const imgUrl = item.imageUrl || '';
    const absoluteImgUrl = imgUrl.startsWith('http')
      ? imgUrl
      : imgUrl.startsWith('/')
        ? `${backendUrl}${imgUrl}`
        : `${backendUrl}/${imgUrl}`;

    return `
      <tr>
        <td style="width: 55px; padding-left: 0;">
          ${imgUrl ? `<img src="${absoluteImgUrl}" class="product-img" alt="${item.name}">` : `<div style="width: 50px; height: 50px; background-color: #f0f0f0; border-radius:4px;"></div>`}
        </td>
        <td>
          <span class="product-name">${item.name || 'Unnamed Product'}</span>
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right; font-weight: bold;">₹${Number(item.price).toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');
}
