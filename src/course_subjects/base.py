"""Shared interface and validation for course subjects."""
from abc import ABC, abstractmethod


class Subject(ABC):
    """Abstract definition for one navigable part of the course."""

    REQUIRED_FIELDS = ("id", "letter", "title", "color", "desc")

    @classmethod
    @abstractmethod
    def details(cls):
        """Return the display metadata for this subject."""

    @classmethod
    def to_part(cls):
        details = cls.details()
        if not isinstance(details, dict):
            raise ValueError(f"{cls.__name__}.details() must return a dictionary")
        missing = [key for key in cls.REQUIRED_FIELDS if key not in details]
        if missing:
            raise ValueError(f"{cls.__name__} is missing: {', '.join(missing)}")
        invalid = [key for key in cls.REQUIRED_FIELDS
                   if not isinstance(details[key], str) or not details[key].strip()]
        if invalid:
            raise ValueError(f"{cls.__name__} needs non-empty text for: {', '.join(invalid)}")
        return {**details, "lessons": []}
