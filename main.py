from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.main import router as apiRouter
from admin.main import router as adminRouter
from V2.api.main import router as apiRouterV2
from V2.admin.main import router as adminRouterV2
from fastapi.staticfiles import StaticFiles

# testing git
app = FastAPI()
app.mount("/uploads", StaticFiles(directory="upload_file"), name="uploads")

origins = [
    "*",
]

if __name__ == "__main__":
   uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(apiRouter)
app.include_router(adminRouter)

# 01/02/2025
app.include_router(apiRouterV2, prefix="/v2/api")
app.include_router(adminRouterV2, prefix="/v2/admin")



@app.get('/')
def index():
    return "Welcome to the billing app"