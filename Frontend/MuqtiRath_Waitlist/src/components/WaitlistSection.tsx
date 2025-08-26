export default function WaitlistSection() {
  return (
    <section className="py-20 px-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Join the Waitlist</h2>
      <p className="text-muted-foreground mb-6">
        Get early access and unlock exclusive features before anyone else.
      </p>
      <form className="flex flex-col sm:flex-row gap-2 justify-center">
        <input
          type="email"
          placeholder="you@example.com"
          className="border border-border px-4 py-2 rounded-md w-full sm:w-auto"
        />
        <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
          Join
        </button>
      </form>
    </section>
  )
}
