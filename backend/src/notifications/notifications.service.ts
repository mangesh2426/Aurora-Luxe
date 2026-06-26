import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.warn('SMTP credentials are not fully configured. Email notifications will be disabled.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for port 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`Nodemailer SMTP Transporter initialized successfully for host: ${host}`);
    } catch (error) {
      this.logger.error('Failed to initialize SMTP transporter', error);
    }
  }

  /**
   * Safe method to send order emails to customer and admin
   * @param orderId The ID of the order to send emails for
   */
  async sendOrderNotifications(orderId: string): Promise<boolean> {
    try {
      // 1. Fetch complete order details
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
          payment: true,
          coupon: true,
          user: true,
        },
      });

      if (!order) {
        this.logger.error(`Order with ID ${orderId} not found for notification sending.`);
        return false;
      }

      if (!this.transporter) {
        this.logger.warn('Email notification requested but SMTP transporter is not initialized.');
        return false;
      }

      // 2. Parse shipping address details
      const sa: any = order.shippingAddress || {};
      const customerEmail = sa.email || order.user?.email || process.env.TEST_CUSTOMER_EMAIL;
      const customerName = sa.name || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Valued Customer';
      const customerPhone = sa.phone || 'N/A';
      
      const fullAddress = sa.address || [sa.street, sa.city, sa.state, sa.country, sa.pincode].filter(Boolean).join(', ') || 'N/A';
      const cityStateZip = [sa.city, sa.state, sa.pincode].filter(Boolean).join(', ');

      if (!customerEmail) {
        this.logger.error(`No email address found for order ID ${orderId}. Skipping notification.`);
        return false;
      }

      // 3. Render HTML templates
      const adminHtml = this.renderAdminEmailHtml(order, customerName, customerEmail, customerPhone, sa, fullAddress, cityStateZip);
      const customerHtml = this.renderCustomerEmailHtml(order, customerName, customerPhone, sa, fullAddress, cityStateZip);

      const fromAddress = process.env.SMTP_FROM || `"Aurora Luxe" <${process.env.SMTP_USER}>`;
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

      // 4. Send Customer Email
      try {
        await this.transporter.sendMail({
          from: fromAddress,
          to: customerEmail,
          subject: `Your Order is Confirmed - #${order.id}`,
          html: customerHtml,
        });
        this.logger.log(`Order confirmation email sent to customer: ${customerEmail}`);
      } catch (err) {
        this.logger.error(`Failed to send order confirmation email to customer: ${customerEmail}`, err);
      }

      // 5. Send Admin Email
      if (adminEmail) {
        try {
          await this.transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            subject: `New Jewellery Order Received - #${order.id}`,
            html: adminHtml,
          });
          this.logger.log(`New order alert email sent to admin: ${adminEmail}`);
        } catch (err) {
          this.logger.error(`Failed to send order alert email to admin: ${adminEmail}`, err);
        }
      }

      return true;
    } catch (error) {
      // Catch any unexpected database or rendering error to ensure order flow doesn't crash
      this.logger.error(`Unexpected error during order notifications dispatch for order: ${orderId}`, error);
      return false;
    }
  }

  private renderCustomerEmailHtml(order: any, customerName: string, customerPhone: string, sa: any, fullAddress: string, cityStateZip: string): string {
    const formattedTotal = `₹${Number(order.totalAmount).toLocaleString('en-IN')}`;
    const paymentMethodName = order.payment?.method || 'N/A';
    const paymentStatusName = order.payment?.status === 'SUCCESS' ? 'Paid' : 'Unpaid (Cash on Delivery)';

    const itemsRows = this.renderItemsRows(order.items);

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
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
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
            <div class="summary-value">₹${this.calculateSubtotal(order.items).toLocaleString('en-IN')}</div>
          </div>
          ${order.coupon ? `
          <div class="summary-row">
            <div class="summary-label">Coupon Discount (${order.coupon.code})</div>
            <div class="summary-value">-₹${Number(order.coupon.discount).toLocaleString('en-IN')}</div>
          </div>` : ''}
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
          ${sa.address || sa.street || 'N/A'}<br>
          ${cityStateZip || 'N/A'}<br>
          ${sa.country || 'India'}<br>
          Phone: ${customerPhone}
        </p>
      </div>

      <p style="font-size: 14px; color: #8e8e8e; text-align: center; font-style: italic;">
        Note: Delivery generally takes 3-5 business days. An AWB tracking link will be shared once shipped.
      </p>

      <div class="button-container">
        <a href="${process.env.FRONTEND_URL || 'https://auroraluxe.com'}/tracking?orderId=${order.id}" class="btn">Track Your Order</a>
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

  private renderAdminEmailHtml(
    order: any, 
    customerName: string, 
    customerEmail: string, 
    customerPhone: string, 
    sa: any, 
    fullAddress: string, 
    cityStateZip: string
  ): string {
    const formattedTotal = `₹${Number(order.totalAmount).toLocaleString('en-IN')}`;
    const paymentMethodName = order.payment?.method || 'N/A';
    const paymentStatusName = order.payment?.status || 'PENDING';

    const itemsRows = this.renderItemsRows(order.items);

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
    .footer a { color: #dfc79b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Aurora Luxe</div>
      <div class="alert-title">★ NEW ORDER RECEIVED ★</div>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">An order has been successfully placed by a customer. Below are the execution and shipping details.</p>
      
      <div class="section-title">Order Information</div>
      <div class="grid">
        <div class="grid-row">
          <div class="grid-cell-label">Order ID:</div>
          <div class="grid-cell-val">#${order.id}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Date & Time:</div>
          <div class="grid-cell-val">${order.createdAt.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'medium' })}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Payment Method:</div>
          <div class="grid-cell-val">${paymentMethodName}</div>
        </div>
        <div class="grid-row">
          <div class="grid-cell-label">Payment Status:</div>
          <div class="grid-cell-val"><strong>${paymentStatusName}</strong></div>
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
        ${sa.address || sa.street || 'N/A'}<br>
        ${cityStateZip || 'N/A'}<br>
        ${sa.country || 'India'}
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
          <div class="summary-value">₹${this.calculateSubtotal(order.items).toLocaleString('en-IN')}</div>
        </div>
        ${order.coupon ? `
        <div class="summary-row">
          <div class="summary-label">Coupon Code Used</div>
          <div class="summary-value">${order.coupon.code} (-₹${Number(order.coupon.discount).toLocaleString('en-IN')})</div>
        </div>` : ''}
        <div class="total-row">
          <div class="summary-label" style="color: #1a1a1a;">Total Revenue</div>
          <div class="summary-value">${formattedTotal}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an automated system notification for Aurora Luxe Admin Operations.</p>
    </div>
  </div>
</body>
</html>
`;
  }

  private renderItemsRows(items: any[]): string {
    return items.map(item => {
      const p = item.product || {};
      const imgUrl = p.images?.[0]?.url || '';
      
      const backendUrl = process.env.RENDER_EXTERNAL_URL || process.env.API_URL || 'http://localhost:3001';
      const absoluteImgUrl = imgUrl.startsWith('http') 
        ? imgUrl 
        : imgUrl.startsWith('/')
          ? `${backendUrl}${imgUrl}`
          : `${backendUrl}/${imgUrl}`;

      return `
        <tr>
          <td style="width: 55px; padding-left: 0;">
            ${imgUrl ? `<img src="${absoluteImgUrl}" class="product-img" alt="${p.name}">` : `<div style="width: 50px; height: 50px; background-color: #f0f0f0; border-radius:4px;"></div>`}
          </td>
          <td>
            <span class="product-name">${p.name || 'Unnamed Product'}</span>
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right; font-weight: bold;">₹${Number(item.price).toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');
  }

  private calculateSubtotal(items: any[]): number {
    return items.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);
  }
}
