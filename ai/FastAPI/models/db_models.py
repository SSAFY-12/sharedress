# models/db_models.py
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

from config import DATABASE_URL  # 예: "mysql+pymysql://user:pwd@host:3306/db"

Base = declarative_base()


# ───────────────────────────────────────────
# Table models  (소문자 테이블, id 컬럼)
# ───────────────────────────────────────────
class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), nullable=False)

    clothes = relationship("Clothes", back_populates="category")


class Color(Base):
    __tablename__ = "color"

    id = Column(Integer, primary_key=True, autoincrement=True)
    color_hex = Column(String(7), nullable=False)
    color_name = Column(String(255), nullable=False)

    clothes = relationship("Clothes", back_populates="color")


class Clothes(Base):
    __tablename__ = "clothes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    image_uri = Column(String(1024), nullable=False)

    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    color_id = Column(Integer, ForeignKey("color.id"), nullable=False)

    category = relationship("Category", back_populates="clothes")
    color = relationship("Color", back_populates="clothes")


# ───────────────────────────────────────────
# Session maker
# ───────────────────────────────────────────
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
