import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, CheckCircle2, Download, RefreshCw, Leaf, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { classifyFruit, submitEnvMetadata, runOntologyInference, uploadMedia, saveScan } from "@/services/api"
import { toast } from "sonner"

export default function Analyse() {
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mediaInfo, setMediaInfo] = useState(null)
  const navigate = useNavigate()
  
  const [isClassifying, setIsClassifying] = useState(false)
  const [diseaseData, setDiseaseData] = useState(null)

  const [envParams, setEnvParams] = useState({ uv_irradiance: 800, humidity: 60, temperature: 25 })
  const [isSubmittingEnv, setIsSubmittingEnv] = useState(false)
  const [envData, setEnvData] = useState(null)
  const [location, setLocation] = useState(null)

  const [isInferring, setIsInferring] = useState(false)
  const [nutritionData, setNutritionData] = useState(null)

  const [isFetchingWeather, setIsFetchingWeather] = useState(false)
  const [weatherError, setWeatherError] = useState(null)

  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const detectLocation = () => {
    setIsFetchingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsFetchingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        setIsFetchingLocation(false)
      },
      (error) => {
        setLocationError("Location access denied or unavailable.")
        setIsFetchingLocation(false)
      }
    )
  }

  const autoFetchWeather = () => {
    setIsFetchingWeather(true)
    setWeatherError(null)

    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported by your browser")
      setIsFetchingWeather(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,shortwave_radiation&timezone=auto`)
          const data = await res.json()
          
          if (data?.current) {
            setEnvParams(prev => ({
              ...prev,
              temperature: data.current.temperature_2m,
              humidity: data.current.relative_humidity_2m,
              uv_irradiance: Math.round(data.current.shortwave_radiation)
            }))
          } else {
            setWeatherError("Failed to parse weather data")
          }
        } catch (err) {
          setWeatherError("Failed to fetch weather data")
          console.error(err)
        } finally {
          setIsFetchingWeather(false)
        }
      },
      (error) => {
        setWeatherError("Location access denied or unavailable.")
        setIsFetchingWeather(false)
      }
    )
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    
    setIsClassifying(true)
    try {
      const uploadRes = await uploadMedia(file)
      setMediaInfo(uploadRes)
      
      const result = await classifyFruit(file)
      setDiseaseData(result)
    } catch (err) {
      console.error(err)
      toast.error("Failed to process or upload image.")
    } finally {
      setIsClassifying(false)
    }
  }

  const handleEnvSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingEnv(true)
    try {
      const result = await submitEnvMetadata({
        uv_irradiance: Number(envParams.uv_irradiance),
        humidity: Number(envParams.humidity),
        temperature: Number(envParams.temperature),
      })
      setEnvData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmittingEnv(false)
    }
  }

  const handleFullAnalysis = async () => {
    if (!diseaseData || !envData || !mediaInfo) return
    setIsInferring(true)
    try {
      const nutritionRes = await runOntologyInference({
        disease: diseaseData.disease,
        severity: diseaseData.severity,
        stress_factors: envData.stress_factors,
      })
      setNutritionData(nutritionRes)
      
      const fullResult = {
        disease: diseaseData.disease,
        severity: diseaseData.severity,
        nutrition: nutritionRes,
        environment: envData
      }
      
      const savedScan = await saveScan({
        scan_type: "disease_detection",
        media_url: mediaInfo.url,
        public_id: mediaInfo.publicId,
        media_type: mediaInfo.mediaType,
        input_data: {
          ...envParams,
          ...(location ? { latitude: location.latitude, longitude: location.longitude } : {})
        },
        result: fullResult,
        confidence_score: diseaseData.confidence
      })
      
      toast.success("Analysis complete and saved.")
      setTimeout(() => navigate(`/history`), 2000)
      
    } catch (err) {
      console.error(err)
      toast.error("Failed to run pipeline or save.")
    } finally {
      setIsInferring(false)
    }
  }

  const resetAll = () => {
    setImageFile(null)
    setPreview(null)
    setDiseaseData(null)
    setEnvData(null)
    setNutritionData(null)
  }

  const canRunAnalysis = diseaseData && envData
  const isFinished = nutritionData !== null

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Left Panel */}
        <div className="w-full md:w-5/12 space-y-8 flex flex-col no-print">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Fruit Analysis</h1>
            <p className="text-muted-foreground leading-relaxed">Upload an image and provide environmental factors to generate a holistic nutritional scorecard.</p>
          </div>

          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3"><CardTitle>1. Visual Upload</CardTitle></CardHeader>
            <CardContent>
              <label className={`relative overflow-hidden flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${preview ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'}`}>
                <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
                {preview ? (
                  <div className="flex flex-col items-center space-y-4">
                    <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-sm" />
                    <div className="text-sm font-medium text-center">
                      <p className="text-foreground max-w-[200px] truncate">{imageFile?.name}</p>
                      <p className="text-muted-foreground">{(imageFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-background rounded-full text-primary border shadow-sm"><UploadCloud className="h-8 w-8" /></div>
                    <div>
                      <p className="font-semibold text-foreground">Drag your fruit image here</p>
                      <p className="text-sm text-muted-foreground pt-1">or click to browse (JPG, PNG, WEBP)</p>
                    </div>
                  </div>
                )}
                {isClassifying && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 transition-all">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm font-medium animate-pulse text-foreground">Classifying disease...</p>
                  </div>
                )}
              </label>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3"><CardTitle>2. Environmental Metadata</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleEnvSubmit} className="space-y-5">
                <div className="flex flex-col gap-2 bg-muted/40 p-3 rounded-lg border border-border/50">
                  <span className="text-xs font-medium text-muted-foreground hidden sm:block">Use sensors to fetch your environment data, or just tag your location.</span>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={detectLocation} disabled={isFetchingLocation || location} className="h-7 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary transition-all rounded-full px-3 overflow-hidden">
                      {isFetchingLocation ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <MapPin className="h-3 w-3 mr-1.5" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{location ? "Tagged" : "Tag Location"}</span>
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={autoFetchWeather} disabled={isFetchingWeather} className="h-7 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary transition-all rounded-full px-3">
                      {isFetchingWeather ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <RefreshCw className="h-3 w-3 mr-1.5" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{isFetchingWeather ? "Fetching..." : "Fetch Weather"}</span>
                    </Button>
                  </div>
                </div>
                {location && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1.5 rounded border border-emerald-100 dark:border-emerald-800/50 mt-2 mb-1">
                    <MapPin className="h-3 w-3" />
                    Location captured for Hotspot Map
                  </div>
                )}
                {weatherError && <p className="text-destructive text-xs font-medium px-1 mt-1 -mb-2">{weatherError}</p>}
                {locationError && <p className="text-destructive text-xs font-medium px-1 mt-1 -mb-2">{locationError}</p>}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solar Rad (W/m²)</label>
                    <input type="number" min="0" max="1400" required value={envParams.uv_irradiance} onChange={e => setEnvParams({...envParams, uv_irradiance: e.target.value})} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Humidity (%)</label>
                    <input type="number" min="0" max="100" required value={envParams.humidity} onChange={e => setEnvParams({...envParams, humidity: e.target.value})} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Temp (°C)</label>
                    <input type="number" min="0" max="60" required value={envParams.temperature} onChange={e => setEnvParams({...envParams, temperature: e.target.value})} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmittingEnv} variant={envData ? "secondary" : "default"} className="w-full h-11 relative overflow-hidden transition-all">
                  {isSubmittingEnv ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : (envData ? "Update Metadata" : "Submit Environmental Data")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className={`shadow-sm transition-all duration-300 ${canRunAnalysis ? 'border-primary shadow-primary/20 bg-primary/5' : 'border-border bg-card opacity-70'}`}>
            <CardContent className="p-6">
              <Button 
                onClick={handleFullAnalysis} 
                disabled={!canRunAnalysis || isInferring || isFinished} 
                className="w-full h-14 text-lg font-bold shadow-lg"
              >
                {isInferring ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : "Run Full Analysis"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-7/12 flex flex-col justify-start">
          <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm flex-1 print:border-none print:shadow-none print:p-0 relative overflow-hidden min-h-[600px]">
            
            {!diseaseData && !envData ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-8 text-muted-foreground opacity-60">
                <Leaf className="h-24 w-24 mb-4 text-border" />
                <p className="text-xl font-medium text-foreground">Awaiting Parameters</p>
                <p className="text-sm max-w-sm">The analysis results will systematically populate here as the PomeGuard pipeline executes.</p>
              </motion.div>
            ) : null}

            <div className="space-y-6 relative z-10 print:space-y-8 h-full flex flex-col">
              <AnimatePresence>
                {/* Card 1: Disease */}
                {diseaseData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 border-b pb-2">1. Visual Disease Detection</h3>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted">
                        <img src={diseaseData.image_url} alt="Fruit crop" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-xl text-foreground">{diseaseData.disease.replace(/_/g, " ")}</p>
                            <p className="text-sm text-muted-foreground font-medium">Confidence: {diseaseData.confidence}%</p>
                          </div>
                          <Badge variant={diseaseData.severity === "None" ? "success" : diseaseData.severity === "Severe" ? "destructive" : "warning"} className="text-sm py-1">{diseaseData.severity} Severity</Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${diseaseData.confidence}%` }} transition={{ duration: 1, ease: "easeOut" }} className="bg-primary h-full rounded-full"></motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card 2: Env */}
                {envData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 border-b pb-2">2. Environmental Stress Profiles</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col border rounded-lg p-3 text-center bg-card">
                        <span className="text-xs text-muted-foreground font-medium mb-1">Solar Radiation</span>
                        <span className="font-bold text-xl text-foreground mb-2">{envParams.uv_irradiance}</span>
                        <Badge variant={envData.uv_stress_level === "High" ? "destructive" : "success"} className="mx-auto uppercase tracking-wide text-[10px] sm:w-full justify-center">{envData.uv_stress_level}</Badge>
                      </div>
                      <div className="flex flex-col border rounded-lg p-3 text-center bg-card">
                        <span className="text-xs text-muted-foreground font-medium mb-1">Humidity</span>
                        <span className="font-bold text-xl text-foreground mb-2">{envParams.humidity}%</span>
                        <Badge variant={envData.humidity_stress_level === "High" ? "destructive" : "success"} className="mx-auto uppercase tracking-wide text-[10px] sm:w-full justify-center">{envData.humidity_stress_level}</Badge>
                      </div>
                      <div className="flex flex-col border rounded-lg p-3 text-center bg-card">
                        <span className="text-xs text-muted-foreground font-medium mb-1">Temperature</span>
                        <span className="font-bold text-xl text-foreground mb-2">{envParams.temperature}°C</span>
                        <Badge variant={envData.temp_stress_level === "High" ? "destructive" : "success"} className="mx-auto uppercase tracking-wide text-[10px] sm:w-full justify-center">{envData.temp_stress_level}</Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground bg-muted/30 p-4 rounded-lg border-l-4 border-primary/50 flex">
                      <span className="flex-1">{envData.stress_factors.join(", ")} — moderating structural and phytochemical stability.</span>
                    </p>
                  </motion.div>
                )}

                {/* Card 3: Scorecard */}
                {nutritionData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 border rounded-xl bg-background shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row gap-8 items-center border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md">
                          <circle cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted/50" />
                          <motion.circle 
                            cx="72" cy="72" r="64" fill="transparent" stroke="currentColor" strokeWidth="12" 
                            strokeLinecap="round"
                            strokeDasharray={402.12} 
                            initial={{ strokeDashoffset: 402.12 }}
                            animate={{ strokeDashoffset: 402.12 - (402.12 * nutritionData.nutritional_score / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                            className={nutritionData.nutritional_score >= 80 ? "text-brand-success" : nutritionData.nutritional_score >= 60 ? "text-amber-500" : "text-destructive"} 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-extrabold tracking-tighter text-foreground">{nutritionData.nutritional_score}</span>
                          <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1">Score</span>
                        </div>
                      </div>
                      <Badge className="mt-5 px-4 py-1.5 text-sm uppercase tracking-wider" variant={nutritionData.nutritional_score >= 80 ? "success" : nutritionData.nutritional_score >= 60 ? "warning" : "destructive"}>
                        {nutritionData.quality_tier} Tier
                      </Badge>
                    </div>
                    
                    <div className="flex-1 w-full space-y-6">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">3. Nutritional & Health Scorecard</h3>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-foreground">Anthocyanins</span><span className="font-bold text-foreground">{nutritionData.anthocyanins} mg/100g</span></div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionData.anthocyanins / 20)*100)}%` }} transition={{ duration: 1, delay: 0.5 }} className="bg-gradient-to-r from-[#5B2C6F] to-[#8E44AD] h-full rounded-full"></motion.div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-foreground">Punicalagins</span><span className="font-bold text-foreground">{nutritionData.punicalagins} mg/100g</span></div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionData.punicalagins / 200)*100)}%` }} transition={{ duration: 1, delay: 0.6 }} className="bg-gradient-to-r from-[#8B1A1A] to-[#C0392B] h-full rounded-full"></motion.div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-foreground">Ellagic Acid</span><span className="font-bold text-foreground">{nutritionData.ellagic_acid} mg/100g</span></div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (nutritionData.ellagic_acid / 15)*100)}%` }} transition={{ duration: 1, delay: 0.7 }} className="bg-gradient-to-r from-[#D35400] to-[#E67E22] h-full rounded-full"></motion.div></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card 4: Advisory */}
                {nutritionData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="px-6 py-5 border rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm flex gap-4 mt-6 print:bg-white print:border-gray-300 print:text-black">
                    <Leaf className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-2 text-foreground">
                      <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Agronomic Advisory</h3>
                      <ul className="text-sm space-y-2 list-disc list-outside ml-4 text-emerald-900 dark:text-emerald-100/90 font-medium">
                        {diseaseData.disease !== "Healthy" && <li>Apply targeted bactericide or fungicide mapping to {diseaseData.disease.replace(/_/g, " ")} immediately. Avoid systemic sprays before harvest.</li>}
                        {envData.uv_stress_level === "High" && <li>Deploy sunburn protection nets or kaolin clay spray to reduce UV stress affecting surface Anthocyanin stability.</li>}
                        <li>Harvest grading class should be adjusted to <strong>{nutritionData.quality_tier}</strong> to match the inferred interior chemical composition.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              {isFinished && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex justify-end gap-4 mt-auto pt-6 no-print">
                  <Button variant="outline" size="lg" onClick={() => window.print()} className="font-semibold shadow-sm"><Download className="h-4 w-4 mr-2" /> Download Report</Button>
                  <Button onClick={resetAll} size="lg" className="font-semibold shadow-sm"><RefreshCw className="h-4 w-4 mr-2" /> Analyse Another Fruit</Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
