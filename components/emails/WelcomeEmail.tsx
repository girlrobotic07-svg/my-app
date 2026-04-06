export function WelcomeEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', padding: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Welcome to MyApp! 🎉
      </h1>
      <p style={{ color: '#555', lineHeight: '1.6' }}>
        Hi {name || 'there'},<br /><br />
        Thanks for signing up. Your account is ready — here's what you can do next:
      </p>
      <ul style={{ color: '#555', lineHeight: '2' }}>
        <li>✅ Complete your profile</li>
        <li>✅ Browse our plans</li>
        <li>✅ Start your subscription</li>
      </ul>
      
        href={process.env.NEXT_PUBLIC_SITE_URL}
        style={{
          display: 'inline-block',
          marginTop: '24px',
          background: '#000',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
        }}
      >
        Go to Dashboard →
      </a>
      <p style={{ marginTop: '32px', color: '#aaa', fontSize: '12px' }}>
        MyApp · You're receiving this because you signed up.
      </p>
    </div>
  )
}