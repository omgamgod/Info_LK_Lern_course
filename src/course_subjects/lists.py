"""The linked lists, queues and stack subject."""
from .base import Subject


class ListsSubject(Subject):
    @classmethod
    def details(cls):
        return {
            "id": "C",
            "letter": "C",
            "title": "Listen",
            "color": "#c8322b",
            "desc": "Warteschlange, Trennung von Struktur und Daten, einfach verkettete Liste, das Entwurfsmuster Kompositum und der Stapel.",
        }


SUBJECT = ListsSubject
