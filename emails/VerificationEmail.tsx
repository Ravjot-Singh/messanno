
import * as React from 'react';

interface OtpEmailTemplateProps {
  firstName: string;
  otp: string;
  expiresInMinutes?: number;
}

export function OtpEmailTemplate({
  firstName,
  otp,
  expiresInMinutes = 10,
}: OtpEmailTemplateProps) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: '32px 16px',
          backgroundColor: '#f4f4f5',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '32px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e4e4e7',
          }}
        >
          <h1
            style={{
              margin: '0 0 24px',
              color: '#18181b',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            Verify your email
          </h1>

          <p
            style={{
              color: '#3f3f46',
              fontSize: '15px',
              lineHeight: '24px',
            }}
          >
            Hi {firstName},
          </p>

          <p
            style={{
              color: '#3f3f46',
              fontSize: '15px',
              lineHeight: '24px',
            }}
          >
            Use the verification code below to
            complete your verification process.
          </p>

          <div
            style={{
              margin: '28px 0 16px',
              padding: '20px 12px',
              backgroundColor: '#f4f4f5',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#18181b',
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '8px',
              }}
            >
              {otp}
            </p>
          </div>

          <p
            style={{
              color: '#71717a',
              fontSize: '13px',
              textAlign: 'center',
              lineHeight: '20px',
            }}
          >
            This code expires in {expiresInMinutes} minutes.
          </p>

          <hr
            style={{
              margin: '28px 0 20px',
              border: 0,
              borderTop: '1px solid #e4e4e7',
            }}
          />

          <p
            style={{
              color: '#71717a',
              fontSize: '13px',
              lineHeight: '20px',
            }}
          >
            If you did not request this code, you can
            safely ignore this email. Never share your
            verification code with anyone.
          </p>

          <p
            style={{
              marginTop: '28px',
              color: '#a1a1aa',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            © {new Date().getFullYear()} Your Company
          </p>
        </div>
      </body>
    </html>
  );
}

export default OtpEmailTemplate;
