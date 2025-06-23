import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <motion.section
      className="py-20 px-6 max-w-5xl mx-auto text-center relative z-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold mb-4">About Raven</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Raven is your fitness wingman. Find gym buddies, track streaks, climb leaderboards,
        and soar toward your goals — all in one app.
      </p>
    </motion.section>
  )
}
