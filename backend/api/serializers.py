from rest_framework import serializers
import json
# Get the application directory
import os
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Ensure the results directory exists
results_dir = os.path.join(settings.BASE_DIR, 'results')

from .models import Event  # Adjust the import path based on your project structure

class EventSerializer(serializers.ModelSerializer):
    """
    EventSerializer is a Django REST Framework serializer for the Event model. It provides
    serialization and deserialization functionality, as well as custom methods for handling
    related JSON data files.
    Methods:
        results(obj):
            Retrieves the JSON data associated with the Event instance from a file.
            Returns an empty dictionary if the file is not found or the data is None.
        create(validated_data):
            Creates a new Event instance, saves it to the database, and initializes
            an empty JSON results file for the event.
        update(instance, validated_data):
            Updates an existing Event instance with the provided validated data and
            saves the changes to the database.
        delete(instance):
            Deletes an Event instance from the database and removes the associated
            JSON results file.
        validate(data):
            Validates the input data before creating or updating an Event instance.
            Ensures that required fields ('name', 'description', 'date', 'location')
            are present.
        to_representation(instance):
            Customizes the serialized representation of the Event instance by including
            the 'results' field, which is populated with data from the associated JSON file.
        Meta:
            model (Model): Specifies the Event model associated with the serializer.
            fields (list): Defines the fields to include in the serialized output.
            read_only_fields (tuple): Specifies fields that are read-only.
            extra_kwargs (dict): Additional keyword arguments for specific fields, such as
                                 making the 'results' field optional.
    """

    class Meta:
        """
        Meta class for the Event serializer.
        Attributes:
            model (Model): Specifies the model associated with the serializer (Event).
            fields (list): List of fields to include in the serialized output.
            read_only_fields (tuple): Fields that are read-only and cannot be modified.
            extra_kwargs (dict): Additional keyword arguments for specific fields, such as making the 'results' field optional.
        """
        model = Event
        fields = ["id", "url", "name", "description", "date", "location", "created_at", "updated_at"]  # Include all fields from the Event model
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'results': {'required': False}  # Make results field optional
        }
        
        @method_decorator(csrf_exempt)
        def dispatch(self, *args, **kwargs):
            """
            Decorator to exempt the view from CSRF verification.
            This is useful for API endpoints that need to accept requests
            from external sources without CSRF tokens.
            """
            return super().dispatch(*args, **kwargs)

        def results(self, obj):
            """
            The results field is a JSON file, given by 'results/id.json'.
            """
            objid = obj.id
            try:
                with open(f"{results_dir}/{objid}.json", "r") as f:
                    data = json.load(f)
            except FileNotFoundError:
                data = {}
            if data is None:
                data = {}
            return data
        
        def create(self, validated_data):
            """
            Create a new Event instance and save it to the database.
            """
            event = Event(**validated_data)
            event.save()
            # Create the results file
            with open(f"{results_dir}/{event.id}.json", "w") as f:
                json.dump([], f)
            return event
        
        def update(self, instance, validated_data):
            """
            Update an existing Event instance and save the changes to the database.
            """
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            return instance

        def delete(self, instance):
            """
            Delete an Event instance and remove the associated results file.
            """
            instance.delete()
            # Remove the results file
            try:
                os.remove(f"results/{instance.id}.json")
            except FileNotFoundError:
                pass
            return instance
        
        def validate(self, data):
            """
            Validate the data before creating or updating an Event instance.
            """
            if 'name' not in data:
                raise serializers.ValidationError("Name is required.")
            if 'description' not in data:
                raise serializers.ValidationError("Description is required.")
            if 'date' not in data:
                raise serializers.ValidationError("Date is required.")
            if 'location' not in data:
                raise serializers.ValidationError("Location is required.")
            return data
        
        def to_representation(self, instance):
            """
            Customize the representation of the Event instance.
            """
            representation = super().to_representation(instance)
            representation['results'] = self.results(instance)
            return representation