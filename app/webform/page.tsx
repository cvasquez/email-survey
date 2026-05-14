'use client'

export default function WebformTestPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#EDEDED',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
            Form Targeting Playground
          </h1>
          <p style={{ color: '#A1A1A1', marginTop: 8, fontSize: 14 }}>
            A page of varied forms for testing popup form-targeting rules. The
            content.js script is loaded from the root layout.
          </p>
        </header>

        <Section
          heading="Newsletter signup"
          note='id="newsletter-form" · class="signup-form"'
        >
          <form
            id="newsletter-form"
            className="signup-form"
            data-form-type="newsletter"
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Email">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                style={inputStyle}
              />
            </Field>
            <button type="submit" style={buttonStyle}>
              Subscribe
            </button>
          </form>
        </Section>

        <Section
          heading="Contact form"
          note='id="contact-form" · class="contact"'
        >
          <form
            id="contact-form"
            className="contact"
            data-form-type="contact"
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Name">
              <input type="text" name="name" style={inputStyle} />
            </Field>
            <Field label="Email">
              <input type="email" name="email" style={inputStyle} />
            </Field>
            <Field label="Message">
              <textarea
                name="message"
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>
            <button type="submit" style={buttonStyle}>
              Send message
            </button>
          </form>
        </Section>

        <Section
          heading="Login form"
          note='id="login-form" · class="auth-form"'
        >
          <form
            id="login-form"
            className="auth-form"
            data-form-type="login"
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Email">
              <input type="email" name="email" style={inputStyle} />
            </Field>
            <Field label="Password">
              <input type="password" name="password" style={inputStyle} />
            </Field>
            <button type="submit" style={buttonStyle}>
              Log in
            </button>
          </form>
        </Section>

        <Section
          heading="Checkout form"
          note='id="checkout-form" · class="checkout purchase-form"'
        >
          <form
            id="checkout-form"
            className="checkout purchase-form"
            data-form-type="checkout"
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Full name">
              <input type="text" name="full_name" style={inputStyle} />
            </Field>
            <Field label="Card number">
              <input
                type="text"
                name="card_number"
                placeholder="4242 4242 4242 4242"
                style={inputStyle}
              />
            </Field>
            <button type="submit" style={buttonStyle}>
              Pay now
            </button>
          </form>
        </Section>

        <Section
          heading="Unnamed form"
          note="no id or class — pure structural targeting"
        >
          <form
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Your question">
              <input type="text" name="question" style={inputStyle} />
            </Field>
            <button type="submit" style={buttonStyle}>
              Ask
            </button>
          </form>
        </Section>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#0A0A0A',
  border: '1px solid #333333',
  borderRadius: 6,
  color: '#EDEDED',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: '#3B82F6',
  border: 'none',
  borderRadius: 6,
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

function Section({
  heading,
  note,
  children,
}: {
  heading: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        background: '#141414',
        border: '1px solid #262626',
        borderRadius: 8,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{heading}</h2>
      <p
        style={{
          color: '#666666',
          fontSize: 12,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          margin: '4px 0 20px',
        }}
      >
        {note}
      </p>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label
      style={{
        display: 'block',
        marginBottom: 12,
        fontSize: 13,
        color: '#A1A1A1',
      }}
    >
      <span style={{ display: 'block', marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  )
}
