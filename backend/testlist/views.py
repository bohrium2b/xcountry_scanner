import json
from django.http import HttpResponse
from django.shortcuts import render
from barcode import Code128
from barcode.writer import SVGWriter
from weasyprint import HTML, CSS
from jinja2 import Environment, FileSystemLoader
from csv import DictReader
from django.conf import settings


# Create your views here.

def index(request):
    """Allows the user to upload a csv file, and map columns to user fields."""
    if request.method == 'POST':
        csv_file = request.FILES.get('csv_file') # Get the uploaded CSV file
        ################################
        # NO COLUMN MAPPING PROVIDED
        ################################
        if csv_file:
            # If the file is uploaded, read it and extract column names
            csv_file.seek(0)

        if not csv_file:
            # Try to get the file from the request body (when using the column mapping form, it is a post request)
            csv_file = request.POST.get('csv_file')
        # Read the CSV file and extract column names
        if not isinstance(csv_file, str):
            csv_file.seek(0)
        csv_string = csv_file if isinstance(csv_file, str) else csv_file.read().decode('utf-8')
        if csv_string:
            csv_reader = DictReader(csv_string.splitlines())
            column_names = csv_reader.fieldnames if csv_reader.fieldnames else []
        else:
            print("CSV string is empty or not valid.")
            return render(request, 'testlist/index.html', {'error': 'Invalid CSV file.'})
            column_names = []
        # If no column names are found, return an error
        #############################
        # COLUMN MAPPING PROVIDED
        #############################
        # If the column mapping is provided, process it
        # Check if the column mapping is provided in the request
        if 'column_mapping' not in request.POST:
            # If the column mapping is not provided, render the column mapping form
            print(f"CSV string: {str(csv_string)}")
            return render(request, 'testlist/column_mapping.html', {'csv_file': str(csv_string), 'column_names': column_names, 'user_fields': ['first_name', 'last_name', 'id', 'form_class']})
        # If the column mapping is provided, process it
        # If the column mapping is not provided, render the column mapping form
        column_mapping = json.loads(request.POST.get('column_mapping', '{}'))
        print(f"Column mapping from POST: {column_mapping}")  # Debugging line to check column mapping
        if not column_mapping:
            # Try to get column mapping from request post data as column_mapping[column_name] = user_field
            column_mapping = {key: value for key, value in request.POST.items() if key.startswith('column_mapping[') and key.endswith(']')}
            column_mapping = {key[len('column_mapping['):-1]: value for key, value in column_mapping.items()}
            print(f"Column mapping: {column_mapping}")  # Debugging line to check column mapping
        # If no column mapping is provided, render the column mapping form
        if not column_mapping:
            return render(request, 'testlist/column_mapping.html', {'csv_file': str(csv_string), 'column_names': column_names, 'user_fields': ['first_name', 'last_name', 'id', 'form_class']})
        print("CONTINUING WITH PDF")
        # If the column mapping is provided, process the CSV file
        if not isinstance(csv_file, str):
            csv_file.seek(0)
        # Process the CSV file and map columns to user fields
        print(csv_file)
        csv_reader = DictReader(csv_file.splitlines())
        users = []
        for row in csv_reader:
            user_data = {user_field: row[column_name] for user_field, column_name in column_mapping.items()}
            users.append(user_data)
            print(f"User data: {user_data}")  # Debugging line to check user data
        # Render the list of users with barcodes
        return HttpResponse(generate_pdf(users), content_type='application/pdf')
    else:
        return render(request, 'testlist/index.html')

# Utility functions
def generate_barcode_svg(data):
    """Generate a barcode SVG from the given data."""
    print(data)
    barcode = Code128(data, writer=SVGWriter())
    if not data:
        print("No data provided for barcode generation.")
        return ""
    return barcode.render().decode('utf-8')


def render_html(users:list):
    """Render the HTML template with user data."""
    env = Environment(loader=FileSystemLoader(settings.BASE_DIR / 'testlist/jinja_templates'))
    template = env.get_template('list.html')
    users = [{'first_name': user['first_name'], 'last_name': user['last_name'], 'id': user['id'], 'barcode': generate_barcode_svg(user['id'])} for user in users]
    return template.render(users=users)


def generate_pdf(users:list):
    """Generate a PDF from the rendered HTML."""
    html_content = render_html(users)
    html = HTML(string=html_content)
    # Open Bootstrap file and read its content
    with open("testlist/jinja_templates/bootstrap.min.css", "r") as f:
        css_content = f.read()
    css = CSS(string=css_content)
    pdf_file = html.write_pdf(stylesheets=[css])
    return pdf_file