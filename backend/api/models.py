from django.db import models

# Create your models here.
class Event(models.Model):
    """
    Represents an event with details such as name, description, date, location, 
        and timestamps for creation and updates.
        Attributes:
            name (str): The name of the event, limited to 100 characters.
            description (str): A detailed description of the event.
            date (datetime): The date and time when the event is scheduled to occur.
            location (str): The location of the event, limited to 100 characters.
            created_at (datetime): The timestamp when the event was created. Automatically set on creation.
            updated_at (datetime): The timestamp when the event was last updated. Automatically updated on modification.
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

