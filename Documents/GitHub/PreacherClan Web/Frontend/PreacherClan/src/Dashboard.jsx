import React, { useRef, useState , useEffect } from "react";
import bg from "./assets/bg.jpg";
import PromoCard from "./Components/PromoCard";

import search from "./assets/search.png";
import SearchResult from "./Components/SearchResult";
import BottomRow from "./Components/bottomRow";
import GymInfoCard from "./Components/GymInfoCard";
import AdviceCard from "./Components/AdviceCard";
import ProfileCard from "./Components/ProfileCard";

function Dashboard() {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
function getYouTubeEmbedUrl(videoUrl, autoplay = false) {
  try {
    const url = new URL(videoUrl);
    const videoId =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v");

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return autoplay ? `${embedUrl}?autoplay=1&mute=1` : embedUrl;
  } catch {
    return null;
  }
}


    
    // Sample gym data
    const gyms = [
        { name: "Pack Physique", city: "Delhi", country: "India", image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600" },
        { name: "Anytime Fitness", city: "Delhi", country: "India", image: "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Gold's Gym", city: "Mumbai", country: "India", image: "https://images.pexels.com/photos/136404/pexels-photo-136404.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { name: "Muscle Factory", city: "Bangalore", country: "India", image: "https://images.pexels.com/photos/1638326/pexels-photo-1638326.jpeg?auto=compress&cs=tinysrgb&w=800" }
    ];

    // Filter gyms based on search query
    const filteredGyms = gyms.filter(gym => 
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.clientWidth;
            const index = Math.round(scrollLeft / width);
            setActiveIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({
                left: index * width,
                behavior: "smooth",
            });
        }
    };
    const promoCards = [
  {
    title: "Top Preacher",
    shortDesc: "John holds the highest preacher score ever recorded.",
    longDesc: "The Top Preacher title is awarded to the strongest warrior in the Preacher Clan—dominating the leaderboard with sheer will and deadlifts.",
    image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=1400&auto=format&fit=crop&q=60"
  },
  {
    title: "Top Clan",
    shortDesc: "Pack Physique leads the charge with the most active preachers.",
    longDesc: "Top Clan is the gym with the most warriors dedicated to the preacher creed. It's where steel meets loyalty.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&auto=format&fit=crop&q=60"
  },
  {
    title: "Warrior’s Whisper",
    shortDesc: "Your iron circle, now connected—talk, train, grow.",
    longDesc: "We're introducing real-time chat so you can bond with your clan, trainers, and gym buddies right from the app.",
    image: "https://media.istockphoto.com/id/475447076/photo/two-young-men-talking-to-each-other-in-health-club.jpg?s=612x612&w=0&k=20&c=mh3mTMhSzJYRiKOZML5JpL896dD84b8QY7lIrDCGZuE="
  }
];
useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % promoCards.length;
      scrollToIndex(nextIndex);
      return nextIndex;
    });
  }, 4000); // scroll every 4 seconds

  return () => clearInterval(interval); // cleanup on unmount
}, []);


    return (
        <div className="h-screen w-full relative bg-zinc-950">
            {/* <img src={bg} className="h-full w-full absolute inset-0 brightness-50 opacity-80" alt="" /> */}
            <div className="h-screen overflow-y-scroll relative p-6 text-white">
                <p className="text-2xl font-semibold"></p>
                <p className="text-zinc-300 text-sm mt-2 mb-4 font-light opacity-0">
                    Welcome to Preacher Clan -- where iron is our altar, strength our creed, and glory our fate!
                </p>

                {/* Promo Section */}
                <div className="w-full h-60 md:h-80 p-3 rounded-lg bg-[#0a0a0ad0] border-zinc-900 border">
                   <div 
  ref={scrollRef}
  className="w-full h-5/6 flex rounded-lg bg-zinc-950 overflow-x-scroll scroll-smooth snap-x snap-mandatory scrollbar-hide"
  onScroll={handleScroll}
>
  {promoCards.map((card, index) => (
    <div key={index} className="flex w-full  flex-shrink-0 snap-center pr-2">
      <PromoCard
        title={card.title}
        shortDesc={card.shortDesc}
        longDesc={card.longDesc}
        image={card.image}
      />
    </div>
  ))}
</div>


                    {/* Scroll Indicators */}
                    <div className="flex justify-center mt-4 md:mt-6 gap-2">
                        {[0, 1, 2].map((index) => (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    activeIndex === index ? "bg-white" : "bg-gray-400"
                                }`}
                            ></button>
                        ))}
                    </div>
                </div>

                <br />
                <hr className="border-zinc-100 opacity-30 " />

                {/* Search Section */}
                <p className="mt-5 text-2xl font-semibold">Join The Clan</p>
                <p className="text-zinc-300 text-sm font-light">
                    Forge your legacy--train hard, conquer limits, and become one with the iron brotherhood!
                </p>

                <div className="h-fit w-full bg-[#00000037] border border-zinc-900 rounded-lg mt-2">
                    {/* Search Bar */}
                    <div className="h-12 w-full bg-[#0000006e] flex items-center gap-2 p-2 rounded-lg">
                        <div className="h-9 w-9 p-1">
                            <img src={search} alt="" className="h-full w-full invert" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Your Gym Here"
                            className="text-sm text-zinc-300 bg-transparent outline-none w-full placeholder:text-zinc-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>


                    {filteredGyms.length > 0 ? (
                        filteredGyms.map((gym, index) => (
                            <div key={index}>
                                <SearchResult name={gym.name} city={gym.city} country={gym.country} image={gym.image} />
                                {index < filteredGyms.length - 1 && (
                                    <hr className="w-1/2 md:w-5/6 mx-auto border-zinc-400 opacity-35" />
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-zinc-400 text-sm mt-4">No gyms found</p>
                    )}
                </div>

                <br />
               <hr className="border-zinc-100 opacity-30 " />
  <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory  mt-4 scrollbar-hide">
  <div className="flex gap-4 min-w-max">
    <GymInfoCard
      gym={{
        name: "Iron Paradise Gym",
        image: "https://images.unsplash.com/photo-1550345332-09e3ac987658",
        location: "Delhi, India",
        trainers: 12,
        equipments: [
          "Treadmills",
          "Sauna",
          "Steam Bath",
          "Dumbbells",
          "Crossfit Rig",
        ],
        fees: 1800,
        onJoin: () => alert("Welcome to Iron Paradise!"),
        featured: true,
        rating: 4.8,
      }}
    />
    <GymInfoCard
      gym={{
        name: "Beast Mode Fitness",
        image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",
        location: "Mumbai, India",
        trainers: 10,
        equipments: ["Cardio Zone", "Kettlebells", "TRX", "Steam", "Rowing Machine"],
        fees: 1500,
        onJoin: () => alert("Welcome to Beast Mode!"),
        featured: false,
        rating: 4.6,
      }}
    />
  </div>
</div>
 <br />
                <hr className="border-zinc-100 opacity-30 " />
<div className="overflow-x-auto flex gap-4  mt-4 snap-x snap-mandatory scroll-smooth scrollbar-hide">
  <div className="flex gap-4 min-w-max">
    <AdviceCard
      title="Stay Consistent"
      tip="Consistency beats intensity. Stick to your schedule even on low-energy days."
      videoUrl={getYouTubeEmbedUrl("https://youtu.be/md3W6KefCDc?si=TznVhJsUVWSDWR1c" , true)}

    />
    <AdviceCard
      title="Nutrition Matters"
      tip="Fuel your body with the right nutrients. A balanced diet is key to performance."
      videoUrl={getYouTubeEmbedUrl("https://youtu.be/ek5KVaswQQw?si=lm-inoKiPdlfNKs_", true)}
    />
    <AdviceCard
  title="Top Back Exercises"
  tip="Include heavy compounds like barbell deadlift and wide‑grip pull‑ups, plus mid‑back moves like T-bar or cable row for optimal development." 
  videoUrl={getYouTubeEmbedUrl("https://www.youtube.com/watch?v=jLvqKgW-_G8", true)}
/>

  </div>
</div>
 <br />
                <hr className="border-zinc-100 opacity-30 " />
                <div className="overflow-x-auto flex gap-4 snap-mandatory scroll-smooth scrollbar-hide">
                    <div className="flex gap-4 min-w-max">
                                        <ProfileCard
  profile={{
    name: "Aarav Singh",
    age: 26,
    goal: "Build Muscle",
    time: "6:00 AM - 8:00 AM",
    tags: ["hypertrophy", "discipline", "early riser", "creatine"],
    image: "https://images.unsplash.com/photo-1676491167770-bce474fe0024?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2FycmlvcnxlbnwwfHwwfHx8MA%3D%3D",
    preacherRank: "Elite Preacher",
    isVerified: true,
  }}
  onRequest={() => alert("Request sent to Aarav! 🏋️‍♂️")}
/>
                        <ProfileCard
                            profile={{
                                name: "Jane Smith",
                                age: 28,
                                goal: "Weight Loss",
                                time: "6:00 AM - 8:00 AM",
                                tags: ["cardio", "HIIT", "dedicated", "healthy"],
                                image: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGF0aGxldGV8ZW58MHx8MHx8fDA%3D",
                                preacherRank: "Elite Preacher",
                                isVerified: true,
                            }}
                            onRequest={() => alert("Request sent to Jane! 🏃‍♀️")}
                        />
                    </div>
                </div>

                <div className="h-20 "></div>




               
               



               


            </div>
            <BottomRow/>
            
        </div>
    );
}

export default Dashboard;
