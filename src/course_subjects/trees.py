"""The tree data structures subject."""
from .base import Subject


class TreesSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "D",
            "letter": "D",
            "title": "Bäume",
            "color": "#0b7a75",
            "desc": "Fachbegriffe rund um Bäume, der geordnete Binärbaum, Suchen und Einfügen, Aufwand und die Implementierung mit dem Kompositum.",
        }


SUBJECT = TreesSubject
