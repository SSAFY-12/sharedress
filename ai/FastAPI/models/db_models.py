from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

from config import DATABASE_URL

Base = declarative_base()

class Category(Base):
    __tablename__ = 'Category'

    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(255), nullable=False)

    # Relationship
    clothes = relationship("Clothes", back_populates="category")

class Color(Base):
    __tablename__ = 'Color'

    color_id = Column(Integer, primary_key=True)
    color_name = Column(String(255), nullable=False)
    color_hex = Column(String(7), nullable=False)  # Format: #RRGGBB

    # Relationship
    clothes = relationship("Clothes", back_populates="color")

class Clothes(Base):
    __tablename__ = 'Clothes'

    clothes_id = Column(Integer, primary_key=True, autoincrement=True)
    image_uri = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=False)
    color_id = Column(Integer, ForeignKey('Color.color_id'), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="clothes")
    color = relationship("Color", back_populates="clothes")

# Initialize database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)