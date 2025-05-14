from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
import json

from .models import Event
from .serializers import EventSerializer
# Get the application directory
import os
from django.conf import settings

# Ensure the results directory exists
results_dir = os.path.join(settings.BASE_DIR, 'results')

class EventViewSet(viewsets.ModelViewSet):
    """
    EventViewSet is a Django REST framework viewset for managing Event objects. 
    It provides CRUD operations and additional custom actions for handling event results.
    Attributes:
        queryset (QuerySet): The queryset used to retrieve Event objects.
        serializer_class (Serializer): The serializer class used for Event objects.
    Methods:
        list(request):
            Retrieve a list of all Event objects.
            Returns serialized data of all events.
        create(request):
            Create a new Event object.
            Additionally, creates an empty JSON file to store results for the event.
            Returns the serialized data of the created event or validation errors.
        retrieve(request, pk=None):
            Retrieve a specific Event object by its primary key.
            Returns serialized data of the event.
        update(request, pk=None):
            Update an existing Event object.
            Returns the serialized data of the updated event or validation errors.
        destroy(request, pk=None):
            Delete a specific Event object by its primary key.
            Returns a 204 No Content response upon successful deletion.
        post_results(request, pk=None):
            Custom action to append results to an event's results JSON file.
            Accepts a single result or a list of results in JSON format.
            Returns a success message or an error message if the operation fails.
        get_results(request, pk=None):
            Custom action to retrieve results for a specific event.
            Reads the results from the event's JSON file.
            Returns the results data or an error message if the file is not found.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def list(self, request):
        """
        Retrieve a list of all Event objects.
        Returns serialized data of all events.
        """
        # Ensure the results directory exists
        if not os.path.exists(results_dir):
            os.makedirs(results_dir)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        """
        Create a new Event object.
        Additionally, creates an empty JSON file to store results for the event.
        Returns the serialized data of the created event or validation errors.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            # Create the results file
            with open(f"{results_dir}/{event.id}.json", "w") as f:
                json.dump([], f)
            # Return the created event data
            return Response(self.get_serializer(event).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Retrieve a specific Event object by its primary key.
        Returns serialized data of the event.
        """
        event = self.get_object()
        serializer = self.get_serializer(event)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """
        Update an existing Event object.
        Returns the serialized data of the updated event or validation errors.
        """
        event = self.get_object()
        serializer = self.get_serializer(event, data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(self.get_serializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a specific Event object by its primary key.
        Returns a 204 No Content response upon successful deletion.
        """
        event = self.get_object()
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def post_results(self, request, pk=None):
        """
        Rather than file upload, allow a single result/list of results to be added, in json form, which will be appended to the results json file.
        """
        event = self.get_object()
        # Assuming the results are in JSON format
        with open(f"results/{event.id}.json", "r") as f:
            results = json.load(f)
        if request.method == 'POST':
            try:
                data = request.data
                # Assuming the results are in JSON format
                if isinstance(data, list):
                    # Append the list of results to the existing results
                    results += data
                else:
                    # Append a single result to the existing results
                    results.append(data)
                # Save the updated results back to the file
                with open(f"results/{event.id}.json", "w") as f:
                    json.dump(results, f)
                return Response({'status': 'results updated'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=True, methods=['get'])
    def get_results(self, request, pk=None):
        """
        Get the results for a specific event.
        """
        event = self.get_object()
        try:
            with open(f"{results_dir}/{event.id}.json", "r") as f:
                results = json.load(f)
            return Response(results, status=status.HTTP_200_OK)
        except FileNotFoundError:
            return Response({'error': 'Results file not found'}, status=status.HTTP_404_NOT_FOUND)
    