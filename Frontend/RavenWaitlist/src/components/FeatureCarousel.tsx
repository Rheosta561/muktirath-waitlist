import { Swiper, SwiperSlide } from "swiper/react"


const features = [
  "Match Gym Buddies by Goals",
  "QR Code for Streaks",
  "Preacher Rank Leaderboard",
  "Trainer Discovery",
  "Reward-Based Challenges",
]

export default function FeaturesCarousel() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-10">App Features</h2>
      <Swiper slidesPerView={1.2} spaceBetween={20} centeredSlides loop>
        {features.map((feature, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">{feature}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
