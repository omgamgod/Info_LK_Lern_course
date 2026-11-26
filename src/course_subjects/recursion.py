"""The recursion and graph algorithms subject."""
from .base import Subject


class RecursionSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "B",
            "letter": "B",
            "title": "Rekursion",
            "color": "#6d3fc0",
            "desc": "Rekursion, Backtracking, Graphen und Tiefensuche, optimale Lösungen mit Tiefensuche.",
        }


SUBJECT = RecursionSubject
