"""The exam preparation subject."""
from .base import Subject


class ExamPrepSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "E",
            "letter": "E",
            "title": "Klausurvorbereitung",
            "color": "#a86a0b",
            "desc": "Spickzettel, gemischte Aufgaben über alle Themen und zwei komplette Probeklausuren mit Musterlösungen.",
        }


SUBJECT = ExamPrepSubject
