from sqlalchemy.orm import Session
import logging

from models.db_models import Clothes, Category, Color, get_db

logger = logging.getLogger(__name__)

class DBService:
    def __init__(self):
        """Initialize the database service"""
        self.db = next(get_db())

    def create_clothes_record(self, image_uri, category_id, color_id):
        """Create a new clothes record in the database"""
        try:
            # Create new clothes record
            clothes = Clothes(
                image_uri=image_uri,
                category_id=category_id,
                color_id=color_id
            )

            # Add to session and commit
            self.db.add(clothes)
            self.db.commit()
            self.db.refresh(clothes)

            logger.info(f"Created clothes record with ID: {clothes.clothes_id}")
            return clothes.clothes_id

        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to create clothes record: {e}")
            return None

    def get_category_id_by_name(self, category_name):
        """Get category ID from name, or default to 1 (tops) if not found"""
        try:
            category = self.db.query(Category).filter(Category.category_name == category_name).first()
            if category:
                return category.category_id

            # Map from our system categories to DB categories
            category_map = {
                "상의": 1,
                "아우터": 2,
                "하의": 3,
                "신발": 4,
                "악세사리": 5
            }

            if category_name in category_map:
                return category_map[category_name]

            # Default to tops
            return 1

        except Exception as e:
            logger.error(f"Failed to get category ID: {e}")
            return 1  # Default to tops

    def get_category_name(self, category_id):
        """Get category name from ID"""
        try:
            category = self.db.query(Category).filter(Category.category_id == category_id).first()
            if category:
                return category.category_name
            return "상의"  # Default to tops
        except Exception as e:
            logger.error(f"Failed to get category name: {e}")
            return "상의"  # Default to tops

    def get_color_name(self, color_id):
        """Get color name from ID"""
        try:
            color = self.db.query(Color).filter(Color.color_id == color_id).first()
            if color:
                return color.color_name
            return "블랙 웜"  # Default
        except Exception as e:
            logger.error(f"Failed to get color name: {e}")
            return "블랙 웜"  # Default

    def update_color_hex(self, color_id, color_hex):
        """Update the hex code for a color"""
        try:
            color = self.db.query(Color).filter(Color.color_id == color_id).first()
            if color:
                color.color_hex = color_hex
                self.db.commit()
                logger.info(f"Updated color hex for color ID {color_id} to {color_hex}")
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to update color hex: {e}")
            return False

    def close(self):
        """Close the database session"""
        self.db.close()