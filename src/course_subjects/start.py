"""The course introduction subject."""
from .base import Subject


class StartSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "0",
            "letter": "0",
            "title": "Start",
            "color": "#17804b",
            "desc": "Wie der Kurs funktioniert und was du am Ende können wirst.",
        }


SUBJECT = StartSubject
