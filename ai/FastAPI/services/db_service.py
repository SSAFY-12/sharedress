# services/db_service.py
import logging
from sqlalchemy.orm import Session

from models.db_models import Clothes, Category, Color, get_db

logger = logging.getLogger(__name__)


class DBService:
    def __init__(self):
        self.db: Session = next(get_db())

    # -----------------------------------------------------------
    # Clothes CREATE
    # -----------------------------------------------------------
    def create_clothes_record(self, image_uri: str, category_id: int, color_id: int) -> int | None:
        try:
            new_item = Clothes(
                image_uri=image_uri,
                category_id=category_id,
                color_id=color_id,
            )
            self.db.add(new_item)
            self.db.commit()
            self.db.refresh(new_item)

            logger.info(f"Clothes row inserted (id={new_item.id})")
            return new_item.id

        except Exception as e:
            self.db.rollback()
            logger.error(f"Clothes insert failed: {e}")
            return None

    # -----------------------------------------------------------
    # Look-ups
    # -----------------------------------------------------------
    def get_category_id_by_name(self, name: str) -> int | None:
        try:
            c = self.db.query(Category).filter(Category.category_name == name).first()
            return c.id if c else None
        except Exception as e:
            logger.error(f"Category lookup error: {e}")
            return None

    def get_category_name(self, category_id: int) -> str | None:
        try:
            c = self.db.query(Category).filter(Category.id == category_id).first()
            return c.category_name if c else None
        except Exception as e:
            logger.error(f"Category name lookup error: {e}")
            return None

    def get_color_name(self, color_id: int) -> str | None:
        try:
            c = self.db.query(Color).filter(Color.id == color_id).first()
            return c.color_name if c else None
        except Exception as e:
            logger.error(f"Color name lookup error: {e}")
            return None

    # -----------------------------------------------------------
    # Color HEX 업데이트
    # -----------------------------------------------------------
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
