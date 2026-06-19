from fastapi import APIRouter

router = APIRouter(prefix="/api/calculators", tags=["calculators"])

TREATMENTS = [
    {
        "id": "bacterial_blight",
        "name": "Bacterial Blight (Telya)",
        "water_per_acre_liters": 200,
        "chemicals": [
            {
                "name": "Streptocycline",
                "dosage_per_liter": "0.5g",
                "total_per_acre": "100g"
            },
            {
                "name": "Copper Oxychloride (Bordeaux Mixture)",
                "dosage_per_liter": "2.5g",
                "total_per_acre": "500g"
            }
        ],
        "instructions": "Mix both chemicals thoroughly in water. Spray evenly over foliage. Avoid spraying during peak sunlight hours."
    },
    {
        "id": "anthracnose",
        "name": "Anthracnose",
        "water_per_acre_liters": 200,
        "chemicals": [
            {
                "name": "Propiconazole 25% EC",
                "dosage_per_liter": "1ml",
                "total_per_acre": "200ml"
            }
        ],
        "instructions": "Spray at the first sign of symptoms. Repeat after 10-15 days if necessary."
    },
    {
        "id": "alternaria_fruit_spot",
        "name": "Alternaria Fruit Spot",
        "water_per_acre_liters": 200,
        "chemicals": [
            {
                "name": "Mancozeb 75% WP",
                "dosage_per_liter": "2.5g",
                "total_per_acre": "500g"
            }
        ],
        "instructions": "Apply uniformly on the crop canopy. Ensure complete coverage of the fruit surface."
    },
    {
        "id": "cercospora_fruit_spot",
        "name": "Cercospora Fruit Spot",
        "water_per_acre_liters": 200,
        "chemicals": [
            {
                "name": "Chlorothalonil 75% WP",
                "dosage_per_liter": "2g",
                "total_per_acre": "400g"
            }
        ],
        "instructions": "Preventative spray is highly effective. Spray during cool morning or evening hours."
    }
]

@router.get("/treatments")
async def get_treatments():
    return TREATMENTS
