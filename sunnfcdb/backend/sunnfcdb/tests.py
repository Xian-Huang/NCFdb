from django.test import SimpleTestCase
from .serializers import NewsSerializer


class NewsSerializerContentTests(SimpleTestCase):
    def test_new_news_requires_content(self):
        serializer = NewsSerializer(data={"title": "Missing article"})

        self.assertFalse(serializer.is_valid())
        self.assertIn("content", serializer.errors)

    def test_news_content_requires_six_hundred_english_words(self):
        serializer = NewsSerializer(data={"title": "Short update", "content": "short text\n\nsecond paragraph"})

        self.assertFalse(serializer.is_valid())
        self.assertIn("at least 600 English words", str(serializer.errors["content"][0]))

    def test_news_content_requires_multiple_paragraphs(self):
        content = " ".join(["sunflower"] * 600)
        serializer = NewsSerializer(data={"title": "Single paragraph", "content": content})

        self.assertFalse(serializer.is_valid())
        self.assertIn("at least two paragraphs", str(serializer.errors["content"][0]))

    def test_valid_long_form_news_content_is_accepted(self):
        paragraph = " ".join(["sunflower"] * 300)
        serializer = NewsSerializer(data={"title": "Long update", "content": f"{paragraph}\n\n{paragraph}"})

        self.assertTrue(serializer.is_valid(), serializer.errors)
