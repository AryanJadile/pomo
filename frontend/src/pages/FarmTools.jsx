import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Droplets, Sprout, TestTube, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTreatments } from "@/services/api"
import { toast } from "sonner"

export default function FarmTools() {
  const [treatments, setTreatments] = useState([])
  const [selectedDisease, setSelectedDisease] = useState("")
  const [acres, setAcres] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const data = await getTreatments()
        setTreatments(data)
        if (data.length > 0) {
          setSelectedDisease(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching treatments:", error)
        toast.error("Failed to load treatments data.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTreatments()
  }, [])

  const selectedData = treatments.find(t => t.id === selectedDisease)

  // Helper to multiply strings like "500g" or "1ml"
  const multiplyDosage = (dosageStr, multiplier) => {
    const match = dosageStr.match(/([\d.]+)([a-zA-Z]+)/)
    if (!match) return dosageStr
    const value = parseFloat(match[1])
    const unit = match[2]
    const total = value * multiplier
    // Format nicely
    return `${total % 1 !== 0 ? total.toFixed(1) : total}${unit}`
  }

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Farm Tools</h1>
          <p className="text-muted-foreground leading-relaxed">Calculate exact pesticide and fertilizer requirements for your orchard based on farm size.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Input Form */}
            <Card className="shadow-sm border-border h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-primary" />
                  Farm Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Target Disease</label>
                  <select 
                    value={selectedDisease} 
                    onChange={e => setSelectedDisease(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {treatments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground pt-1">Select the disease detected in your recent scan.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Farm Area (Acres)</label>
                  <input 
                    type="number" 
                    min="0.1" 
                    step="0.1"
                    value={acres} 
                    onChange={e => setAcres(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <p className="text-xs text-muted-foreground pt-1">How much area are you planning to spray?</p>
                </div>

              </CardContent>
            </Card>

            {/* Results Output */}
            {selectedData && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <Card className="shadow-md border-primary/20 bg-primary/5 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <TestTube className="h-5 w-5" />
                      Treatment Plan
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 relative z-10">
                    <div className="p-4 bg-background border rounded-lg shadow-sm">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Base Mixture
                      </h3>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-foreground">Clean Water</span>
                        <span className="font-bold text-blue-600 text-lg">{selectedData.water_per_acre_liters * acres} Liters</span>
                      </div>
                      <p className="text-xs text-muted-foreground border-t pt-2 mt-2">Required base volume for {acres} acre(s).</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Required Chemicals</h3>
                      {selectedData.chemicals.map((chem, idx) => (
                        <div key={idx} className="flex flex-col p-3 border border-border/50 bg-card rounded-md">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-foreground">{chem.name}</span>
                            <span className="font-bold text-primary">{multiplyDosage(chem.total_per_acre, acres)}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Concentration: {chem.dosage_per_liter} / Liter</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-lg">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2">Agronomic Advisory</h4>
                      <p className="text-sm text-emerald-900 dark:text-emerald-100/90 font-medium">
                        {selectedData.instructions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
