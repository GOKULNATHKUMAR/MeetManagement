from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, intake, sales, expenses, reports, admin

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Chicken Shop Management API",
    description="API for managing chicken shop operations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(intake.router, prefix="/api/intake", tags=["Chicken Intake"])
app.include_router(sales.router, prefix="/api/sales", tags=["Chicken Sales"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Chicken Shop Management API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}