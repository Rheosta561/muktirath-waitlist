// src/components/Footer.tsx


export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background text-foreground py-4 px-4">
      <div className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Raven. All rights reserved.
      </div>
    </footer>
  )
}
