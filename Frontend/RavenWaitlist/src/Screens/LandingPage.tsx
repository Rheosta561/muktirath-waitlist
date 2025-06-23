import  { useEffect, useRef, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios';
import RavenCallAlert from '../assets/1.png'
import RavenCall from '../assets/5.png'
import RavenHome from '../assets/3.png'
import WatchTower from '../assets/4.png'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../components/ui/carousel"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

const taglines = [
  "Wanted to be a Hero?",
  "Ever dreamed of being Batman?",
  "This is your moment.",
  "Make the Raven Call.",
]

const screenshots = [
  { src: WatchTower, caption: "The Raven Board - Your city. Your signal. Stay in the shadows." },
  { src: RavenCallAlert, caption: "Raven Call - In danger or distress? Just press the Raven Call — help is on the way. " },
  { src: RavenHome, caption: "Raven Alert - The city’s dark corners have eyes — yours. This is your chance to be the Batman. Step in. Step up.." },
  { src: RavenCall, caption: "WatchTower - The city’s dark corners have eyes — yours." },
]

const mockCrimeStats = [
  { label: "Registered Crimes (2024)", value: 174253 },
  { label: "Murder decrease (Q1 2025)", value: 16 },
  { label: "Robbery decrease (Q1 2025)", value: 16 },
  { label: "Dacoity increase (2024)", value: 23 },
  { label: "Burglary increase (2024)", value: 25 },
  { label: "Crime rate per 100k", value: 1586 },
]

export default function LandingPage() {
  const [visible, setVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [email, setEmail] = useState<string>('')
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsJoined(true)

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % taglines.length)
    }, 2500)

    const timeout = setTimeout(() => {
      setVisible(false)
      clearInterval(interval)
    }, 10500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('https://raven-waitlist.onrender.com/count')
        if (response) setCount(response.data.count || 0)
      } catch (error: any) {
        console.error(error.message)
      }
    }
    fetchCount()
  }, [count])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(`https://raven-waitlist.onrender.com/signup`, { email })
      setCount(prev => prev + 1)
      localStorage.setItem("token", response.data.token)
      setResponseMessage(response.data.message)
      setIsJoined(true)
    } catch (error) {
      console.error(error)
      setResponseMessage("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-[95vh] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div
              key={taglines[currentIndex]}
              className="text-3xl sm:text-5xl font-medium text-center max-w-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {taglines[currentIndex]}
            </motion.div>
          ) : (
            <motion.div
              key="raven-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="w-full"
            >
              {/* What is Raven */}
              <section className="pt-20 text-center max-w-4xl mx-auto px-4 space-y-2" id='home'>
                <h2 className="text-lg font-semibold">Raven</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <span className="text-primary font-medium" id='about'>The Hero Within</span>
                  <br />
                  Raven is a modern SOS platform that empowers communities to act fast during crises.
                  With just a tap, users can trigger an alert that notifies nearby members — forming an instant response network.
                </p>
              </section>

              {/* Carousel */}
              <section className="py-8 px-4 max-w-5xl mx-auto text-center" id='features'>
                <h2 className="text-lg font-semibold mb-4">How it works</h2>
                <Carousel className="w-full relative">
                  <CarouselContent>
                    {screenshots.map((shot, idx) => (
                      <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="overflow-hidden">
                          <CardContent className="flex flex-col p-0">
                            <img
                              src={shot.src}
                              alt={`Screenshot ${idx + 1}`}
                              className="h-[50vh] md:h-[80vh] w-full object-cover"
                            />
                            <div className="p-4 text-muted-foreground text-sm">
                              {shot.caption}
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10" />
                </Carousel>
              </section>

              {/* Crime Stats */}
              <section className="py-12 px-4 max-w-xl mx-auto text-sm">
                <h2 className="text-md font-semibold mb-2">Rising Urban Crime Rates</h2>
                <p className="text-muted-foreground text-xs mb-4">
                  Traditional emergency systems are often delayed. Raven aims to change that.
                </p>
                <div className="space-y-2">
                  {mockCrimeStats.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-12 text-xs">{item.label}</span>
                      <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${Math.min(item.value, 100)}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8 max-w-md mx-auto" />

              {/* Waitlist */}
              <section className="py-4 px-4 max-w-xl mx-auto text-center" id="waitlist">
                <h2 className="text-md font-semibold mb-2">Get Early Access</h2>
                <p className="text-muted-foreground text-xs mb-3">
                  Be the first to get updates, beta invites, and exclusive features.
                </p>

                {/* Progress Indicator */}
                <div className="mb-4 text-xs text-primary font-medium">
                  {count} / 10,000 Ravens signed up — <span className="underline">Be one now!</span>
                </div>

                {isJoined ? (
                  <p className="text-sm mt-2">
                    You're already on the waitlist. We'll keep you posted!
                  </p>
                ) : (
                  <>
                    <form
                      className="flex flex-col sm:flex-row gap-2 justify-center"
                      ref={formRef}
                      onSubmit={handleSubmit}
                    >
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full sm:w-auto"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <svg
                            className="animate-spin h-4 w-4 text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </form>
                    {responseMessage && (
                      <p className="mt-2 text-sm ">
                        {responseMessage}
                      </p>
                    )}
                  </>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
