"""Tests for the modular course subject definitions."""
import importlib
import inspect
import json
import os
import unittest

from src.build import Subject, load_subjects


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class SubjectTests(unittest.TestCase):
    def test_manifest_order_and_subject_classes(self):
        with open(os.path.join(ROOT, "src", "subjects.json"), encoding="utf-8") as f:
            manifest = json.load(f)

        parts = load_subjects()
        self.assertEqual(len(parts), len(manifest["subjects"]))
        self.assertEqual([part["lessons"] for part in parts], [[] for _ in parts])

        for module_name, part in zip(manifest["subjects"], parts):
            module = importlib.import_module(f"course_subjects.{module_name}")
            subject_class = module.SUBJECT
            self.assertTrue(issubclass(subject_class, Subject))
            self.assertFalse(inspect.isabstract(subject_class))
            self.assertEqual(subject_class.to_part(), part)

    def test_subject_base_is_abstract_and_validates_metadata(self):
        self.assertTrue(inspect.isabstract(Subject))

        class MissingTitle(Subject):
            @classmethod
            def details(cls):
                return {
                    "id": "X",
                    "letter": "X",
                    "color": "#000000",
                    "desc": "Example subject",
                }

        with self.assertRaisesRegex(ValueError, "title"):
            MissingTitle.to_part()


if __name__ == "__main__":
    unittest.main()
