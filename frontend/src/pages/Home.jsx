import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Sun, ArrowRight, Microscope, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "12,000+", label: "Fruits Analysed" },
  { value: "99.5%", label: "Detection Accuracy" },
  { value: "5", label: "Disease Categories" },
  { value: "3", label: "Districts Covered" },
]

const features = [
  {
    icon: <Microscope className="h-8 w-8 text-primary flex-shrink-0" />,
    title: "Disease Detection",
    description: "EfficientNetB0 classifies 5 disease categories with 99.5% accuracy.",
  },
  {
    icon: <Database className="h-8 w-8 text-primary flex-shrink-0" />,
    title: "Nutritional Inference",
    description: "OWL/RDF ontology maps disease severity to internal phytochemical state.",
  },
  {
    icon: <Sun className="h-8 w-8 text-primary flex-shrink-0" />,
    title: "Environmental Intelligence",
    description: "Real-time UV, humidity, and temperature stress scoring.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#8B1A1A] to-[#2D6A4F] py-32 lg:py-48">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="container relative z-10 px-4 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Know your fruit.<br />
              <span className="text-white/90 font-light">Before you open it.</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed font-medium"
          >
            PomeGuard uses AI-powered computer vision and phytochemical reasoning to detect disease and estimate nutritional quality — without cutting the fruit open.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/analyse">
              <Button size="lg" className="rounded-full bg-white text-[#8B1A1A] hover:bg-gray-100 h-14 px-8 text-lg font-bold shadow-xl transition-transform hover:scale-105">
                Analyse a Fruit Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border py-8 shadow-sm relative z-20 -mt-10 mx-4 md:mx-auto md:max-w-5xl rounded-2xl">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x divide-border/50">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center space-y-1"
              >
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background flex-1">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-6 p-4 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
