import { motion } from "framer-motion"
import { Camera, Cpu, Network, FileText } from "lucide-react"

const stages = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Image Capture",
    description: "Photograph your Bhagwa pomegranate at 30cm distance under natural light. This non-destructive visual signal serves as the entire foundation of the analysis.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "AI Classification",
    description: "Our EfficientNetB0 vision model identifies the disease type and severity across 5 bespoke categories trained specifically on Solapur orchard data.",
  },
  {
    icon: <Network className="h-6 w-6" />,
    title: "Ontology Reasoning",
    description: "An OWL/RDF knowledge base infers the internal phytochemical concentrations (Anthocyanins, Punicalagins) from the external visual damage marks.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Scorecard Generation",
    description: "LangGraph agents synthesise a full Nutritional & Health Scorecard along with targeted agronomic advisory for the farmer.",
  },
]

export default function HowItWorks() {
  return (
    <div className="container max-w-4xl py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">How PomeGuard Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Understanding the invisible logic behind Maharashtra's leading non-destructive quality assessment.
        </p>
      </div>

      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {stages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm z-10 shrink-0 md:order-1 md:hidden">
              {stage.icon}
            </div>
            
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full border-4 border-background bg-primary/10 text-primary shadow-sm z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
               {stage.icon}
            </div>

            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-card border shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-xl font-bold mb-2 text-foreground">{stage.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{stage.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 pt-12 border-t text-center space-y-8">
        <h2 className="text-2xl font-bold">Powered by Modern Technology</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Python", "EfficientNetB0", "OWL/RDF", "LangGraph", "FastAPI", "React", "Zustand"].map((tech) => (
            <span key={tech} className="px-4 py-2 rounded-full border bg-muted/30 text-sm font-medium text-foreground">
              {tech}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground mx-auto pt-4 leading-relaxed max-w-3xl">
          Bhagwa pomegranate cultivation in Maharashtra drives significant agricultural export value. Non-destructive quality assessment prevents millions in lost revenue by ensuring accurate grading without sacrificing the crop.
        </p>
      </div>
    </div>
  )
}
