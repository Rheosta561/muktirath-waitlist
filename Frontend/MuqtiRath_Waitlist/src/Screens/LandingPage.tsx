import  { useEffect, useRef, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios';
import RavenCallAlert from '../assets/2.png'
import RavenCall from '../assets/4.png'
import RavenHome from '../assets/3.png'
import WatchTower from '../assets/1.png'
import { Play, Apple , Globe} from "lucide-react";

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
  "Forgotten in shadows",
  "Silenced by the world",
  "Chains unseen, voices unheard",
  "Every soul deserves freedom.",
]

const screenshots = [
  { src: WatchTower, caption: "Kendra – One stop Dashboard. A step towards dignity and freedom. All voices, one place." },
  { src: RavenCallAlert, caption: "Rakshak - In danger or distress? Just press the Rakshak Button — help is on the way. " },
  { src: RavenHome, caption: "PathShaala – A step towards knowledge, in every mother tongue. Learn, grow, and rise." },
  { src: RavenCall, caption: "Explore Dhruvi , The MuktiRath MarketPlace and various HealthCamps ." },
]

const mockEmpowermentStats = [
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
              className="text-3xl sm:text-5xl first-letter:text-pink-800  font-medium text-center max-w-3xl"
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
                <h2 className="text-lg font-semibold">MuktiRath</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <span className="text-primary font-medium" id='about'> <span className="text-pink-900">Protecting</span> the Forced Queens</span>
                  <br />
                 MuktiRath is a movement of liberation — a platform dedicated to empowering women trapped in brothels and red-light districts.
With a single step, voices long silenced find strength, and forgotten lives find dignity — creating a network of hope, support, and freedom.
                </p>
              </section>

              {/* Carousel */}
              <section className="py-8 px-4 max-w-5xl mx-auto text-center" id='features'>
                <h2 className="text-lg font-semibold mb-4"><span className="text-pink-900">How</span> it works</h2>
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
  <h2 className="text-md text-center font-semibold mb-2">Lives in the Shadows</h2>
  <p className="text-muted-foreground text-center text-xs mb-4">
    Women and transgender individuals in marginalized communities are often denied dignity and opportunity. 
    MuktiRath exists to change that — turning silence into strength, and neglect into empowerment.
  </p>
  <div className="space-y-2">
    {mockEmpowermentStats.map((item, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <span className="w-20 text-xs">{item.label}</span>
        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-pink-950 h-full transition-all duration-500"
            style={{ width: `${Math.min(item.value, 100)}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">
          {item.value}%
        </span>
      </div>
    ))}
  </div>
</section>


              <Separator className="my-8 max-w-md mx-auto" />


<div className="flex flex-col sm:flex-row justify-center items-center text-center text-sm text-muted-foreground mb-4 gap-2 px-4">
 <a
    href="/assets/logo.png"
    download={true}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center text-primary underline hover:text-primary/80 transition"
  >
    <Globe className="w-4 h-4 mr-1" /> Download APK
  </a>
  <span className="hidden sm:inline mx-1">|</span>

  {/* Google Play - disabled */}
  <span className="flex items-center text-muted-foreground cursor-not-allowed">
    <Play className="w-4 h-4 mr-1" /> Google Play (Coming soon)
  </span>

  <span className="hidden sm:inline mx-1">|</span>

  {/* iOS - coming soon */}
  <span className="flex items-center text-muted-foreground cursor-not-allowed">
    <Apple className="w-4 h-4 mr-1" /> iOS (Coming soon)
  </span>



  {/* Website APK download - enabled */}
 
</div>

              {/* Waitlist */}
              <section className="py-4 px-4 max-w-xl mx-auto text-center" id="waitlist">
                <h2 className="text-md font-semibold mb-2">Join the Cause</h2>
<p className="text-muted-foreground text-xs mb-3">
  Become a part of <span className="font-semibold ">Muktirath</span> — 
  a movement for freedom and unity. We are calling for passionate volunteers to walk with us 
  and contribute to this greater cause.
</p>


                {/* Progress Indicator */}
                <div className="mb-4 text-xs text-primary font-medium">
                  {count} / 10,000 Volunteers Registered — <span className="underline">Be one now!</span>
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
                      <Button type="submit" disabled={loading} className="bg-pink-950">
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
