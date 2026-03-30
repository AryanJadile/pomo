import google.generativeai as genai
import os

# Initialize the Gemini client - API Key must exist in .env
# We evaluate this at instantiation/runtime so the module loads correctly even if keys aren't added yet
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

def build_system_prompt(scan: dict) -> str:
    """Constructs the heavily contextualized system prompt string to ground the LLM"""
    
    # Safely pull nested data out to avoid KeyError strings tearing up the prompt
    fruit_name = scan.get('input_data', {}).get('fruit_name', 'Unknown Fruit')
    created_at = scan.get('created_at', 'Unknown Date')
    scan_type = scan.get('scan_type', 'Unknown')
    
    result_dict = scan.get('result', {})
    disease_name = result_dict.get('disease', 'Healthy — No Disease Detected')
    confidence = result_dict.get('confidence', 'N/A')
    severity = result_dict.get('severity', 'None')
    
    env = scan.get('input_data', {})
    uv = env.get('uv', 'N/A')
    hum = env.get('humidity', 'N/A')
    temp = env.get('temperature', 'N/A')
    
    phytochemicals = scan.get('result', {}).get('phytochemicals', [])
    phyto_str = "\n".join([
      f"- {c.get('name')}: {c.get('value')} {c.get('unit')} (Reference: {c.get('reference_range')})"
      for c in phytochemicals
    ]) if phytochemicals else "N/A"
    
    nut_score = scan.get('result', {}).get('nutritional_score', 'N/A')
    grade = scan.get('result', {}).get('quality_grade', 'N/A')
    advisory = scan.get('result', {}).get('advisory', 'No advisory available')

    return f"""You are PomeGuard AI Agronomist — an expert agricultural scientist 
specialising in fruit health diagnostics, phytochemistry, and 
precision agronomy. You are currently reviewing a completed fruit 
analysis report with the farmer or agronomist who submitted it.

Here is the full context of the analysis you are reviewing:

FRUIT ANALYSIS REPORT CONTEXT:
- Fruit Analysed: {fruit_name}
- Date of Analysis: {created_at}
- Scan Type: {scan_type}

DISEASE DETECTION RESULTS:
- Detected Condition: {disease_name}
- Confidence: {confidence}%
- Severity: {severity}

ENVIRONMENTAL CONDITIONS AT TIME OF ANALYSIS:
- UV Irradiance: {uv} W/m²
- Humidity: {hum}%
- Temperature: {temp}°C

PHYTOCHEMICAL PROFILE:
{phyto_str}

NUTRITIONAL SCORE: {nut_score} / 100
QUALITY GRADE: {grade}

AGRONOMIC ADVISORY FROM REPORT:
{advisory}

---

BEHAVIOUR RULES:
- Answer all questions strictly in the context of this specific 
  fruit analysis and the data above
- Be conversational but precise — explain results in plain language 
  a farmer can understand, not academic jargon
- If asked about the disease, explain it practically: what it is, 
  how serious it is given the confidence and severity, and what 
  the farmer should do
- If asked about phytochemicals, explain what each compound means 
  for the fruit's quality, shelf life, and human health benefit
- If asked what to do next, give specific advice derived from the 
  actual values above — never generic filler
- If the user asks something outside this analysis, respond:
  "I am here specifically to help you understand your PomeGuard 
  analysis results. Do you have any questions about your 
  {fruit_name} scan?"
- Never fabricate values or reference data not present above
- Keep responses to 3-5 sentences unless the user asks for more
- Do not use markdown in responses — plain conversational text only
---"""

async def stream_chat_message(system_prompt: str, history: list, user_message: str):
    """Async generator to stream response text natively from Gemini Flash 2.5"""
    model = genai.GenerativeModel(
        model_name="gemini-3-flash-preview",
        system_instruction=system_prompt
    )
    
    gemini_history = [
        {"role": msg["role"], "parts": [msg["content"]]}
        for msg in history
    ]
    
    chat = model.start_chat(history=gemini_history)
    response = chat.send_message(user_message, stream=True)
    
    for chunk in response:
        text = chunk.text
        if text:
            yield text
