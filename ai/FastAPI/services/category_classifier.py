import torch
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import logging
from transformers import AutoImageProcessor, ViTForImageClassification
import open_clip

logger = logging.getLogger(__name__)

class CategoryClassifier:
    def __init__(self, use_clip=True):
        self.use_clip = use_clip
        self._init_models()

        # Define category mappings (from model prediction to our DB categories)
        self.deepfashion_category_map = {
            # Map from DeepFashion categories to our system categories
            # Tops
            'T-Shirt': 1, 'Blouse': 1, 'Shirt': 1, 'Tank': 1, 'Top': 1, 'Vest': 1,
            'Sweater': 1, 'Sweatshirt': 1, 'Polo': 1, 'Jersey': 1, 'Hoodie': 1,
            # Outerwear
            'Jacket': 2, 'Coat': 2, 'Blazer': 2, 'Cardigan': 2, 'Parka': 2,
            'Windbreaker': 2, 'Poncho': 2, 'Suit': 2, 'Jacket': 2,
            # Bottoms
            'Jeans': 3, 'Shorts': 3, 'Pants': 3, 'Skirt': 3, 'Leggings': 3,
            'Joggers': 3, 'Trousers': 3, 'Sweatpants': 3,
            # Shoes
            'Shoes': 4, 'Sneakers': 4, 'Boots': 4, 'Sandals': 4, 'Loafers': 4,
            'Flats': 4, 'Heels': 4, 'Slippers': 4,
            # Accessories (default to accessory category)
            'Bag': 5, 'Backpack': 5, 'Belt': 5, 'Wallet': 5, 'Hat': 5,
            'Scarf': 5, 'Sunglasses': 5, 'Watch': 5, 'Jewelry': 5
        }

        # Define our 5 categories and their IDs
        self.categories = {
            1: "상의",      # Tops
            2: "아우터",    # Outerwear
            3: "하의",      # Bottoms
            4: "신발",      # Shoes
            5: "악세사리"   # Accessories
        }

    def _init_models(self):
        try:
            if self.use_clip:
                # Initialize CLIP model for zero-shot classification
                logger.info("Initializing CLIP model...")
                self.clip_model, self.preprocess = open_clip.create_model_and_transforms(
                    'hf-hub:Marqo/marqo-fashionCLIP'
                )
                self.clip_tokenizer = open_clip.get_tokenizer('hf-hub:Marqo/marqo-fashionCLIP')
                self.clip_categories = ["tops", "outerwear", "bottoms", "shoes", "accessories"]
            else:
                # Initialize DeepFashion classifier
                logger.info("Initializing DeepFashion classifier...")
                model_name = "adityavithaldas/Fashion_Category_Classifier"
                self.processor = AutoImageProcessor.from_pretrained(model_name)
                self.model = ViTForImageClassification.from_pretrained(model_name)
                # Get the mapping of IDs to labels
                self.id2label = self.model.config.id2label
        except Exception as e:
            logger.error(f"Failed to initialize category classifier: {e}")
            raise

    def _download_image(self, image_url):
        """Download image from URL and convert to PIL Image"""
        response = requests.get(image_url)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert('RGB')

    def classify_with_clip(self, image):
        """Classify image using CLIP model"""
        # Prepare image
        img = self.preprocess(image).unsqueeze(0)

        # Prepare text prompts
        text = self.clip_tokenizer([f"a photo of {category} clothing" for category in self.clip_categories])

        # Get embeddings
        with torch.no_grad():
            image_features = self.clip_model.encode_image(img)
            text_features = self.clip_model.encode_text(text)

            # Normalize features
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)

            # Calculate similarity scores
            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)

        # Get the predicted category index
        values, indices = similarity[0].topk(1)
        category_idx = indices.item() + 1  # Add 1 because our categories start from 1, not 0

        return category_idx, self.categories[category_idx]

    def classify_with_deepfashion(self, image):
        """Classify image using DeepFashion classifier"""
        # Prepare image
        inputs = self.processor(images=image, return_tensors="pt")

        # Forward pass
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            predicted_idx = logits.argmax(-1).item()

        # Get the predicted category
        predicted_label = self.id2label[predicted_idx]

        # Map to our category system
        if predicted_label in self.deepfashion_category_map:
            category_id = self.deepfashion_category_map[predicted_label]
        else:
            # Default to tops if not found
            category_id = 1

        return category_id, self.categories[category_id]

    def classify_from_url(self, image_url):
        """Classify category from image URL"""
        try:
            # Download image
            image = self._download_image(image_url)

            # Classify using selected method
            if self.use_clip:
                return self.classify_with_clip(image)
            else:
                return self.classify_with_deepfashion(image)

        except Exception as e:
            logger.error(f"Failed to classify image from URL {image_url}: {e}")
            # Default to tops if classification fails
            return 1, "상의"