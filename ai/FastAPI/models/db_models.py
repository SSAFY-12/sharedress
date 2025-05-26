from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.pool import Pool
from config import DATABASE_URL

Base = declarative_base()

# 연결 풀 이벤트 핸들러 추가
@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    """연결 체크아웃 시 연결 상태 확인 및 복구"""
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except Exception:
        # DB 연결이 끊어진 경우 재연결 시도
        connection_proxy._pool.dispose()
        # 다음 요청 시 새 연결 생성
        raise Exception("연결이 끊어졌습니다. 재시도해 주세요.")
    cursor.close()

# ─────────────── category ───────────────
class Category(Base):
    __tablename__ = "category"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), nullable=False)

    clothes = relationship("Clothes", back_populates="category")

# ─────────────── color ───────────────
class Color(Base):
    __tablename__ = "color"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    color_hex  = Column(String(7),  nullable=False)
    color_name = Column(String(255), nullable=False)

    clothes = relationship("Clothes", back_populates="color")

# ─────────────── clothes ───────────────
class Clothes(Base):
    __tablename__ = "clothes"

    id        = Column(Integer, primary_key=True, autoincrement=True)

    image_url = Column("image_url", String(1024), nullable=False)

    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    color_id    = Column(Integer, ForeignKey("color.id"),    nullable=False)

    category = relationship("Category", back_populates="clothes")
    color    = relationship("Color",    back_populates="clothes")

# ─────────────── 세션 (개선된 설정) ───────────────
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,         # 연결 사용 전에 ping 테스트
    pool_recycle=3600,          # 1시간마다 연결 갱신
    pool_size=10,               # 연결 풀 크기
    max_overflow=20,            # 최대 초과 연결 수
    pool_timeout=30,            # 연결 타임아웃
    echo=False                  # SQL 로깅 비활성화
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()