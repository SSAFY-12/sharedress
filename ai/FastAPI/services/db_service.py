# services/db_service.py
import logging
from sqlalchemy.orm import Session

from models.db_models import Clothes, Category, Color, get_db

logger = logging.getLogger(__name__)


class DBService:
    def __init__(self):
        self.db: Session = next(get_db())

    # ────────── INSERT ──────────
    def create_clothes_record(
            self, image_url: str, category_id: int, color_id: int
    ) -> int | None:
        try:
            row = Clothes(
                image_url=image_url,     # ← imageUrl 속성 사용
                category_id=category_id,
                color_id=color_id,
            )
            self.db.add(row)
            self.db.commit()
            self.db.refresh(row)

            logger.info("Clothes inserted (id=%s)", row.id)
            return row.id
        except Exception as e:
            self.db.rollback()
            logger.error("Clothes insert failed: %s", e)
            return None

    # -----------------------------------------------------------
    # Look-ups (재연결 로직 추가)
    # -----------------------------------------------------------
    def get_category_id_by_name(self, name: str) -> int | None:
        try:
            c = self.db.query(Category).filter(Category.category_name == name).first()
            return c.id if c else None
        except Exception as e:
            logger.error(f"Category lookup error: {e}")
            # DB 연결 오류 시 재연결 시도
            try:
                self.db.close()
                self.db = next(get_db())
                c = self.db.query(Category).filter(Category.category_name == name).first()
                return c.id if c else None
            except Exception as e2:
                logger.error(f"Category lookup retry failed: {e2}")
                return None

    def get_category_name(self, category_id: int) -> str | None:
        try:
            c = self.db.query(Category).filter(Category.id == category_id).first()
            return c.category_name if c else None
        except Exception as e:
            logger.error(f"Category name lookup error: {e}")
            # DB 연결 오류 시 재연결 시도
            try:
                self.db.close()
                self.db = next(get_db())
                c = self.db.query(Category).filter(Category.id == category_id).first()
                return c.category_name if c else None
            except Exception as e2:
                logger.error(f"Category name retry failed: {e2}")
                return None

    def get_color_name(self, color_id: int) -> str | None:
        try:
            c = self.db.query(Color).filter(Color.id == color_id).first()
            return c.color_name if c else None
        except Exception as e:
            logger.error(f"Color name lookup error: {e}")
            # DB 연결 오류 시 재연결 시도
            try:
                self.db.close()
                self.db = next(get_db())
                c = self.db.query(Color).filter(Color.id == color_id).first()
                return c.color_name if c else None
            except Exception as e2:
                logger.error(f"Color name retry failed: {e2}")
                return None

    # -----------------------------------------------------------
    # Color HEX 업데이트
    # -----------------------------------------------------------
    def update_clothes_record(self, clothes_id: int, image_url: str, category_id: int, color_id: int) -> bool:
        try:
            row = self.db.query(Clothes).filter(Clothes.id == clothes_id).first()
            if row:
                row.image_url = image_url
                row.category_id = category_id
                row.color_id = color_id
                self.db.commit()
                logger.info("Clothes updated (id=%s)", clothes_id)
                return True
            logger.warning("Clothes not found for update (id=%s)", clothes_id)
            return False
        except Exception as e:
            self.db.rollback()
            logger.error("Clothes update failed: %s", e)
            return False

    def update_color_hex(self, color_id: int, hex_code: str) -> bool:
        try:
            color = self.db.query(Color).filter(Color.id == color_id).first()
            if color:
                color.color_hex = hex_code
                self.db.commit()
                logger.info(f"Color(id={color_id}) hex updated → {hex_code}")
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Hex update error: {e}")
            return False
    # -----------------------------------------------------------
    def close(self):
        self.db.close()