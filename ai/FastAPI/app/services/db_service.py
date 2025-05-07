import pymysql
import asyncio
from typing import Dict, Any, List, Optional, Tuple

class DBService:
    def __init__(self, host: str, user: str, password: str, database: str, port: int = 3306):
        """데이터베이스 서비스 초기화"""
        self.db_config = {
            'host': host,
            'user': user,
            'password': password,
            'database': database,
            'port': port,
            'charset': 'utf8mb4',
            'cursorclass': pymysql.cursors.DictCursor
        }

    def _get_connection(self):
        """데이터베이스 연결 가져오기"""
        return pymysql.connect(**self.db_config)

    async def update_clothes(self, clothes_id: int, image_uri: str, color_id: int, category_id: int) -> bool:
        """Clothes 테이블 업데이트"""
        loop = asyncio.get_event_loop()

        try:
            # 비동기 함수에서 블로킹 DB 작업 실행
            return await loop.run_in_executor(
                None,
                self._update_clothes_sync,
                clothes_id, image_uri, color_id, category_id
            )
        except Exception as e:
            print(f"Error updating clothes: {str(e)}")
            return False

    def _update_clothes_sync(self, clothes_id: int, image_uri: str, color_id: int, category_id: int) -> bool:
        """동기 방식으로 Clothes 테이블 업데이트"""
        conn = None
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                UPDATE Clothes 
                SET image_uri = %s, color_id = %s, category_id = %s
                WHERE id = %s
                """
                cursor.execute(sql, (image_uri, color_id, category_id, clothes_id))
            conn.commit()
            return True
        except Exception as e:
            if conn:
                conn.rollback()
            print(f"Database error: {str(e)}")
            return False
        finally:
            if conn:
                conn.close()

    async def get_clothes(self, clothes_id: int) -> Optional[Dict[str, Any]]:
        """Clothes 가져오기"""
        loop = asyncio.get_event_loop()

        try:
            return await loop.run_in_executor(
                None,
                self._get_clothes_sync,
                clothes_id
            )
        except Exception as e:
            print(f"Error getting clothes: {str(e)}")
            return None

    def _get_clothes_sync(self, clothes_id: int) -> Optional[Dict[str, Any]]:
        """동기 방식으로 Clothes 가져오기"""
        conn = None
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                SELECT * FROM Clothes WHERE id = %s
                """
                cursor.execute(sql, (clothes_id,))
                result = cursor.fetchone()
                return result
        except Exception as e:
            print(f"Database error: {str(e)}")
            return None
        finally:
            if conn:
                conn.close()

    async def get_color(self, color_id: int) -> Optional[Dict[str, Any]]:
        """Color 가져오기"""
        loop = asyncio.get_event_loop()

        try:
            return await loop.run_in_executor(
                None,
                self._get_color_sync,
                color_id
            )
        except Exception as e:
            print(f"Error getting color: {str(e)}")
            return None

    def _get_color_sync(self, color_id: int) -> Optional[Dict[str, Any]]:
        """동기 방식으로 Color 가져오기"""
        conn = None
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                SELECT * FROM Color WHERE id = %s
                """
                cursor.execute(sql, (color_id,))
                result = cursor.fetchone()
                return result
        except Exception as e:
            print(f"Database error: {str(e)}")
            return None
        finally:
            if conn:
                conn.close()

    async def get_category(self, category_id: int) -> Optional[Dict[str, Any]]:
        """Category 가져오기"""
        loop = asyncio.get_event_loop()

        try:
            return await loop.run_in_executor(
                None,
                self._get_category_sync,
                category_id
            )
        except Exception as e:
            print(f"Error getting category: {str(e)}")
            return None

    def _get_category_sync(self, category_id: int) -> Optional[Dict[str, Any]]:
        """동기 방식으로 Category 가져오기"""
        conn = None
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                SELECT * FROM Category WHERE id = %s
                """
                cursor.execute(sql, (category_id,))
                result = cursor.fetchone()
                return result
        except Exception as e:
            print(f"Database error: {str(e)}")
            return None
        finally:
            if conn:
                conn.close()