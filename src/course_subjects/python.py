"""The Python foundations subject."""
from .base import Subject


class PythonSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "A",
            "letter": "A",
            "title": "Python von null",
            "color": "#2445b5",
            "desc": "Alles, was du in Python brauchst, um die Kursthemen umzusetzen: Werte, Entscheidungen, Schleifen, Funktionen, Listen, Klassen, Referenzen, Vererbung.",
        }


SUBJECT = PythonSubject
