from django.test import SimpleTestCase
from .serializers import NewsSerializer


class NewsSerializerContentTests(SimpleTestCase):
    def test_rejects_short_or_single_paragraph_content(self):
        short = NewsSerializer(data={"title": "Short", "content": "short\n\ntext"})
        single = NewsSerializer(data={"title": "Single", "content": " ".join(["sesame"] * 600)})

        self.assertFalse(short.is_valid())
        self.assertFalse(single.is_valid())

    def test_accepts_long_multi_paragraph_content(self):
        paragraph = " ".join(["sesame"] * 300)
        serializer = NewsSerializer(data={"title": "Valid", "content": f"{paragraph}\n\n{paragraph}"})

        self.assertTrue(serializer.is_valid(), serializer.errors)
