import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", textAlign: "center", padding: "40px", paddingTop: "120px" }}>
      <div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "120px", color: "var(--rose-light)", lineHeight: 1, marginBottom: "16px" }}>404</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 300, marginBottom: "16px" }}>Page Not Found</h1>
        <p style={{ fontSize: "15px", color: "var(--dark-mid)", fontWeight: 300, marginBottom: "40px", lineHeight: "1.8", maxWidth: "400px", margin: "0 auto 40px" }}>
          The page you're looking for doesn't exist.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">Back to Home</Link>
          <Link href="/booking" className="btn-outline">Book Appointment</Link>
        </div>
      </div>
    </div>
  );
}
