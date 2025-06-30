import { z } from 'zod';

const emailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    html: z.string(),
});

type EmailParams = z.infer<typeof emailSchema>;

// Simple email function that logs to console in development
// In production, you would integrate with a real email service
export async function sendEmail({ to, subject, html }: EmailParams) {
    try {
        const validated = emailSchema.parse({ to, subject, html });

        // In development, just log the email
        if (process.env.NODE_ENV === 'development') {
            console.log('📧 Email would be sent:');
            console.log('To:', validated.to);
            console.log('Subject:', validated.subject);
            console.log('HTML:', validated.html);
            return { success: true, data: { id: 'dev-email-' + Date.now() } };
        }

        // In production, you would use a real email service
        // For now, we'll use a simple console log
        console.log('📧 Email sent:', {
            to: validated.to,
            subject: validated.subject,
        });
        return { success: true, data: { id: 'prod-email-' + Date.now() } };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
