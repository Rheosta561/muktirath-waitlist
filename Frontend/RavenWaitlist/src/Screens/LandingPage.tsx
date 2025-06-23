import React, { useEffect, useRef, useState, type FormEvent } from "react"
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
} from "../components/ui/carousel"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { CarouselNext, CarouselPrevious } from "../components/ui/carousel"

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
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsJoined(true)
    }

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await axios.post(`http://localhost:3000/signup`, {
        email,
      })
      console.log(response.status)
      localStorage.setItem("token", response.data.token)
      setResponseMessage(response.data.message)
      setIsJoined(true)
    } catch (error) {
      console.error(error)
      setResponseMessage("Something went wrong. Please try again.")
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
                {/* <div className="flex justify-center gap-2 mt-4">
                  {screenshots.map((_, index) => (
                    <div
                      key={index}
                      className="w-2.5 h-2.5 rounded-full bg-muted-foreground opacity-50 hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </div> */}
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
                {isJoined ? (
                  <p className=" text-sm mt-2">
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
                      <Button type="submit">Sign Up</Button>
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
